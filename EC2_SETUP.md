# EC2 Setup Guide — HMS Testing Environment

## 1. Launch EC2 instance

- AMI: **Amazon Linux 2023** (or Ubuntu 22.04)
- Instance type: **t3.small** (2 vCPU / 2 GB RAM — sufficient for testing)
- Security Group inbound rules:
  | Port | Source       | Purpose              |
  |------|-------------|----------------------|
  | 22   | Your IP only | SSH                  |
  | 80   | 0.0.0.0/0   | Frontend (HTTP)      |
  | 5000 | 0.0.0.0/0   | Backend API          |
- Attach an IAM Role with `AmazonEC2ContainerRegistryReadOnly` policy so the instance can pull from ECR.

---

## 2. Bootstrap the instance (run once via SSH)

```bash
# Install Docker
sudo yum update -y                          # Amazon Linux
sudo yum install -y docker git
sudo service docker start
sudo usermod -aG docker ec2-user

# Install Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install AWS CLI (for ECR login)
sudo yum install -y awscli

# Log out and back in so docker group takes effect
exit
```

---

## 3. Create the backend .env on the instance

```bash
mkdir -p ~/hms
nano ~/hms/.env          # paste contents from backend/.env.example with real values
```

The `docker-compose.yml` mounts this file into the backend container via `env_file`.

---

## 4. Create ECR repositories (run once from your local machine)

```bash
AWS_REGION=ap-south-1   # change to your region

aws ecr create-repository --repository-name hms-backend  --region $AWS_REGION
aws ecr create-repository --repository-name hms-frontend --region $AWS_REGION
```

Note the registry URI output (e.g. `123456789.dkr.ecr.ap-south-1.amazonaws.com`).

---

## 5. Add GitHub Actions secrets

Go to **GitHub repo → Settings → Secrets → Actions** and add:

| Secret            | Value                                                  |
|-------------------|--------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`    | IAM user key with ECR push + EC2 describe permissions |
| `AWS_SECRET_ACCESS_KEY`| IAM user secret                                       |
| `AWS_REGION`           | e.g. `ap-south-1`                                    |
| `ECR_REGISTRY`         | e.g. `123456789.dkr.ecr.ap-south-1.amazonaws.com`   |
| `EC2_HOST`             | Public IP or DNS of your EC2 instance                 |
| `EC2_USER`             | `ec2-user` (Amazon Linux) or `ubuntu` (Ubuntu)        |
| `EC2_SSH_KEY`          | Contents of your `.pem` private key file              |
| `VITE_API_URL`         | `http://<EC2_PUBLIC_IP>:5000`                         |

---

## 6. Deploy

Push to `main` or `develop` — GitHub Actions will:
1. Build both Docker images
2. Push them to ECR
3. SSH into EC2, pull the new images, and restart containers

First deploy takes ~3 minutes. Subsequent deploys ~90 seconds.

---

## 7. Access

| Service  | URL                            |
|----------|--------------------------------|
| Frontend | `http://<EC2_PUBLIC_IP>`       |
| Backend  | `http://<EC2_PUBLIC_IP>:5000`  |
| Health   | `http://<EC2_PUBLIC_IP>:5000/health` |

Share the EC2 public IP with your dev team.

---

## Manual deploy (without CI/CD)

```bash
# On your local machine
docker compose build
docker compose push

# On EC2
cd ~/hms
ECR_REGISTRY=<your-registry> IMAGE_TAG=latest docker compose up -d
```
