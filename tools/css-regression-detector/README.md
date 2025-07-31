# CSS Regression Detector

A pre-commit hook tool that detects CSS regressions by analyzing staged CSS files for conflicts and specificity drift against all CSS files in the project, and scans all JS files for usage of changed selectors.

## 🚀 Quick Start

### Installation

The tool is already integrated into this project. No additional installation needed.

### Basic Usage

```bash
# Check staged changes (regression detection)
npm run css-check

# Scan entire codebase (code quality audit)
npm run css-check-all

# Run tool tests
npm run test:css-tool
```

## 📋 Features

### ✅ Dual Scanning Modes

#### Default Mode (Staged Changes)
- **Purpose**: Regression detection + code quality for staged changes
- **Scope**: Compares staged CSS changes against existing codebase baseline
- **Use Case**: Pre-commit validation to ensure changes don't break existing CSS
- **Command**: `npm run css-check`

#### Scan-All Mode (Full Codebase)
- **Purpose**: General code quality audit of entire codebase
- **Scope**: Scans ALL CSS files for existing conflicts and issues
- **Use Case**: Periodic audits, technical debt assessment, pre-refactoring analysis
- **Command**: `npm run css-check-all`

### ✅ Core Capabilities

1. **Targeted File Scope**
   - Parse only staged `.css` files (files about to be committed) in default mode
   - Parse all other `.css` files in the project as baseline for conflict detection
   - Scan all `.js` files for usage of changed selectors
   - Full codebase CSS analysis in scan-all mode

2. **Selector Conflict Detection**
   - Map selectors and declarations from staged and baseline CSS
   - Flag conflicting or duplicate selectors
   - Detect override patterns that could cause unexpected behavior
   - Identify conflicts across entire codebase in scan-all mode

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

## 🎯 Usage Workflow

### Daily Development
```bash
# Make CSS changes
git add your-css-file.css

# Check your changes before commit
npm run css-check

# Commit if clean
git commit -m "your message"
```

### Periodic Audits
```bash
# Full codebase quality audit
npm run css-check-all
```

### Pre-Refactoring Analysis
```bash
# Understand existing conflicts before major changes
npm run css-check-all
```

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
  --scan-all               Scan entire codebase for existing CSS issues (not just staged)
  --dry-run               Show what would be checked without making changes
  -h, --help              Display help information
```

## 📊 Example Output

### Default Mode Output
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

### Scan-All Mode Output
```
🔍 CSS Regression Detector - Full Codebase Scan
==================================================

📊 Scan Summary:
✅ Scanned 150 CSS files with 2,847 total rules

❌ CRITICAL ISSUES FOUND:

1. 🚨 conflict
   File: express/code/styles/styles.css
   Line: 9
   Issue: Selector ":root" has conflicting declarations
   Conflicts:
     Line 9: --ax-grid-margin: 20px;
     Line 127: --ax-grid-margin: 32px;

📋 Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Issues Found: 1,136
  🚨 Critical Errors: 1,136
  ⚠️  Warnings: 0

Files with issues:
  express/code/styles/styles.css: 65 issues
  express/code/blocks/ax-columns/ax-columns.css: 81 issues
  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🏗️ Architecture

```
/tools/css-regression-detector
├── cli.js                # CLI entry point (pre-commit hook)
├── gitUtils.js           # Git operations for staged files
├── cssParser.js          # Parse CSS selectors and declarations
├── conflictDetector.js   # Detect conflicts and overrides
├── usageScanner.js       # Scan JS files for selector usage
├── config.js             # Load watchlist and thresholds
├── reporter.js           # Format and output results
├── index.js              # Main detector class
├── test.js               # Self-contained test suite
├── .css-check.config.json # Default configuration
└── README.md             # Usage documentation
```

## 🔗 Integration

### Pre-commit Hook (Already Configured)

The tool is already integrated with Husky pre-commit hooks in this project:

```bash
# Pre-commit hook runs automatically on every commit
git commit -m "your message"
```

### Manual Integration

Add to your `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run css-check
if [ $? -ne 0 ]; then
  echo "CSS regression check failed. Commit blocked."
  exit 1
fi
```

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: CSS Regression Check
  run: npm run css-check
```

## 🧪 Testing

```bash
# Run the CSS tool tests
npm run test:css-tool

# Run the main browser tests (unaffected)
npm test
```

The CSS tool tests are completely self-contained and won't interfere with the main test suite.

## 🐛 Troubleshooting

### Common Issues

1. **"No staged CSS files found"**
   - Ensure you have CSS files staged with `git add`
   - Check your `cssScanPatterns` configuration

2. **"Permission denied"**
   - Make sure the pre-commit hook is executable: `chmod +x .husky/pre-commit`

3. **"Config file not found"**
   - Create `.css-check.config.json` in your project root
   - Or specify config path with `--config`

4. **Performance issues with large projects**
   - Use `ignorePatterns` to exclude unnecessary directories
   - Consider using `--files` to limit scope

### Debug Mode

```bash
# Enable verbose logging
npm run css-check --verbose

# Check specific files only
npm run css-check --files "blocks/buttons/*.css"

# Run scan-all mode
npm run css-check --scan-all

# Run scan-all mode via package.json script
npm run css-check-all
```

## 📈 Success Metrics

### Technical Metrics
- **False Positive Rate**: < 5% of warnings should be false positives
- **Performance**: Analysis completes in < 30 seconds for typical projects
- **Accuracy**: 95%+ detection rate for actual CSS regressions
- **Coverage**: Support for 90%+ of common CSS patterns

### Adoption Metrics
- **Team Adoption**: 80%+ of team members use the tool
- **Issue Prevention**: 70%+ reduction in CSS-related bugs
- **Developer Satisfaction**: 4.5+ rating on developer experience
- **Maintenance Overhead**: < 2 hours per week for tool maintenance

## 🚀 Future Enhancements

### Advanced Analysis
- **CSS-in-JS Detection**: Support for styled-components, emotion, etc.
- **Framework Integration**: React, Vue, Angular specific patterns
- **Design System Validation**: Check against design token systems
- **Performance Impact**: Analyze CSS bundle size changes

### Developer Experience
- **IDE Integration**: VS Code, WebStorm plugins
- **CI/CD Integration**: GitHub Actions, GitLab CI templates
- **Interactive Mode**: Step-through analysis with user decisions
- **Fix Suggestions**: Automated fix recommendations

### Reporting
- **HTML Reports**: Detailed web-based reports
- **Trend Analysis**: Track regressions over time
- **Team Dashboards**: Aggregate results across team
- **Integration**: Slack, Teams, email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm run test:css-tool`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [PostCSS](https://postcss.org/) for CSS parsing
- Inspired by CSS linting tools like Stylelint
- Designed for Adobe development workflows 
