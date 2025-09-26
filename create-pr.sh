#!/bin/bash
# Personal PR Creation Script
# Usage: ./create-pr.sh your-branch target-branch

if [ $# -eq 0 ]; then
    echo "Usage: ./create-pr.sh your-branch target-branch"
    echo "Example: ./create-pr.sh feature-branch stage"
    exit 1
fi

YOUR_BRANCH=${1:-$(git branch --show-current)}
TARGET_BRANCH=${2:-stage}

echo "Creating PR: $YOUR_BRANCH -> $TARGET_BRANCH"
open "https://github.com/adobecom/express-milo/compare/$TARGET_BRANCH...$YOUR_BRANCH"
