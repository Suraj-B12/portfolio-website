#!/bin/bash
set -euo pipefail

REPO_URL="https://github.com/Suraj-B12/portfolio-website.git"

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git build-essential

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

useradd -m -s /bin/bash app || true
sudo -u app bash <<EOF
set -euo pipefail
cd /home/app
git clone "${REPO_URL}" portfolio
cd portfolio
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
EOF

env PATH=$PATH:/usr/bin pm2 startup systemd -u app --hp /home/app
systemctl enable pm2-app

echo "Bootstrap complete. Next.js is listening on :3000."
