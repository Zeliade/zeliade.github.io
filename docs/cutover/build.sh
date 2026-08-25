#!/usr/bin/env bash
# Regenerates ../Zeliade-website-cutover.pdf from body.html + the stylesheets.
# Requires chromium and the fonts installed by `npm install` in ../../site.
set -euo pipefail
cd "$(dirname "$0")"

FONTS="$(cd ../../site/node_modules/@fontsource-variable && pwd)"
sed "s|__FONTS__|$FONTS|g" style.css > /tmp/zeliade-fonts.css

{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  echo '<title>Website cutover — how to complete the merge</title><style>'
  cat /tmp/zeliade-fonts.css print.css
  echo '</style></head><body>'
  cat body.html
  echo '</body></html>'
} > /tmp/zeliade-cutover.html

chromium --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=../Zeliade-website-cutover.pdf \
  --virtual-time-budget=6000 /tmp/zeliade-cutover.html

echo "Wrote docs/Zeliade-website-cutover.pdf"
