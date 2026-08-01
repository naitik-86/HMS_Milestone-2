# --- EC2 instance role: lets the backend talk to the uploads S3 bucket
#     without any static AWS keys in .env ---

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2_role" {
  name               = "${var.project_name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

data "aws_iam_policy_document" "ec2_s3_uploads" {
  statement {
    sid = "UploadsBucketObjectAccess"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.uploads.arn}/*"]
  }

  statement {
    sid       = "UploadsBucketListAccess"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.uploads.arn]
  }
}

resource "aws_iam_role_policy" "ec2_s3_uploads" {
  name   = "${var.project_name}-ec2-s3-uploads"
  role   = aws_iam_role.ec2_role.id
  policy = data.aws_iam_policy_document.ec2_s3_uploads.json
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# --- GitHub Actions deploy user: only allowed to sync the frontend bucket.
#     No access key is created here on purpose — create it manually via:
#     aws iam create-access-key --user-name <this user's name> --profile hms-admin
#     (see docs/02-aws-credentials-and-iam.md) ---

resource "aws_iam_user" "github_actions_deployer" {
  name = "${var.project_name}-github-actions-deployer"
}

data "aws_iam_policy_document" "github_actions_frontend_deploy" {
  statement {
    sid = "FrontendBucketObjectAccess"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
  }

  statement {
    sid       = "FrontendBucketListAccess"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.frontend.arn]
  }

  statement {
    sid       = "CloudFrontInvalidation"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.frontend.arn]
  }
}

resource "aws_iam_user_policy" "github_actions_frontend_deploy" {
  name   = "${var.project_name}-frontend-deploy"
  user   = aws_iam_user.github_actions_deployer.name
  policy = data.aws_iam_policy_document.github_actions_frontend_deploy.json
}
