#!/bin/bash
set -euo pipefail
exec > /var/log/user-data.log 2>&1
echo "=== user-data start: $(date) ==="

REPO_URL="https://github.com/Suraj-B12/portfolio-website.git"

# ---- Swap (t2.micro has only 1 GB RAM; the Next.js build needs ~2 GB) ---
if [ ! -f /swapfile ]; then
  echo "Creating 2 GB swap file..."
  dd if=/dev/zero of=/swapfile bs=128M count=16
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile swap swap defaults 0 0" >> /etc/fstab
  echo "Swap enabled: $(swapon --show)"
fi

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
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
EOF

# ---- Auto-start on reboot ----------------------------------------------
env PATH=$PATH:/usr/bin pm2 startup systemd -u app --hp /home/app
systemctl enable pm2-app

echo "=== user-data complete: $(date) ==="
echo "Next.js is listening on :3000."
