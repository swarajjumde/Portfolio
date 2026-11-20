#!/usr/bin/env bash
# =============================================================================
# Portfolio: server PEHLI BAAR taiyaar karna (Ubuntu, AWS EC2).
# Chalao (ek baar):   sudo bash deploy/setup-server.sh
#
# Agar Samay wala server hi use kar raha hai, to nginx/node pehle se honge —
# ye script unhe skip kar dega aur bas portfolio ki site add karega.
# =============================================================================
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
    echo "sudo ke saath chalao:  sudo bash deploy/setup-server.sh" >&2
    exit 1
fi

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="${SUDO_USER:-ubuntu}"
step() { echo; echo "==> $*"; }

if [[ "$APP_DIR" != "/var/www/portfolio" ]]; then
    echo "Project /var/www/portfolio mein hona chahiye (abhi: $APP_DIR). README Step 2 dekho." >&2
    exit 1
fi

step "1/3 nginx + Node install (jo pehle se hai wo skip)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx git curl ca-certificates gnupg

NODE_CANDIDATE="$(apt-cache policy nodejs | awk '/Candidate:/ {print $2}' | sed -E 's/^[0-9]+://' | cut -d. -f1)"
if command -v node >/dev/null && [[ "$(node -v | cut -d. -f1 | tr -d v)" -ge 20 ]]; then
    echo "Node $(node -v) pehle se hai, skip."
elif [[ "$NODE_CANDIDATE" =~ ^[0-9]+$ && "$NODE_CANDIDATE" -ge 20 ]]; then
    apt-get install -y nodejs npm
else
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
    apt-get update -y
    apt-get install -y nodejs
fi

step "2/3 Permissions"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

step "3/3 nginx site"
systemctl enable --now nginx
if [[ -f /etc/nginx/sites-available/portfolio ]]; then
    echo "nginx config pehle se hai, chheda nahi (HTTPS settings bachi rahein)."
else
    cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/portfolio
    ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
fi
nginx -t
systemctl reload nginx

echo
echo "Server taiyaar. Ab chalao (sudo ke BINA):  bash deploy/deploy.sh"
