output "backend_public_ip" {
  description = "Elastic IP of the backend EC2 instance. Point deploy-backend.yml's EC2_HOST secret and MongoDB Atlas network access at this."
  value       = aws_eip.backend.public_ip
}

output "backend_url" {
  description = "Base URL of the backend API"
  value       = "http://${aws_eip.backend.public_ip}"
}

output "frontend_website_endpoint" {
  description = "S3 static website URL for the frontend"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "frontend_cloudfront_url" {
  description = "HTTPS frontend URL via CloudFront - use this one, it's the only one with TLS (needed for browser geolocation etc.) and doesn't have the S3 404-on-refresh issue"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Needed for the GitHub secret CLOUDFRONT_DISTRIBUTION_ID (cache invalidation after each deploy)"
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.id
}

output "uploads_bucket_name" {
  value = aws_s3_bucket.uploads.id
}

output "github_actions_deployer_user" {
  description = "IAM user name — create its access key manually (see docs/02-aws-credentials-and-iam.md), don't put the key in Terraform state"
  value       = aws_iam_user.github_actions_deployer.name
}

output "ssh_command" {
  description = "SSH into the backend instance"
  value       = "ssh -i ~/.ssh/hms-deploy-key ec2-user@${aws_eip.backend.public_ip}"
}

# --- Testing server (server 2) outputs ---

output "testing_backend_public_ip" {
  description = "Elastic IP of the testing backend EC2 instance"
  value       = aws_eip.backend_testing.public_ip
}

output "testing_frontend_cloudfront_url" {
  description = "HTTPS frontend URL for the testing server"
  value       = "https://${aws_cloudfront_distribution.frontend_testing.domain_name}"
}

output "testing_cloudfront_distribution_id" {
  description = "Needed for the testing repo's CLOUDFRONT_DISTRIBUTION_ID secret"
  value       = aws_cloudfront_distribution.frontend_testing.id
}

output "testing_frontend_bucket_name" {
  value = aws_s3_bucket.frontend_testing.id
}

output "testing_github_actions_deployer_user" {
  description = "IAM user name for this repo's GitHub Actions - create its access key manually, don't put it in Terraform state"
  value       = aws_iam_user.github_actions_deployer_testing.name
}

output "testing_ssh_command" {
  description = "SSH into the testing backend instance"
  value       = "ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@${aws_eip.backend_testing.public_ip}"
}
