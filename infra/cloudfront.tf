# CloudFront in front of the S3 website endpoint - gives free HTTPS via the
# default *.cloudfront.net domain (no ACM cert / custom domain needed) and
# properly fixes SPA-routing 404s (S3 website hosting alone serves the
# right content on a 404 but can't rewrite the status code to 200).
#
# Uses the S3 *website* endpoint as a custom origin (not the REST/OAC
# pattern) so the existing public bucket + website config keep working
# exactly as before - this is purely additive, doesn't change S3 or EC2.

# SPA routing is handled by rewriting the request URI at the edge (below),
# NOT via custom_error_response - that setting is distribution-wide, not
# per-origin/per-behavior, so it would intercept genuine 404s from the
# backend API (routed via the /api/* behavior) too, silently replacing real
# JSON error responses with the frontend's index.html. This function only
# runs on the default (S3) behavior, so /api/* is unaffected.
resource "aws_cloudfront_function" "spa_routing" {
  name    = "${var.project_name}-spa-routing"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite non-file paths to /index.html for client-side routing"
  publish = true
  code    = <<-EOT
    function handler(event) {
        var request = event.request;
        var uri = request.uri;

        if (!uri.includes('.')) {
            request.uri = '/index.html';
        }

        return request;
    }
  EOT
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # cheapest tier - NA/EU edge locations only, fine for testing

  origin {
    origin_id   = "s3-website"
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint

    custom_origin_config {
      origin_protocol_policy = "http-only" # S3 website endpoints don't support HTTPS
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Proxies /api/* to the backend EC2 instance so the frontend (served over
  # HTTPS via this same distribution) can call the API without the browser's
  # Mixed Content block, which kicks in the moment an HTTPS page tries to
  # call a plain-HTTP endpoint directly. CloudFront talks to the backend
  # over HTTP (fine - that hop is AWS-internal, EC2 has no TLS listener),
  # the browser only ever talks HTTPS to this one CloudFront domain for
  # both the app and the API. Domain name is built from the Elastic IP
  # because CloudFront custom origins need a DNS name, not a bare IP - AWS
  # auto-generates one per public IP in this exact format.
  origin {
    origin_id   = "ec2-backend"
    domain_name = "ec2-${replace(aws_eip.backend.public_ip, ".", "-")}.${var.aws_region}.compute.amazonaws.com"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "ec2-backend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type", "Accept", "Origin"]
      cookies {
        forward = "all"
      }
    }

    # API responses are never cached - every request must reach the backend.
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  default_cache_behavior {
    target_origin_id       = "s3-website"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # Respect the Cache-Control headers already set by deploy-frontend.yml
    # (no-cache on index.html, 1-year immutable on hashed assets) rather
    # than imposing CloudFront's own TTL on top.
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 31536000

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_routing.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-frontend-cdn"
  }
}
