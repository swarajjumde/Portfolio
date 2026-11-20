#!/usr/bin/env bash
# =============================================================================
# Portfolio: live karna / update karna. Har baar yahi chalao (sudo ke BINA):
#     bash deploy/deploy.sh
#
# Ye: git pull -> npm ci -> npm run build -> nginx reload.
# =============================================================================
set -euo pipefail

if [[ $EUID -eq 0 ]]; then
    echo "sudo ke bina chalao:  bash deploy/deploy.sh" >&2
    exit 1
fi

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"
step() { echo; echo "==> $*"; }

step "1/3 Naya code (git pull)"
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
    git pull --ff-only
else
    echo "Git remote set nahi hai, pull skip."
fi

step "2/3 Build"
npm ci --no-audit --no-fund
npm run build

step "3/3 nginx reload"
sudo systemctl reload nginx

echo
echo "Ho gaya. Kholo:  http://$(curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null || echo '<server-IP>')"
