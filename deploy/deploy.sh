#!/usr/bin/env bash
# Builds dist/ (see build.sh) and ships it to the VPS as a new, immutable
# release directory, then atomically flips the /opt/digihub-website symlink
# to point at it — nginx's `root` follows the symlink, so every request
# either sees the fully-old release or the fully-new one, never a half
# swapped mix of old HTML with new asset hashes or vice versa. Old releases
# are pruned, keeping the last 5 for instant rollback
# (ssh $HOST "sudo /usr/local/bin/digihub-website-swap.sh <old-timestamp>").
#
# Usage: deploy/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="digihub@169.58.15.224"
RELEASES_DIR="/opt/digihub-website-releases"
LIVE_LINK="/opt/digihub-website"
KEEP=5

"$ROOT/deploy/build.sh"

TS="$(date -u +%Y%m%d%H%M%S)"
TAR="$ROOT/dist.tar.gz"
tar -C "$ROOT/dist" -czf "$TAR" .

echo "Uploading release $TS..."
scp -q "$TAR" "$HOST:/tmp/digihub-website-$TS.tar.gz"
rm -f "$TAR"

ssh "$HOST" bash -s -- "$TS" "$RELEASES_DIR" "$LIVE_LINK" "$KEEP" <<'REMOTE'
set -euo pipefail
TS="$1"; RELEASES_DIR="$2"; LIVE_LINK="$3"; KEEP="$4"
RELEASE_DIR="$RELEASES_DIR/$TS"

mkdir -p "$RELEASE_DIR"
tar -xzf "/tmp/digihub-website-$TS.tar.gz" -C "$RELEASE_DIR"
rm -f "/tmp/digihub-website-$TS.tar.gz"

# /opt is root-owned, so flipping the live symlink needs a privileged step.
# digihub has a narrow NOPASSWD sudoers rule (/etc/sudoers.d/digihub-website-deploy)
# for exactly this one root-owned helper script — nothing broader — so the
# deploy stays fully unattended.
sudo /usr/local/bin/digihub-website-swap.sh "$TS"

# Prune old releases beyond $KEEP.
cd "$RELEASES_DIR"
ls -1t | tail -n +"$((KEEP + 1))" | while read -r old; do
  echo "Pruning old release: $old"
  rm -rf "$RELEASES_DIR/$old"
done
REMOTE

echo "Deploy complete."
