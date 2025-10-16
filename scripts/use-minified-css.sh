#!/bin/bash

# Script to replace original CSS with minified versions for testing
# Creates backups of originals so you can restore later

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=================================================="
echo "🔄 Swap to Minified CSS for Testing"
echo "=================================================="
echo ""

# Find all .min.css files
minified_files=$(find express/code/blocks -name "*.min.css" -type f)

if [ -z "$minified_files" ]; then
  echo "❌ No minified CSS files found!"
  exit 1
fi

count=0

for minified in $minified_files; do
  original="${minified%.min.css}.css"
  backup="${minified%.min.css}.css.backup"
  
  if [ ! -f "$original" ]; then
    echo "⚠️  Original not found: $original"
    continue
  fi
  
  # Check if backup already exists
  if [ -f "$backup" ]; then
    echo -e "${YELLOW}⚠️  Backup already exists: $backup${NC}"
    echo "   Skipping to avoid overwriting. Restore first if you want to re-swap."
    continue
  fi
  
  # Create backup
  cp "$original" "$backup"
  
  # Replace original with minified
  cp "$minified" "$original"
  
  count=$((count + 1))
  
  orig_size=$(wc -c < "$backup" | tr -d ' ')
  min_size=$(wc -c < "$original" | tr -d ' ')
  orig_kb=$((orig_size / 1024))
  min_kb=$((min_size / 1024))
  
  echo -e "${GREEN}✓${NC} $(basename $original)"
  echo "  Backup created: $(basename $backup)"
  echo "  Size: ${orig_kb} KB → ${min_kb} KB"
  echo ""
done

echo "=================================================="
echo "✅ Swapped $count files to use minified CSS"
echo "=================================================="
echo ""
echo "📝 To restore originals:"
echo "   ./scripts/restore-original-css.sh"
echo ""
echo "🚀 Now test your site - it's using minified CSS!"

