# Visual Regression Tool

A visual regression testing tool that uses perceptual hashing and pixel-diff algorithms to compare web pages across different git branches.

## Features

- 📸 Automated screenshot capture at 3 resolutions (mobile, tablet, desktop)
- 🔍 Perceptual hash comparison for detecting visual changes
- 🎯 Pixel-by-pixel difference visualization
- 🗣️ Natural language CLI interface
- 📊 HTML report generation with side-by-side comparisons
- 🚀 Built on Playwright for reliable cross-browser testing

## Installation

From the `tools/visual-regression` directory:

```bash
npm install
```

To make the CLI available globally in your project:

```bash
npm link
```

## Usage

### Standard Command

```bash
visual-compare compare <control-branch> <experimental-branch> <subdirectory> [options]
```

Example:
```bash
visual-compare compare main feature-xyz /docs/library/kitchen-sink/comparison-table-v2 --open --report=report-kitchen-sink.html
```

### Natural Language Interface

```bash
visual-compare nl "compare main branch with feature-xyz at /docs/library/kitchen-sink/comparison-table-v2" --report=report-kitchen-sink.html
```

Other examples:
- `"check visual differences between main and stage for /express/templates"`
- `"test main vs experimental-branch on page /docs/library"`
- `"show me the difference between stage and prod branches for /express"`

### View Examples

```bash
visual-compare examples
```

## How It Works

1. **Screenshot Capture**: Uses Playwright to capture full-page screenshots at 3 resolutions
2. **Perceptual Hashing**: Generates a 32x32 grayscale hash to detect structural changes
3. **Pixel Difference**: Uses pixelmatch to create visual diff images
4. **Reporting**: Generates an HTML report with metrics and visual comparisons

## Metrics Explained

- **Perceptual Similarity**: How similar the images are structurally (95%+ is good)
- **Pixel Difference**: Percentage of pixels that differ (< 1% is good)
- **Hamming Distance**: Raw difference between perceptual hashes (lower is better)

## Cursor AI Integration

To use this tool with Cursor AI, you can create a custom command or use the terminal:

### Option 1: Terminal in Cursor
1. Open terminal in Cursor (Cmd+J)
2. Run natural language commands:
   ```bash
   visual-compare nl "compare main and stage for /express"
   ```

### Option 2: Create a Task
Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Visual Regression Test",
      "type": "shell",
      "command": "visual-compare",
      "args": ["nl", "${input:naturalQuery}"],
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "naturalQuery",
      "type": "promptString",
      "description": "Describe what you want to compare (e.g., 'compare main vs stage for /express')"
    }
  ]
}
```

Then use Cmd+Shift+P > "Tasks: Run Task" > "Visual Regression Test"

### Option 3: Cursor AI Command
You can ask Cursor AI to run comparisons for you:

```
"Run a visual regression test comparing main and feature-abc branches for the /express/templates page"
```

Cursor will understand and execute:
```bash
cd tools/visual-regression && npx visual-compare nl "compare main and feature-abc for /express/templates" --report=report-templates.html
```

## Output

The tool generates:
- Screenshots in `output/screenshots/`
- Difference images in `output/diffs/`
- HTML report at `output/report.html` (customize via `--report=<filename>`)

## Batch Mode (Configurable Concurrency)

Provide a text file with one path per line (lines starting with `#` are ignored):

```
# urls.txt
/express
/express/pricing
/docs/library/kitchen-sink/comparison-table-v2
```

Run with configurable concurrency and timing:

```bash
visual-compare batch <control-branch> <experimental-branch> <urls-file> \
  --concurrency=4 --slow --timeout=60000 --wait=5000
```

Example:

```bash
visual-compare batch main stage urls.txt --concurrency=3 --slow
```

Outputs:
- Individual HTML reports in `output/` (auto-named per path)
- Summary JSON at `output/batch-summary-<timestamp>.json`

## Troubleshooting

- **Installation Issues**: Make sure you're in the `tools/visual-regression` directory
- **Screenshot Timeouts**: The tool waits 2 seconds for animations; increase if needed
- **Branch Not Found**: Ensure branch names are correct and deployed to AEM
