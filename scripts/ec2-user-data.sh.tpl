#!/bin/bash
# Runs once on first boot (EC2 user-data). Installs Docker and prepares
# /opt/app for the GitHub Actions deploy workflow to git-clone into.
set -euxo pipefail

dnf update -y
dnf install -y docker git

systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

mkdir -p /opt/app
chown ec2-user:ec2-user /opt/app

# The backend container will be run by the deploy workflow with:
#   docker run -d --name hms-backend --restart unless-stopped \
#     -p 80:${container_port} --env-file /opt/app/backend/.env <image>
#
# /opt/app/backend/.env is created once, manually, in the "First deploy"
# section of docs/05-docker-backend.md — it is NOT part of the git repo
# and is NOT overwritten by future deploys.
echo "user-data bootstrap complete" > /var/log/hms-bootstrap.log
