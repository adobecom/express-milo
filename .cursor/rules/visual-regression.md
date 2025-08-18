# Visual Regression Testing with Cursor AI

**APPLY: When user asks about visual testing, regression testing, comparing branches, or screenshot comparison**

## Available Commands

You can help users run visual regression tests using both CLI and direct API. The tool is located at `tools/visual-regression/` and uses the aem.live domain for testing branches.

### Recommended: Direct API (Best for Cursor AI)

When users ask for visual comparisons, use the simple API:

```bash
cd tools/visual-regression && node cursor-api.js <control-branch> <experimental-branch> <path> [options]
```

Examples:
```bash
# Fast timing (default)
cd tools/visual-regression && node cursor-api.js main feature-xyz /express/templates

# Slow timing for heavy pages
cd tools/visual-regression && node cursor-api.js main feature-xyz /express/templates --slow

# Custom timeout
cd tools/visual-regression && node cursor-api.js main feature-xyz /express/templates --timeout=45000
```

**Timing Options:**
- `--fast`: Quick timing (default) - 30s timeout, 2s wait
- `--slow`: Slow timing for heavy pages - 60s timeout, 5s wait  
- `--timeout=<ms>`: Custom page timeout
- `--wait=<ms>`: Custom block wait time
- `--open`: Open report in browser

### Alternative: Natural Language Interface

```bash
cd tools/visual-regression && npx visual-compare nl "compare main and feature-branch for /express/templates"
```

### Common Usage Patterns

1. **Branch Comparison**:
   - "Compare main vs stage branches for /express"
   - "Check visual differences between main and feature-xyz"
   - "Test my new branch against production"

2. **Specific Pages**:
   - "Compare branches for /docs/library/kitchen-sink/comparison-table-v2"
   - "Visual test /express/templates page"
   - "Check /express for regressions"

3. **With Timing Control**:
   - "Compare main vs feature for /express using slow timing" → Use `--slow`
   - "Quick visual test of main vs stage" → Use `--fast` (default)
   - "Heavy page comparison" → Use `--slow`

### Detecting Timing Needs

Use `--slow` when user mentions:
- "heavy pages", "complex pages", "slow loading"
- "lots of content", "many components"
- "timeout issues", "blank screenshots"

Use `--fast` (default) for:
- "quick test", "fast comparison"
- Simple pages, basic testing

### Tool Features

- Captures screenshots at 3 resolutions (mobile, tablet, desktop)
- Uses perceptual hashing for structural comparison
- Generates pixel-by-pixel diff images
- Creates HTML reports with visual comparisons
- Provides similarity metrics and diff percentages

### Installation and Setup

If not installed, guide users to:

```bash
cd tools/visual-regression
npm install
npm link  # Optional: makes CLI globally available
```

### Example Workflow

1. User: "I want to check if my feature branch has visual regressions compared to main for the pricing page"
2. You run: `cd tools/visual-regression && npx visual-compare nl "compare main and feature-branch for /express/pricing"`
3. Tool generates report with screenshots and metrics
4. You can offer to open the HTML report or summarize the results

### Interpreting Results

- **Perceptual Similarity > 95%**: Good, minimal visual changes
- **Perceptual Similarity 90-95%**: Minor changes, review recommended  
- **Perceptual Similarity < 90%**: Significant changes detected
- **Pixel Difference < 1%**: Minimal pixel changes
- **Pixel Difference 1-5%**: Moderate changes
- **Pixel Difference > 5%**: Major pixel differences

### Integration Tips

- Always explain what you're testing before running
- Offer to open the HTML report after completion
- Summarize key findings from the metrics
- Suggest next steps based on results (e.g., "Results look good" vs "Significant changes detected, review recommended")