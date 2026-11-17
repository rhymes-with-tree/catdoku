#!/bin/sh
# Cloudflare runs this to make the folder it serves (_site): the whole repository except the notes, the tools
# and the dashboard skill, which players never need. Build command: sh tools/build-site.sh; wrangler.jsonc serves _site.
set -e
cd "$(dirname "$0")/.."
rm -rf _site && mkdir _site
tar -cf - --exclude=./.git --exclude=./.claude --exclude=./_site --exclude=./tools --exclude='*/tools' \
  --exclude='*.md' --exclude='*.py' --exclude=__pycache__ --exclude=./LICENSE --exclude=./.gitignore --exclude=./wrangler.jsonc . | tar -xf - -C _site
echo "_site: $(find _site -type f | wc -l) files, $(du -sh _site | cut -f1)"
