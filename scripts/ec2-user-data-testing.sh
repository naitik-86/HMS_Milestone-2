#!/bin/bash
# Runs once on first boot (EC2 user-data) on the testing server (Ubuntu,
# unlike production's Amazon Linux - see docs/00-overview.md for why).
# Installs Docker, git, and AWS CLI, then prepares /opt/app for the
# deploy-backend.yml / deploy-frontend.yml workflows to copy into.
set -euxo pipefail

apt-get update -y
apt-get install -y docker.io git unzip curl

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

# AWS CLI v2 - needed for the mongosh-in-docker OTP-debugging pattern
# documented in docs/10-application-notes.md, and generally useful for
# any future ad-hoc AWS calls run directly on this box.
curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
/tmp/aws/install
rm -rf /tmp/awscliv2.zip /tmp/aws

mkdir -p /opt/app
chown ubuntu:ubuntu /opt/app

# The backend container is run by deploy-backend.yml with:
#   docker run -d --name hms-backend --restart unless-stopped \
#     -p 80:5000 --env-file /opt/app/backend/.env hms-backend:latest
#
# /opt/app/backend/.env is created once, manually, and is NOT part of the
# git repo and NOT overwritten by future deploys - see docs/05-docker-backend.md.
echo "hms testing server bootstrap complete" > /var/log/hms-bootstrap.log
