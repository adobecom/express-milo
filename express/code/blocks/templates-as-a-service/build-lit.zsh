#!/bin/zsh
# Zsh script to bundle and minify lit.js using esbuild, relative to this script's location

SCRIPT_DIR="${0:A:h}"

npx esbuild --format=esm --minify "$SCRIPT_DIR/lit.js" --bundle --outfile="$SCRIPT_DIR/lit.min.js"
