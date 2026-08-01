# --- Testing server (server 2) - Ubuntu-based, separate from the
#     Amazon-Linux production instance in ec2.tf. Everything in this file
#     is a distinct, additively-named resource set (suffixed _testing) so
#     it never touches or interferes with production's resources/state.
#
# IMPORTANT: this describes infrastructure that ALREADY EXISTS (built
# manually via AWS CLI on 2026-08-01/02, not originally via Terraform).
# Running `terraform apply` right now would try to create a SECOND,
# duplicate set of resources alongside the real ones. Before applying:
#   - Either `terraform import` each resource below (see README.md), or
#   - Only run `apply` for real if the original testing server has
#     actually been lost and needs to be rebuilt from scratch.

data "aws_ami" "ubuntu_testing" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "backend_testing" {
  name        = "${var.testing_project_name}-backend-sg"
  description = "Testing backend EC2 instance: SSH + HTTP + frontend/backend ports"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API (Docker on port 5000, mapped to host port 80)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend nginx fallback (direct IP:8080 access)"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.testing_project_name}-backend-sg"
  }
}

resource "aws_instance" "backend_testing" {
  ami                    = data.aws_ami.ubuntu_testing.id
  instance_type          = var.testing_instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.backend_testing.id]
  key_name               = aws_key_pair.deploy_key.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile_testing.name

  user_data = file("${path.module}/../scripts/ec2-user-data-testing.sh")

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  # Same reasoning as production's ec2.tf - never let a routine apply
  # force-replace this instance just because AWS published a newer Ubuntu
  # AMI since this was created.
  lifecycle {
    ignore_changes = [ami]
  }

  tags = {
    Name = "${var.testing_project_name}-backend"
  }
}

resource "aws_eip" "backend_testing" {
  instance = aws_instance.backend_testing.id
  domain   = "vpc"

  tags = {
    Name = "${var.testing_project_name}-backend-eip"
  }
}
