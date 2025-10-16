#!/bin/bash

# CSS Minification Script for Adobe EDS/Franklin (No Build Process)
# Removes comments, extra whitespace, and empty lines
# Creates .min.css versions while preserving originals

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TARGET_DIR="${1:-express/code/blocks}"
DRY_RUN="${2:-false}"
TOTAL_ORIGINAL=0
TOTAL_MINIFIED=0
FILE_COUNT=0

echo "=================================================="
echo "🎨 CSS Minification Script"
echo "=================================================="
echo "Target: $TARGET_DIR"
echo "Dry Run: $DRY_RUN"
echo ""

# Find all CSS files (excluding already minified ones)
while IFS= read -r file; do
  # Skip if already minified
  if [[ "$file" == *.min.css ]]; then
    continue
  fi
  
  # Generate minified filename
  minified="${file%.css}.min.css"
  
  # Get original size
  original_size=$(wc -c < "$file" | tr -d ' ')
  TOTAL_ORIGINAL=$((TOTAL_ORIGINAL + original_size))
  
  # Process the file
  if [ "$DRY_RUN" = "true" ]; then
    echo -e "${YELLOW}[DRY RUN]${NC} Would minify: $file"
  else
    # Create minified version
    cat "$file" | \
      # Remove C-style comments (/* ... */)
      sed 's|/\*[^*]*\*\+\([^/*][^*]*\*\+\)*/||g' | \
      # Remove leading whitespace
      sed 's/^[[:space:]]*//' | \
      # Remove trailing whitespace
      sed 's/[[:space:]]*$//' | \
      # Remove empty lines
      sed '/^$/d' | \
      # Remove spaces around { } : ; ,
      sed 's/[[:space:]]*{[[:space:]]*/\{/g' | \
      sed 's/[[:space:]]*}[[:space:]]*/\}/g' | \
      sed 's/[[:space:]]*:[[:space:]]*/:/g' | \
      sed 's/[[:space:]]*;[[:space:]]*/;/g' | \
      sed 's/[[:space:]]*,[[:space:]]*/,/g' | \
      # Remove spaces around > + ~
      sed 's/[[:space:]]*>[[:space:]]*/>/g' | \
      sed 's/[[:space:]]*+[[:space:]]*/+/g' | \
      sed 's/[[:space:]]*~[[:space:]]*/~/g' \
      > "$minified"
    
    # Get minified size
    minified_size=$(wc -c < "$minified" | tr -d ' ')
    TOTAL_MINIFIED=$((TOTAL_MINIFIED + minified_size))
    FILE_COUNT=$((FILE_COUNT + 1))
    
    # Calculate savings
    saved=$((original_size - minified_size))
    percent=$((saved * 100 / original_size))
    
    # Format sizes for display
    orig_kb=$((original_size / 1024))
    min_kb=$((minified_size / 1024))
    saved_kb=$((saved / 1024))
    
    echo -e "${GREEN}✓${NC} $file"
    echo "  Original: ${orig_kb} KB → Minified: ${min_kb} KB (Saved: ${saved_kb} KB / ${percent}%)"
  fi
  
done < <(find "$TARGET_DIR" -name "*.css" -type f)

echo ""
echo "=================================================="
echo "📊 Summary"
echo "=================================================="
echo "Files processed: $FILE_COUNT"

if [ "$DRY_RUN" != "true" ]; then
  total_orig_kb=$((TOTAL_ORIGINAL / 1024))
  total_min_kb=$((TOTAL_MINIFIED / 1024))
  total_saved=$((TOTAL_ORIGINAL - TOTAL_MINIFIED))
  total_saved_kb=$((total_saved / 1024))
  total_percent=$((total_saved * 100 / TOTAL_ORIGINAL))
  
  echo "Total original size: ${total_orig_kb} KB"
  echo "Total minified size: ${total_min_kb} KB"
  echo -e "${GREEN}Total saved: ${total_saved_kb} KB (${total_percent}%)${NC}"
else
  echo -e "${YELLOW}Run without 'true' parameter to actually minify files${NC}"
fi

echo ""
echo "✅ Done!"

