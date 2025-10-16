#!/bin/bash

# Script to restore original CSS from backups

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "=================================================="
echo "🔄 Restore Original CSS"
echo "=================================================="
echo ""

# Find all backup files
backup_files=$(find express/code/blocks -name "*.css.backup" -type f)

if [ -z "$backup_files" ]; then
  echo "❌ No backup files found!"
  echo "   Nothing to restore."
  exit 1
fi

count=0

for backup in $backup_files; do
  original="${backup%.backup}"
  
  if [ ! -f "$original" ]; then
    echo -e "${RED}⚠️  Original not found: $original${NC}"
    continue
  fi
  
  # Restore from backup
  mv "$backup" "$original"
  
  count=$((count + 1))
  
  echo -e "${GREEN}✓${NC} Restored: $(basename $original)"
done

echo ""
echo "=================================================="
echo "✅ Restored $count files to original CSS"
echo "=================================================="
echo ""
echo "📝 Backups have been removed."
echo "🔄 To use minified again: ./scripts/use-minified-css.sh"

