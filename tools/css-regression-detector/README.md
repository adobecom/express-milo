# CSS Regression Detector

A pre-commit hook tool that detects CSS regressions by analyzing staged CSS files for conflicts and specificity drift against all CSS files in the project, and scans all JS files for usage of changed selectors.

## 🚀 Quick Start

### Installation

```bash
# Install the tool
npm install css-regression-detector

# Set up pre-commit hook
npm run install-hook
```

### Basic Usage

```bash
# Run manually
npm run css-check

# Or directly
npx css-check

# Run with specific files
npx css-check --files "blocks/**/*.css"

# Run in verbose mode
npx css-check --verbose
```

## 📋 Features

### ✅ Core Capabilities

1. **Targeted File Scope**
   - Parse only staged `.css` files (files about to be committed)
   - Parse all other `.css` files in the project as baseline for conflict detection
   - Scan all `.js` files for usage of changed selectors

2. **Selector Conflict Detection**
   - Map selectors and declarations from staged and baseline CSS
   - Flag conflicting or duplicate selectors
   - Detect override patterns that could cause unexpected behavior

3. **Specificity Drift Detection**
   - Calculate selector specificity using standard CSS specificity rules
   - Flag risky increases in specificity that could break existing styles
   - Provide specificity comparison between staged and baseline

4. **JavaScript Usage Analysis**
   - Scan all JS files for changed selector usage (in `className`, `classList`, template literals, etc.)
   - Warn if selectors are widely used or in shared components
   - Detect dynamic class usage patterns

5. **Danger Zone Watchlist**
   - Configurable list of critical selectors that always trigger warnings
   - Global selectors that affect multiple components
   - Framework-specific selectors (e.g., `.btn`, `.container`, `body`, `.modal`)

## ⚙️ Configuration

Create a `.css-check.config.json` file in your project root:

```json
{
  "dangerSelectors": [
    ".btn",
    ".container", 
    "body",
    ".modal",
    ".header",
    ".footer"
  ],
  "thresholds": {
    "specificityIncrease": 2,
    "maxConflicts": 5,
    "maxUsageWarnings": 10
  },
  "ignorePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.min.css"
  ],
  "jsScanPatterns": [
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx"
  ],
  "cssScanPatterns": [
    "**/*.css",
    "**/*.scss",
    "**/*.sass"
  ]
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dangerSelectors` | `string[]` | `[]` | Critical selectors that always trigger warnings |
| `thresholds.specificityIncrease` | `number` | `2` | Maximum allowed specificity increase |
| `thresholds.maxConflicts` | `number` | `5` | Maximum allowed conflicts before blocking commit |
| `thresholds.maxUsageWarnings` | `number` | `10` | Maximum usage warnings before blocking commit |
| `ignorePatterns` | `string[]` | `["**/node_modules/**"]` | Glob patterns to ignore |
| `jsScanPatterns` | `string[]` | `["**/*.js", "**/*.jsx"]` | JS file patterns to scan |
| `cssScanPatterns` | `string[]` | `["**/*.css"]` | CSS file patterns to scan |

## 🔧 CLI Options

```bash
css-check [options]

Options:
  -f, --files <patterns>    Specific file patterns to check
  -c, --config <path>       Path to config file (default: .css-check.config.json)
  -v, --verbose            Enable verbose output
  --no-color               Disable colored output
  --format <format>        Output format: console, json, html (default: console)
  --ignore-staged          Ignore staged files, check all CSS files
  --dry-run               Show what would be checked without making changes
  -h, --help              Display help information
```

## 📊 Example Output

```
🔍 CSS Regression Detector v1.0.0
================================

📊 Analysis Summary:
✅ Parsed 3 staged CSS files and baseline of 120 CSS files
✅ Scanned 45 JS files for selector usage

❌ CRITICAL ISSUES FOUND (Commit Blocked):

1. 🚨 Selector Conflict
   File: blocks/buttons/buttons.css
   Issue: `.btn` redefined conflicts with baseline shared.css
   Impact: May override global button styles
   Recommendation: Use more specific selector or check for conflicts

2. ⚠️ Specificity Increase
   File: blocks/card/card.css  
   Selector: `.card.primary` 
   Change: (0,2,1) → (1,2,2) [+1 specificity]
   Risk: May break existing card styles
   Recommendation: Review if specificity increase is necessary

3. 🚨 Danger Selector Modified
   File: express/code/styles/layout.css
   Selector: `.container` (in danger watchlist)
   Usage: Found in 8 JS files, 3 shared components
   Risk: High impact on layout system
   Recommendation: Coordinate with team before modifying

💡 To bypass (not recommended): git commit --no-verify
💡 To fix: Address issues above and re-run check
```

## 🔗 Integration

### Pre-commit Hook (Recommended)

The tool automatically integrates with pre-commit hooks when installed:

```bash
# Install husky and set up pre-commit hook
npm run install-hook
```

### Manual Integration

Add to your `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npx css-check
if [ $? -ne 0 ]; then
  echo "CSS regression check failed. Commit blocked."
  exit 1
fi
```

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: CSS Regression Check
  run: npx css-check
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- cssParser.test.js
```

## 🐛 Troubleshooting

### Common Issues

1. **"No staged CSS files found"**
   - Ensure you have CSS files staged with `git add`
   - Check your `cssScanPatterns` configuration

2. **"Permission denied"**
   - Make sure the pre-commit hook is executable: `chmod +x .git/hooks/pre-commit`

3. **"Config file not found"**
   - Create `.css-check.config.json` in your project root
   - Or specify config path with `--config`

4. **Performance issues with large projects**
   - Use `ignorePatterns` to exclude unnecessary directories
   - Consider using `--files` to limit scope

### Debug Mode

```bash
# Enable verbose logging
npx css-check --verbose

# Check specific files only
npx css-check --files "blocks/buttons/*.css"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [PostCSS](https://postcss.org/) for CSS parsing
- Inspired by CSS linting tools like Stylelint
- Designed for Adobe development workflows 
