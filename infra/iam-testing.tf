# --- Testing server (server 2) EC2 instance role - same S3-uploads access
#     pattern as production's ec2_role (iam.tf), plus ECR read-only to
#     match the real role's current permissions. ---

resource "aws_iam_role" "ec2_role_testing" {
  name               = "${var.testing_project_name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

resource "aws_iam_role_policy" "ec2_s3_uploads_testing" {
  name   = "${var.testing_project_name}-ec2-s3-uploads"
  role   = aws_iam_role.ec2_role_testing.id
  policy = data.aws_iam_policy_document.ec2_s3_uploads.json
}

resource "aws_iam_role_policy_attachment" "ec2_ecr_readonly_testing" {
  role       = aws_iam_role.ec2_role_testing.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2_profile_testing" {
  name = "${var.testing_project_name}-ec2-profile"
  role = aws_iam_role.ec2_role_testing.name
}

# --- GitHub Actions deploy user for HMS_Milestone-2's own workflows.
#     Scoped ONLY to the testing frontend bucket + testing CloudFront
#     distribution - this is deliberately narrow. A previous incident
#     (see docs/handoff/HMS-Session-Bug-Log.md) happened because this
#     user's bucket access was too broad and briefly overlapped with
#     production's bucket - never widen this beyond the testing bucket. ---

resource "aws_iam_user" "github_actions_deployer_testing" {
  name = "${var.testing_project_name}-github-actions-deployer"
}

data "aws_iam_policy_document" "github_actions_frontend_deploy_testing" {
  statement {
    sid = "FrontendBucketObjectAccess"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:GetObject",
    ]
    resources = ["${aws_s3_bucket.frontend_testing.arn}/*"]
  }

  statement {
    sid       = "FrontendBucketListAccess"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.frontend_testing.arn]
  }

  statement {
    sid       = "CloudFrontInvalidation"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = [aws_cloudfront_distribution.frontend_testing.arn]
  }
}

resource "aws_iam_user_policy" "github_actions_frontend_deploy_testing" {
  name   = "${var.testing_project_name}-frontend-deploy"
  user   = aws_iam_user.github_actions_deployer_testing.name
  policy = data.aws_iam_policy_document.github_actions_frontend_deploy_testing.json
}
