# --- Testing server (server 2) frontend bucket only. Uploaded documents
#     stay in the SAME uploads bucket as production (aws_s3_bucket.uploads
#     in s3.tf) - this was a deliberate choice, since both servers share
#     one MongoDB database and clinic documents need to be visible from
#     either server. Do NOT create a second uploads bucket. ---

resource "aws_s3_bucket" "frontend_testing" {
  bucket = var.testing_frontend_bucket_name
}

resource "aws_s3_bucket_website_configuration" "frontend_testing" {
  bucket = aws_s3_bucket.frontend_testing.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_testing" {
  bucket = aws_s3_bucket.frontend_testing.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "frontend_testing_public_read" {
  statement {
    sid       = "PublicReadGetObject"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend_testing.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_testing" {
  bucket     = aws_s3_bucket.frontend_testing.id
  policy     = data.aws_iam_policy_document.frontend_testing_public_read.json
  depends_on = [aws_s3_bucket_public_access_block.frontend_testing]
}
