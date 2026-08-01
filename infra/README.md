# HMS Infrastructure (Terraform)

This describes both HMS environments as code:
- **Production** (`ec2.tf`, `s3.tf`, `cloudfront.tf`, `iam.tf`) — the original files, unchanged, matching what's live in `HMS_frontend`.
- **Testing / server 2** (`ec2-testing.tf`, `s3-testing.tf`, `cloudfront-testing.tf`, `iam-testing.tf`) — everything built manually on 2026-08-01/02 for this repo's own server, now captured as code.

Production and testing are entirely separate resource sets (different names, no shared resources except the uploads S3 bucket and the SPA-routing CloudFront function, both intentional). Nothing here can accidentally affect the other environment.

## ⚠️ Before you run anything

**Both environments described here already exist as real, live AWS resources right now.** This Terraform was written *after the fact*, from what's actually running — it was never used to create the current servers. That matters for one reason:

**Do not run `terraform apply` against a fresh, empty state file while the real resources still exist.** Terraform won't know they're "the same thing" — it will try to create a second, duplicate set of everything (new EC2 instance, new S3 bucket with a name collision error, new CloudFront distribution, etc.).

### This Terraform is for one specific situation: disaster recovery

If a server is genuinely **lost** — the EC2 instance terminated, the S3 bucket deleted, the CloudFront distribution destroyed — *then* this code is exactly what you run to rebuild it from scratch. That's the whole point of having it.

If instead you want Terraform to manage the *already-running* resources going forward (so it stops drifting from reality), you'd first need to `terraform import` each resource — that's a deliberate, careful, one-time step, not something to run casually. Ask for help with that when/if you actually want it; don't attempt it blind.

## Normal usage (once you're in an actual "server is gone" situation)

```bash
cd infra
terraform init
terraform plan   # review carefully - confirm it's only creating what you expect
terraform apply
```

You'll need `terraform.tfvars` filled in first — copy `terraform.tfvars.example` and fill in the bucket names, etc. This file is gitignored (it doesn't contain secrets itself, but keeping infra config out of git by default is the safer habit).

After `apply` finishes, `terraform output` prints everything you need (IPs, URLs, bucket names) to update GitHub Actions secrets and get the deploy workflows pointed at the new resources.

## What's NOT covered here

- **The database** (MongoDB Atlas) — completely separate from AWS/Terraform. Not backed up by this.
- **The `.env` files** on each server — deliberately never in git. You'll need to recreate these manually after a rebuild (see `docs/05-docker-backend.md` in the `HMS-infra`-equivalent docs, or ask for the current values to be regenerated).
- **Data inside S3 buckets** (uploaded documents, current frontend build) — Terraform manages the bucket *existing*, not what's inside it. The frontend content redeploys automatically on the next `git push` once the new bucket/CloudFront exist and secrets are updated; uploaded documents are gone if the uploads bucket itself was destroyed (it wasn't touched by anything today — this only applies in a true bucket-deletion disaster).
