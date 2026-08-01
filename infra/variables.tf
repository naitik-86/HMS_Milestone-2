variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "aws_profile" {
  description = "Local AWS CLI profile Terraform should use"
  type        = string
  default     = "hms-admin"
}

variable "project_name" {
  description = "Short name used as a prefix for all resource names"
  type        = string
  default     = "hms-testing"
}

variable "instance_type" {
  description = "EC2 instance type for the backend host"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key file used to access the EC2 instance"
  type        = string
  default     = "~/.ssh/hms-deploy-key.pub"
}

variable "backend_container_port" {
  description = "Port the backend Docker container listens on internally"
  type        = number
  default     = 5000
}

variable "frontend_bucket_name" {
  description = "Globally-unique S3 bucket name for the frontend static site"
  type        = string
}

variable "uploads_bucket_name" {
  description = "Globally-unique S3 bucket name for backend file uploads"
  type        = string
}

# --- Testing server (server 2) - see ec2-testing.tf/s3-testing.tf/
#     cloudfront-testing.tf/iam-testing.tf. Kept as separate variables
#     (not a reused project_name) so both environments can be planned/
#     applied independently without name collisions. ---

variable "testing_project_name" {
  description = "Short name used as a prefix for all testing-server resource names"
  type        = string
  default     = "hms-milestone2"
}

variable "testing_instance_type" {
  description = "EC2 instance type for the testing backend host"
  type        = string
  default     = "t3.small"
}

variable "testing_frontend_bucket_name" {
  description = "Globally-unique S3 bucket name for the testing server's frontend static site"
  type        = string
}
