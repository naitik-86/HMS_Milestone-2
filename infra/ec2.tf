# Use the default VPC for the testing stage — no custom networking needed.
# Production should use a purpose-built VPC (see docs/09-production-upgrade-path.md).

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "deploy_key" {
  key_name   = "${var.project_name}-deploy-key"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

resource "aws_security_group" "backend" {
  name        = "${var.project_name}-backend-sg"
  description = "Backend EC2 instance: SSH (restricted) + HTTP (public)"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH - GitHub Actions hosted runners use dynamic IPs, so this is open to any source for the testing stage. See docs/09-production-upgrade-path.md for switching to SSM (no open port needed)."
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from anywhere (backend API, testing stage - no TLS yet)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from anywhere (frontend static hosting on EC2, fallback for networks that block the S3 website endpoint - see docs/06)"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API (Docker on port 5000, routed by CloudFront)"
    from_port   = 5000
    to_port     = 5000
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
    Name = "${var.project_name}-backend-sg"
  }
}

resource "aws_instance" "backend" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.backend.id]
  key_name               = aws_key_pair.deploy_key.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = templatefile("${path.module}/../scripts/ec2-user-data.sh.tpl", {
    container_port = var.backend_container_port
  })

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  # The AMI data source above always resolves to whatever AWS's most recent
  # AL2023 AMI is *at plan time* - without this, any `terraform apply` run
  # long after initial creation (AWS regularly publishes new AL2023 AMIs)
  # would see the resolved AMI ID as "changed" and force-replace this
  # instance, destroying everything set up manually on it (.env, running
  # containers) even for a completely unrelated change elsewhere in the
  # config. This actually happened once - see docs/08-deployment-runbook.md.
  lifecycle {
    ignore_changes = [ami]
  }

  tags = {
    Name = "${var.project_name}-backend"
  }
}

resource "aws_eip" "backend" {
  instance = aws_instance.backend.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-backend-eip"
  }
}
