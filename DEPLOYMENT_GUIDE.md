# HMS Veterinary SaaS — Complete Deployment Guide
### Docker + AWS EC2 + MongoDB Atlas | Testing & Production Environment

---

## Real Environment Values (Testing)

| Item | Value |
|------|-------|
| EC2 Public IP | `13.232.125.254` |
| EC2 User | `ubuntu` |
| EC2 Region | `ap-south-1` (Mumbai) |
| EC2 AMI | Ubuntu Server 24.04 LTS |
| ECR Registry | `232261469028.dkr.ecr.ap-south-1.amazonaws.com` |
| MongoDB Cluster | `cluster0.lponosn.mongodb.net` |
| MongoDB DB Name | `hms_db` |
| MongoDB User | `mayank_db_user` |
| SSH Key | `hms-Key.pem` (at `/Volumes/Testing/hms/hms-Key.pem`) |
| Frontend URL | `http://13.232.125.254` |
| Backend API URL | `http://13.232.125.254:5000` |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Prerequisites & Accounts](#3-prerequisites--accounts)
4. [Step 1 — MongoDB Atlas Setup](#step-1--mongodb-atlas-setup)
5. [Step 2 — AWS IAM User Setup](#step-2--aws-iam-user-setup)
6. [Step 3 — AWS ECR — Create Image Repositories](#step-3--aws-ecr--create-image-repositories)
7. [Step 4 — Launch EC2 Instance](#step-4--launch-ec2-instance)
8. [Step 5 — Bootstrap EC2 (Docker + AWS CLI)](#step-5--bootstrap-ec2-docker--aws-cli)
9. [Step 6 — Configure Environment Variables on EC2](#step-6--configure-environment-variables-on-ec2)
10. [Step 7 — Add GitHub Actions Secrets](#step-7--add-github-actions-secrets)
11. [Step 8 — Project File Reference](#step-8--project-file-reference)
12. [Step 9 — First Deploy](#step-9--first-deploy)
13. [Step 10 — Verify the Deployment](#step-10--verify-the-deployment)
14. [Ongoing Workflow](#ongoing-workflow)
15. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview

**Project:** WebArclight Veterinary HMS (Hospital Management System)
**Type:** Multi-tenant SaaS for veterinary clinics

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TailwindCSS |
| Backend | Node.js + Express REST API |
| Database | MongoDB Atlas (Cluster0, M0 Free Tier) |
| File Store | AWS S3 + Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer (SMTP via Gmail) |
| Container | Docker + Docker Compose |
| Registry | AWS ECR |
| Hosting | AWS EC2 (Ubuntu 24.04, t3.small) |
| CI/CD | GitHub Actions |

**User roles:** Super Admin, Clinic Admin, Doctor, Reception, Pre-Consultation Staff, Lab Technician, Groomer, Kennel Staff

---

## 2. Architecture Summary

```
Developer pushes code
        │
        ▼
   GitHub (main / develop branch)
        │
        ▼
  GitHub Actions CI/CD
   ├── build backend image  ──► push to AWS ECR
   └── build frontend image ──► push to AWS ECR
        │
        ▼ SSH
   AWS EC2 (Ubuntu 24.04, t3.small) — 13.232.125.254
   ├── hms_frontend  (nginx : port 80)   ◄── React app
   └── hms_backend   (node  : port 5000) ◄── Express API
        │                          │
        ▼                          ▼
  MongoDB Atlas              Cloudinary / S3
  cluster0.lponosn.mongodb.net   (file uploads)
```

**Dev / Client access:** `http://13.232.125.254` (frontend) and `http://13.232.125.254:5000` (API)

---

## 3. Prerequisites & Accounts

- [ ] GitHub account with HMS repo pushed
- [ ] AWS account — IAM user `hms-cicd-user` with ECR access
- [ ] MongoDB Atlas account — https://cloud.mongodb.com (Project: HMS)
- [ ] AWS CLI installed and configured locally
- [ ] Docker Desktop installed locally
- [ ] SSH key: `hms-Key.pem` at `/Volumes/Testing/hms/hms-Key.pem`

---

## Step 1 — MongoDB Atlas Setup

### Current State (already configured)

| Item | Value |
|------|-------|
| Organization | MAYANK's Org - 2025-08-28 |
| Project | HMS |
| Cluster | Cluster0 (M0 Free Tier) |
| Region | AWS / Mumbai (ap-south-1) |
| DB User 1 | `hms_user` — HMS Testing Server |
| DB User 2 | `mayank_db_user` — used in backend .env |
| EC2 IP whitelisted | `13.232.125.254/32` |

### 1.1 Create a cluster (already done)

If setting up fresh:
1. Go to https://cloud.mongodb.com → sign in
2. Click **"Build a Database"** → choose **M0 Free Tier**
3. Select AWS, region: **ap-south-1 (Mumbai)**
4. Name: `Cluster0` → Click **"Create"**

### 1.2 Create a database user

1. Left sidebar → **Security → Database & Network Access**
2. Click **"Database Access"** tab → **"+ Add New Database User"**
3. Authentication Method: **Password**
4. Username: `hms_user` (or any name)
5. Click **"Autogenerate Secure Password"** → **Copy** and save it
6. Built-in Role: **Atlas admin**
7. Click **"Add User"**

> Note: `mayank_db_user` was created by the developer and is already used in the backend `.env`.

### 1.3 Whitelist EC2 IP

1. Left sidebar → **Security → Database & Network Access**
2. Click **"Network Access"** tab → **"+ Add IP Address"**
3. Enter: `13.232.125.254/32`
4. Comment: `HMS_EC2_IPAddress`
5. Click **"Confirm"**

> Current IP Access List:
> - `13.232.125.254/32` — HMS_EC2_IPAddress — Active
> - `0.0.0.0/0` — Auto Setup — Active (remove before production)

### 1.4 Get connection string

1. Left sidebar → **Database** → click **"Connect"** on Cluster0
2. Choose **"Drivers"** → Driver: Node.js → Version: 5.5 or later
3. Copy the URI and format it as:

```
mongodb+srv://mayank_db_user:<password>@cluster0.lponosn.mongodb.net/hms_db?retryWrites=true&w=majority
```

---

## Step 2 — AWS IAM User Setup

### 2.1 Create IAM user for CI/CD

1. AWS Console → IAM → Users → Create User
2. Username: `hms-cicd-user`
3. Attach policy: `AmazonEC2ContainerRegistryPowerUser`
4. Click **"Create user"**

### 2.2 Generate access keys

1. Click `hms-cicd-user` → Security credentials → **"Create access key"**
2. Use case: **"Application running outside AWS"**
3. Download the CSV → save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

> ⚠️ You cannot view the secret key again after leaving this page.

### 2.3 Create EC2 IAM Role

1. IAM → Roles → Create Role → AWS service → EC2
2. Attach policy: `AmazonEC2ContainerRegistryReadOnly`
3. Role name: `Hms-ec2-ecr-role`
4. Click **"Create role"**

> This role is already attached to the EC2 instance (`Hms-ec2-ecr-role`).

---

## Step 3 — AWS ECR — Create Image Repositories

### Already created repositories

```
232261469028.dkr.ecr.ap-south-1.amazonaws.com/hms-backend
232261469028.dkr.ecr.ap-south-1.amazonaws.com/hms-frontend
```

**ECR_REGISTRY = `232261469028.dkr.ecr.ap-south-1.amazonaws.com`**

### To create fresh (if needed)

```bash
# Configure AWS CLI
aws configure
# AWS Access Key ID: <hms-cicd-user key>
# AWS Secret Access Key: <hms-cicd-user secret>
# Default region: ap-south-1
# Default output: json

aws ecr create-repository --repository-name hms-backend  --region ap-south-1
aws ecr create-repository --repository-name hms-frontend --region ap-south-1
```

---

## Step 4 — Launch EC2 Instance

### Current instance details

| Setting | Value |
|---------|-------|
| Name | hms-testing-server |
| AMI | Ubuntu Server 24.04 LTS (ami-006f82a1d5a27da54) |
| Instance type | t3.small (2 vCPU, 2 GB RAM) |
| Public IP | `13.232.125.254` |
| Private IP | `10.0.1.99` |
| Key pair | `hms-Key.pem` |
| IAM profile | `Hms-ec2-ecr-role` |
| VPC | `vpc-092ae01c525a0ed7a (hms-server)` |
| Subnet | `hms_Pub_SN` (ap-south-1a) |

### Security Group inbound rules

| Port | Source | Purpose |
|------|--------|---------|
| 22 | 0.0.0.0/0 | SSH |
| 80 | 0.0.0.0/0 | Frontend (React app) |
| 5000 | 0.0.0.0/0 | Backend API |

### To launch a fresh instance

1. EC2 → Launch Instance
2. Name: `hms-testing-server`
3. AMI: **Ubuntu Server 24.04 LTS** (not Amazon Linux — use `apt` not `yum`)
4. Instance type: **t3.small**
5. Key pair: Create new → `hms-Key` → Download `.pem`
6. Auto-assign Public IP: **Enable**
7. Security Group: add ports 22, 80, 5000
8. Storage: 20 GB gp3
9. Advanced details → IAM instance profile → `Hms-ec2-ecr-role`
10. Click **"Launch Instance"**

### SSH into instance

```bash
chmod 400 /Volumes/Testing/hms/hms-Key.pem
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
```

> ⚠️ Username is `ubuntu` (not `ec2-user`) — this is Ubuntu 24.04.

---

## Step 5 — Bootstrap EC2 (Docker + AWS CLI)

> ⚠️ This is Ubuntu 24.04 — use `apt` not `yum`.

SSH into the instance:
```bash
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
```

Run these commands one by one:

```bash
# Update packages
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install AWS CLI (via snap — apt package not available on Ubuntu 24.04)
sudo snap install aws-cli --classic

# Create working directory
mkdir -p ~/hms

# Verify installations
docker --version && docker compose version && aws --version

# Log out so docker group takes effect
exit
```

SSH back in and verify:
```bash
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
docker ps   # should return empty list without error
```

---

## Step 6 — Configure Environment Variables on EC2

### Copy .env from local machine to EC2

```bash
scp -i /Volumes/Testing/hms/hms-Key.pem \
  /Volumes/Testing/hms/HMS_Milestone-2/backend/.env \
  ubuntu@13.232.125.254:~/hms/.env
```

### Verify it copied correctly

```bash
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
cat ~/hms/.env
```

### Complete backend .env (production values)

```env
# ── Server ────────────────────────────────────────────────────────────────
PORT=5000
NODE_ENV=production

# ── MongoDB Atlas ─────────────────────────────────────────────────────────
# Cluster: Cluster0 | Region: AWS Mumbai (ap-south-1) | User: mayank_db_user
MONGO_URI=mongodb+srv://mayank_db_user:ZFWhxsCjU5JxL4uR@cluster0.lponosn.mongodb.net/hms_db?retryWrites=true&w=majority

# ── Auth (JWT) ────────────────────────────────────────────────────────────
JWT_SECRET=hms_super_secret_jwt_2026_webarclight_xK9mP2qR

# ── Super Admin ───────────────────────────────────────────────────────────
SUPER_ADMIN_MOBILE=7500447866

# ── Frontend URL (CORS allowlist) ─────────────────────────────────────────
FRONTEND_URL=http://13.232.125.254

# ── Razorpay ──────────────────────────────────────────────────────────────
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# ── AWS S3 ────────────────────────────────────────────────────────────────
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=

# ── Email / SMTP ──────────────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=smartvetdr@gmail.com
SMTP_PASSWORD=agpyyombwixmkpsq
FROM_NAME="HMS Platform"
FROM_EMAIL=smartvetdr@gmail.com

# ── Cloudinary ────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=dulxydos7
CLOUDINARY_API_KEY=224328736491543
CLOUDINARY_API_SECRET=OYoR8Db3YRo7tKZAQxMJ7llI6ao
```

Protect the file:
```bash
chmod 600 ~/hms/.env
```

### Frontend .env (local file)

Location: `/Volumes/Testing/hms/HMS_Milestone-2/frontend/main-app/.env`

```env
VITE_BACKEND_URL=http://13.232.125.254:5000/api/v1
```

> Note: This value is baked into the Docker image at build time via `--build-arg VITE_API_URL`.
> The GitHub Actions workflow passes `VITE_API_URL` as a build arg — it does NOT read from this file at runtime.
> Update the `VITE_API_URL` GitHub Secret if the EC2 IP changes.

---

## Step 7 — Add GitHub Actions Secrets

Go to: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | hms-cicd-user access key |
| `AWS_SECRET_ACCESS_KEY` | hms-cicd-user secret key |
| `AWS_REGION` | `ap-south-1` |
| `ECR_REGISTRY` | `232261469028.dkr.ecr.ap-south-1.amazonaws.com` |
| `EC2_HOST` | `13.232.125.254` |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of `hms-Key.pem` (including BEGIN/END lines) |
| `VITE_API_URL` | `http://13.232.125.254:5000` |

> To get SSH key: `cat /Volumes/Testing/hms/hms-Key.pem` — copy everything.

---

## Step 8 — Project File Reference

### Repository structure

```
HMS_Milestone-2/
├── backend/
│   ├── Dockerfile                  ← Node.js container
│   ├── .env                        ← Production env vars (DO NOT COMMIT)
│   ├── .env.example                ← Template for team members
│   └── src/index.js                ← Entry point (/health route)
├── frontend/
│   └── main-app/
│       ├── Dockerfile              ← Vite build + nginx container
│       ├── nginx.conf              ← SPA routing + caching
│       └── .env                    ← VITE_BACKEND_URL (baked at build time)
├── docker-compose.yml              ← Orchestrates both containers
├── .github/
│   └── workflows/
│       └── deploy-test.yml         ← GitHub Actions CI/CD pipeline
├── DEPLOYMENT_GUIDE.md             ← This document
└── HMS_Deployment_Guide.pdf        ← PDF version of this document
```

### backend/Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1
CMD ["node", "src/index.js"]
```

### frontend/main-app/Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

### frontend/main-app/nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### docker-compose.yml

```yaml
services:
  backend:
    image: ${ECR_REGISTRY:-hms}/hms-backend:${IMAGE_TAG:-latest}
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hms_backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env
    environment:
      NODE_ENV: ${NODE_ENV:-production}
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:5000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  frontend:
    image: ${ECR_REGISTRY:-hms}/hms-frontend:${IMAGE_TAG:-latest}
    build:
      context: ./frontend/main-app
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL:-http://localhost:5000}
    container_name: hms_frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

### .github/workflows/deploy-test.yml

```yaml
name: Deploy to AWS EC2 (Testing)

on:
  push:
    branches:
      - main
      - develop

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
  BACKEND_REPO: hms-backend
  FRONTEND_REPO: hms-frontend

jobs:
  build-and-push:
    name: Build & Push to ECR
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build & push backend image
        run: |
          docker build -t $ECR_REGISTRY/$BACKEND_REPO:$GITHUB_SHA \
                       -t $ECR_REGISTRY/$BACKEND_REPO:latest \
                       ./backend
          docker push $ECR_REGISTRY/$BACKEND_REPO:$GITHUB_SHA
          docker push $ECR_REGISTRY/$BACKEND_REPO:latest

      - name: Build & push frontend image
        run: |
          docker build \
            --build-arg VITE_API_URL=${{ secrets.VITE_API_URL }} \
            -t $ECR_REGISTRY/$FRONTEND_REPO:$GITHUB_SHA \
            -t $ECR_REGISTRY/$FRONTEND_REPO:latest \
            ./frontend/main-app
          docker push $ECR_REGISTRY/$FRONTEND_REPO:$GITHUB_SHA
          docker push $ECR_REGISTRY/$FRONTEND_REPO:latest

  deploy:
    name: Deploy to EC2
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Copy docker-compose to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "docker-compose.yml"
          target: "/home/${{ secrets.EC2_USER }}/hms"

      - name: SSH & restart containers
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e
            cd ~/hms
            aws ecr get-login-password --region ${{ secrets.AWS_REGION }} \
              | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
            export ECR_REGISTRY=${{ secrets.ECR_REGISTRY }}
            export IMAGE_TAG=${{ github.sha }}
            export VITE_API_URL=${{ secrets.VITE_API_URL }}
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

---

## Step 9 — First Deploy

### Option A — via GitHub push (recommended)

```bash
git add .
git commit -m "chore: add Docker and CI/CD configuration"
git push origin main
```

Go to GitHub repo → **Actions** tab → watch the workflow. First run ~4–6 minutes.

### Option B — manual from local machine

```bash
export ECR_REGISTRY=232261469028.dkr.ecr.ap-south-1.amazonaws.com
export AWS_REGION=ap-south-1

aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin $ECR_REGISTRY

docker build -t $ECR_REGISTRY/hms-backend:latest ./backend
docker build \
  --build-arg VITE_API_URL=http://13.232.125.254:5000 \
  -t $ECR_REGISTRY/hms-frontend:latest \
  ./frontend/main-app

docker push $ECR_REGISTRY/hms-backend:latest
docker push $ECR_REGISTRY/hms-frontend:latest

# SSH into EC2 and start
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
cd ~/hms
ECR_REGISTRY=232261469028.dkr.ecr.ap-south-1.amazonaws.com IMAGE_TAG=latest docker compose up -d
```

---

## Step 10 — Verify the Deployment

### On EC2 (via SSH)

```bash
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254

docker ps                             # both containers healthy?
curl http://localhost:5000/health     # backend health check
docker logs hms_backend --tail 50    # backend logs
docker logs hms_frontend --tail 20   # frontend logs
```

Expected `docker ps` output:
```
CONTAINER ID   IMAGE                  STATUS                    PORTS
abc123         .../hms-frontend:...   Up 2 minutes (healthy)    0.0.0.0:80->80/tcp
def456         .../hms-backend:...    Up 2 minutes (healthy)    0.0.0.0:5000->5000/tcp
```

### From browser or Postman

| Check | URL |
|-------|-----|
| Frontend app | http://13.232.125.254 |
| Backend health | http://13.232.125.254:5000/health |
| API base | http://13.232.125.254:5000/api/v1/ |

### Verify MongoDB connection

```bash
docker logs hms_backend 2>&1 | grep -i "mongo\|connected"
# Expected: MongoDB Connected: cluster0.lponosn.mongodb.net
```

---

## Ongoing Workflow

```
Developer makes changes
        │
        ▼
git push origin develop (or main)
        │
        ▼
GitHub Actions automatically:
  1. Builds new Docker images
  2. Pushes to ECR
  3. Deploys to EC2
        │
        ▼
~90 seconds: changes are live at http://13.232.125.254
```

### Update environment variables on EC2

```bash
ssh -i /Volumes/Testing/hms/hms-Key.pem ubuntu@13.232.125.254
nano ~/hms/.env
# edit value, Ctrl+O to save
docker compose restart backend
```

### Useful container commands

```bash
docker ps                        # list running containers
docker stats                     # live CPU/memory usage
docker logs hms_backend -f       # stream backend logs
docker compose down              # stop all containers
docker compose up -d             # start all containers
```

---

## Troubleshooting

### Container not starting
```bash
docker logs hms_backend
docker logs hms_frontend
```

### MongoDB connection refused
- Confirm `MONGO_URI` in `~/hms/.env` has the database name: `.../hms_db?retryWrites=true...`
- Atlas → Network Access → confirm `13.232.125.254/32` is whitelisted and Active
- Check Atlas Cluster0 is not paused (free tier auto-pauses after 60 days of inactivity)

### GitHub Actions ECR login fails
- Confirm `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets match `hms-cicd-user` keys
- Confirm IAM user has `AmazonEC2ContainerRegistryPowerUser` policy

### GitHub Actions SSH step fails
- Confirm `EC2_HOST` = `13.232.125.254`
- Confirm `EC2_USER` = `ubuntu` (not `ec2-user`)
- Confirm `EC2_SSH_KEY` contains full contents of `hms-Key.pem`
- Confirm port 22 is open in EC2 Security Group

### Frontend blank page / API calls failing
- Confirm `VITE_API_URL` GitHub Secret = `http://13.232.125.254:5000`
- This is baked into the image at build time — if EC2 IP changes, update the secret and redeploy
- Check browser console for CORS errors
- Confirm `FRONTEND_URL=http://13.232.125.254` is in `~/hms/.env`

### Port 5000 not reachable
- EC2 Security Group must have inbound TCP 5000 from `0.0.0.0/0`
- Run `docker ps` — confirm `hms_backend` is up and healthy

### AWS CLI not found on Ubuntu 24.04
```bash
# apt package not available — use snap instead
sudo snap install aws-cli --classic
aws --version
```

---

## Production Checklist (before going live)

- [ ] Remove `0.0.0.0/0` from MongoDB Atlas Network Access
- [ ] Change `JWT_SECRET` to a cryptographically random 64-char string
- [ ] Restrict EC2 Security Group port 22 to your IP only
- [ ] Add a domain name and SSL certificate (HTTPS)
- [ ] Upgrade MongoDB Atlas from M0 to M10+ for production load
- [ ] Upgrade EC2 from t3.small to t3.medium or larger
- [ ] Enable automated MongoDB Atlas backups
- [ ] Fill in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` for payments
- [ ] Fill in `AWS_S3` variables for file uploads

---

*WebArclight Veterinary HMS — Deployment Guide v2.0*
*Stack: React 19 + Node.js + MongoDB Atlas + Docker + AWS EC2 + ECR + GitHub Actions*
*Last updated: June 2026*
