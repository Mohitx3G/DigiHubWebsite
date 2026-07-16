#!/usr/bin/env bash
# Builds the deployable site into dist/: content-hashes the assets that only
# change via a code deploy (style.css, main.js, admin.css, admin.js), and
# rewrites every HTML file's <link>/<script> tags to point at the hashed
# names. Everything else (HTML, config.js, images) ships under its original,
# fixed filename — those are handled by nginx's no-cache/must-revalidate
# treatment instead (see deploy/nginx.conf), not by hashing, because their
# filenames are load-bearing: the admin panel and README both depend on
# assets/js/config.js and the *.html paths staying fixed.
#
# Usage: deploy/build.sh   (run from the website repo root)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"

rm -rf "$DIST"
mkdir -p "$DIST"

# Copy everything except VCS/deploy/build-output/docs — those aren't served.
for entry in "$ROOT"/*; do
  base="$(basename "$entry")"
  case "$base" in
    .git|deploy|dist|README.md) continue ;;
  esac
  cp -r "$entry" "$DIST/$base"
done

# Assets that change only via a code deploy: safe to hash + cache forever.
HASHABLE=(
  "assets/css/style.css"
  "assets/js/main.js"
  "assets/css/admin.css"
  "assets/js/admin.js"
)

echo "Hashing assets:"
for rel in "${HASHABLE[@]}"; do
  src="$DIST/$rel"
  if [ ! -f "$src" ]; then
    echo "  SKIP (missing): $rel"
    continue
  fi
  hash="$(sha256sum "$src" | cut -c1-10)"
  dir="$(dirname "$rel")"
  base="$(basename "$rel")"
  name="${base%.*}"
  ext="${base##*.}"
  hashed_rel="$dir/$name.$hash.$ext"

  mv "$src" "$DIST/$hashed_rel"
  echo "  $rel -> $hashed_rel"

  # Rewrite every HTML file's reference to the old path.
  find "$DIST" -maxdepth 1 -name '*.html' -print0 \
    | xargs -0 sed -i "s#${rel}#${hashed_rel}#g"
done

echo "Build complete: $DIST"
