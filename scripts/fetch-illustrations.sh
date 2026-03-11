#!/bin/bash
# Download Gustave Doré's Paradise Lost engravings (1866, public domain)
# from Wikimedia Commons into public/assets/illustrations/
#
# Usage: bash scripts/fetch-illustrations.sh

set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/assets/illustrations"
mkdir -p "$DIR"

BASE="https://upload.wikimedia.org/wikipedia/commons"

declare -A PLATES=(
  # Book I - The Fall
  ["01-fall-of-rebels.jpg"]="8/86/Paradise_Lost_1.jpg"
  ["00-war-in-heaven.jpg"]="6/65/Paradise_Lost_0.jpg"

  # Book I - The Burning Lake
  ["02-satan-rises-from-lake.jpg"]="e/ef/Paradise_Lost_2.jpg"
  ["03-fallen-angels-roused.jpg"]="c/ca/Paradise_Lost_3.jpg"

  # Book I-II - Pandemonium
  ["05-assembly-of-fallen.jpg"]="5/57/Paradise_Lost_5.jpg"
  ["06-satan-on-throne.jpg"]="1/16/Paradise_Lost_6.jpg"

  # Book II - Gates of Hell & Chaos
  ["08-gates-of-hell.jpg"]="9/93/Paradise_Lost_8.jpg"
  ["09-journey-through-chaos.jpg"]="9/9a/Paradise_Lost_9.jpg"

  # Book III-IV - Descent to Earth / Eden
  ["12-satan-descends.jpg"]="9/9d/Paradise_Lost_12.jpg"
  ["13-satan-despair.jpg"]="e/ec/Paradise_Lost_13.jpg"
  ["14-satan-views-eden.jpg"]="5/52/Paradise_Lost_14.jpg"

  # Book IX - The Temptation
  ["36-temptation-1.jpg"]="6/68/Paradise_Lost_36.jpg"
  ["37-temptation-2.jpg"]="9/99/Paradise_Lost_37.jpg"
  ["38-temptation-3.jpg"]="7/71/Paradise_Lost_38.jpg"

  # Book XII - The Expulsion
  ["49-expulsion.jpg"]="a/aa/Paradise_Lost_49.jpg"

  # Portrait
  ["satan-profile.jpg"]="9/90/GustaveDoreParadiseLostSatanProfile.jpg"
)

echo "Downloading Doré's Paradise Lost illustrations..."
echo "Target: $DIR"
echo ""

FAILED=0
for filename in $(echo "${!PLATES[@]}" | tr ' ' '\n' | sort); do
  path="${PLATES[$filename]}"
  url="$BASE/$path"
  dest="$DIR/$filename"

  if [ -f "$dest" ]; then
    echo "  [skip] $filename (already exists)"
    continue
  fi

  printf "  [fetch] %-40s ... " "$filename"
  if curl -sL -o "$dest" -w "%{http_code}" "$url" | grep -q "200"; then
    echo "ok"
  else
    echo "FAILED"
    rm -f "$dest"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
TOTAL=${#PLATES[@]}
echo "Done. Downloaded $((TOTAL - FAILED))/$TOTAL illustrations."
if [ $FAILED -gt 0 ]; then
  echo "Some downloads failed. Browse the full set at:"
  echo "  https://commons.wikimedia.org/wiki/Category:Illustrations_of_Paradise_Lost_by_Gustave_Doré"
fi
