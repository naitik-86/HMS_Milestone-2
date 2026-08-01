terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Local state for the testing stage. Move this to an S3 backend
  # (with DynamoDB locking) before multiple people run Terraform,
  # or before standing up the production environment.
  # backend "s3" {
  #   bucket = "hms-terraform-state"
  #   key    = "testing/terraform.tfstate"
  #   region = "ap-south-1"
  # }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}
