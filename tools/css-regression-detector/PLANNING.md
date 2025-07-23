# 📄 Planning Doc: CSS Regression Detector (Pre-Commit CLI Tool)

## 🎯 Goal
Detect CSS regressions by analyzing staged CSS files for conflicts and specificity drift against all CSS files in the project, and scan all JS files for usage of changed selectors.

## ✅ Core Features

### 1. Dual Scanning Modes

#### Default Mode (Staged Changes)
- **Purpose**: Regression detection + code quality for staged changes
- **Scope**: Compares staged CSS changes against existing codebase baseline
- **Use Case**: Pre-commit validation to ensure changes don't break existing CSS
- **Command**: `npm run css-check`

#### Scan-All Mode (Full Codebase)
- **Purpose**: General code quality audit of entire codebase
- **Scope**: Scans ALL CSS files for existing conflicts and issues
- **Use Case**: Periodic audits, technical debt assessment, pre-refactoring analysis
- **Command**: `npm run css-check -- --scan-all`

### 2. Targeted File Scope
- Parse only staged `.css` files (files about to be committed) in default mode
- Parse all other `.css` files in the project as baseline for conflict detection
- Scan all `.js` files for usage of changed selectors
- Full codebase CSS analysis in scan-all mode

### 3. Selector Conflict Detection
- Map selectors and declarations from staged and baseline CSS
- Flag conflicting or duplicate selectors
- Detect override patterns that could cause unexpected behavior
- Identify conflicts across entire codebase in scan-all mode

### 4. Specificity Drift Detection
- Calculate selector specificity using standard CSS specificity rules
- Flag risky increases in specificity that could break existing styles
- Provide specificity comparison between staged and baseline

### 5. JavaScript Usage Analysis
- Scan all JS files for changed selector usage (in `className`, `classList`, template literals, etc.)
- Warn if selectors are widely used or in shared components
- Detect dynamic class usage patterns

### 6. Danger Zone Watchlist
- Configurable list of critical selectors that always trigger warnings
- Global selectors that affect multiple components
- Framework-specific selectors (e.g., `.btn`, `.container`, `body`, `.modal`)

## 🛠 Tool Architecture

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
├── .css-check.config.json # Default configuration
└── README.md             # Usage documentation
```

## ⚙️ Configuration

### Config File (`.css-check.config.json`)
```json
{
  "dangerSelectors": [
    ".btn",
    ".container", 
    "body",
    ".modal",
    ".header",
    ".footer",
    ".nav",
    ".sidebar"
  ],
  "thresholds": {
    "specificityIncrease": 2,
    "maxConflicts": 5,
    "maxUsageWarnings": 10
  },
  "ignorePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
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

## 📌 Pre-Commit Hook Behavior

### Integration Points
- **Husky Integration**: Configure as pre-commit hook via Husky
- **Git Hooks**: Direct integration with `.git/hooks/pre-commit`
- **Package Scripts**: Available as `npm run css-check`

### Execution Flow

#### Default Mode (Staged Changes)
1. **File Discovery**: Get staged CSS files via `git diff --cached --name-only`
2. **Baseline Analysis**: Parse all existing CSS files in project
3. **Conflict Detection**: Compare staged vs baseline selectors
4. **Specificity Analysis**: Calculate and compare specificity values
5. **Usage Scanning**: Scan JS files for changed selector usage
6. **Report Generation**: Format results with actionable recommendations
7. **Exit Decision**: Block commit if critical issues found

#### Scan-All Mode (Full Codebase)
1. **File Discovery**: Get all CSS files in project
2. **Conflict Detection**: Detect conflicts within entire codebase
3. **Danger Selector Analysis**: Check for critical selector issues
4. **Report Generation**: Format comprehensive codebase analysis
5. **Exit Decision**: Provide summary of all issues found

### Exit Codes
- `0`: No issues detected, commit can proceed
- `1`: Warnings found, but commit can proceed with `--no-verify`
- `2`: Critical issues found, commit blocked

## 🧪 Example Output

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

4. ⚠️ Usage Warning
   File: blocks/header/header.css
   Selector: `.header-nav` 
   Usage: Found in 5 JS files
   Recommendation: Test thoroughly before committing

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

2. 🚨 conflict
   File: express/code/blocks/ax-columns/ax-columns.css
   Line: 22
   Issue: Selector ".section:has(.ax-columns) > .content" has conflicting declarations
   Conflicts:
     Line 22: max-width: 350px;
     Line 1071: max-width: 836px;

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

## ✅ MVP Task List

### Phase 1: Core Infrastructure ✅
- [x] Set up project structure and dependencies
- [x] Implement `gitUtils.js` for staged file detection
- [x] Create `cssParser.js` for CSS parsing
- [x] Build `conflictDetector.js` for selector conflicts
- [x] Develop `config.js` for configuration management

### Phase 2: Analysis Engine ✅
- [x] Implement `conflictDetector.js` for selector conflicts
- [x] Create `usageScanner.js` for JS file scanning
- [x] Build `reporter.js` for formatted output
- [x] Add comprehensive error handling

### Phase 3: CLI Integration ✅
- [x] Develop `cli.js` as main entry point
- [x] Integrate with pre-commit hooks
- [x] Add command-line options and flags
- [x] Implement exit code logic

### Phase 4: Advanced Features ✅
- [x] Add scan-all mode for full codebase analysis
- [x] Implement dual scanning modes (staged vs full codebase)
- [x] Enhanced conflict reporting with line numbers
- [x] Improved output formatting and summary

### Phase 5: Testing & Documentation
- [ ] Write unit tests for all modules
- [ ] Create integration tests
- [ ] Document usage and configuration
- [ ] Add examples and troubleshooting guide

### Phase 6: Future Enhancements
- [ ] Add support for SCSS/Sass files
- [ ] Implement performance optimizations
- [ ] Add caching for large projects
- [ ] Create VS Code extension integration

## 🔧 Technical Requirements

### Dependencies
```json
{
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^13.1.0",
    "css-selector-parser": "^1.4.1",
    "glob": "^10.3.10",
    "simple-git": "^3.22.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "eslint": "^8.11.0",
    "husky": "^8.0.3"
  }
}
```

### Performance Considerations
- **Parallel Processing**: Parse CSS files in parallel for large projects
- **Caching**: Cache parsed CSS data between runs
- **Incremental Analysis**: Only re-analyze changed files
- **Memory Management**: Stream large files instead of loading entirely

### Error Handling
- **Graceful Degradation**: Continue analysis even if some files fail to parse
- **Detailed Logging**: Provide clear error messages and stack traces
- **Recovery Options**: Allow users to skip problematic files
- **Validation**: Validate configuration and file paths

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

## 📋 Success Metrics

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

## 🎯 Usage Workflow

### Daily Development
```bash
# Check staged changes before commit
npm run css-check
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

---

*This planning document serves as the foundation for building a robust CSS regression detection system that integrates seamlessly into the development workflow.* 