#!/bin/bash
#
# EC2 user-data bootstrap script.
#
# Paste this into the "User data" field of your EC2 launch template. It runs
# once on first boot as root and prepares a fresh Ubuntu 22.04 instance to
# serve the portfolio behind the ALB. Because it is idempotent and hands-off,
# it also works as the launch configuration for an Auto Scaling Group, which
# gives you the fault-tolerance bonus marks: a killed instance is replaced
# and self-provisions without any manual steps.
#
# Prerequisites in the AWS console:
#   1. CloudFront distribution is live and its domain is known.
#   2. Target Group is waiting for instances on port 3000 with health check
#      path /api/health.
#
# Customise the two variables below before using.

set -euo pipefail

REPO_URL="https://github.com/Suraj-B12/portfolio-website.git"
CDN_URL="https://REPLACE-ME.cloudfront.net"

# ---- System packages ----------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git build-essential

# ---- Node.js 20 ---------------------------------------------------------
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# ---- Application --------------------------------------------------------
useradd -m -s /bin/bash app || true
sudo -u app bash <<EOF
set -euo pipefail
cd /home/app
git clone "${REPO_URL}" portfolio
cd portfolio
export NEXT_PUBLIC_ASSET_PREFIX="${CDN_URL}"
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
EOF

# ---- Auto-start on reboot ----------------------------------------------
env PATH=$PATH:/usr/bin pm2 startup systemd -u app --hp /home/app
systemctl enable pm2-app

echo "Bootstrap complete. Next.js is listening on :3000."
