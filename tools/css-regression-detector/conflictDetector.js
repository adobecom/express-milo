class ConflictDetector {
  constructor(config) {
    this.config = config;
    this.dangerSelectors = config.getDangerSelectors();
    this.thresholds = config.getThresholds();
  }

  detectConflicts(stagedCSS, baselineCSS) {
    const conflicts = {
      selectorConflicts: [],
      specificityIssues: [],
      dangerSelectorIssues: [],
      totalConflicts: 0,
    };

    // Flatten all staged rules
    const stagedRules = ConflictDetector.flattenRules(stagedCSS);
    const baselineRules = ConflictDetector.flattenRules(baselineCSS);

    // Check for selector conflicts
    for (const stagedRule of stagedRules) {
      const baselineRule = ConflictDetector.findMatchingRule(stagedRule.selector, baselineRules);

      if (baselineRule) {
        // Check for conflicts
        const conflict = this.checkRuleConflict(stagedRule, baselineRule);
        if (conflict) {
          conflicts.selectorConflicts.push(conflict);
          conflicts.totalConflicts += 1;
        }

        // Check for specificity increases
        const specificityIssue = this.checkSpecificityIncrease(stagedRule, baselineRule);
        if (specificityIssue) {
          conflicts.specificityIssues.push(specificityIssue);
        }
      }

      // Check for danger selector modifications
      if (this.dangerSelectors.includes(stagedRule.selector)) {
        conflicts.dangerSelectorIssues.push({
          type: 'dangerSelector',
          selector: stagedRule.selector,
          file: stagedRule.filePath,
          lineNumber: stagedRule.lineNumber,
          severity: 'error',
          message: `Danger selector "${stagedRule.selector}" modified`,
        });
        conflicts.totalConflicts += 1;
      }
    }

    return conflicts;
  }

  detectAllConflicts(allCSS) {
    const conflicts = {
      selectorConflicts: [],
      specificityIssues: [],
      dangerSelectorIssues: [],
      totalConflicts: 0,
    };

    // Flatten all rules from all files
    const allRules = ConflictDetector.flattenRules(allCSS);

    // Group rules by selector
    const selectorGroups = {};
    for (const rule of allRules) {
      if (!selectorGroups[rule.selector]) {
        selectorGroups[rule.selector] = [];
      }
      selectorGroups[rule.selector].push(rule);
    }

    // Check for duplicate selectors and conflicts
    for (const [selector, rules] of Object.entries(selectorGroups)) {
      if (rules.length > 1) {
        // Multiple rules with same selector - check for conflicts
        for (let i = 0; i < rules.length; i++) {
          for (let j = i + 1; j < rules.length; j++) {
            const conflict = this.checkRuleConflict(rules[i], rules[j]);
            if (conflict) {
              conflicts.selectorConflicts.push(conflict);
              conflicts.totalConflicts += 1;
            }
          }
        }

        // Check for danger selectors
        if (this.dangerSelectors.includes(selector)) {
          rules.forEach((rule) => {
            conflicts.dangerSelectorIssues.push({
              type: 'dangerSelector',
              selector: rule.selector,
              file: rule.filePath,
              lineNumber: rule.lineNumber,
              severity: 'error',
              message: `Danger selector "${rule.selector}" found in multiple locations`,
            });
            conflicts.totalConflicts += 1;
          });
        }
      }
    }

    return conflicts;
  }

  static flattenRules(cssFiles) {
    const rules = [];
    for (const file of cssFiles) {
      for (const rule of file.rules) {
        rules.push({
          ...rule,
          filePath: file.filePath,
        });
      }
    }
    return rules;
  }

  static findMatchingRule(selector, rules) {
    return rules.find((rule) => rule.selector === selector);
  }

  checkRuleConflict(stagedRule, baselineRule) {
    const conflictingProperties = [];

    for (const stagedDecl of stagedRule.declarations) {
      const baselineDecl = baselineRule.declarations.find(
        (d) => d.property === stagedDecl.property,
      );

      if (baselineDecl && baselineDecl.value !== stagedDecl.value) {
        conflictingProperties.push({
          property: stagedDecl.property,
          oldValue: baselineDecl.value,
          newValue: stagedDecl.value,
          oldDeclaration: `${baselineDecl.property}: ${baselineDecl.value};`,
          newDeclaration: `${stagedDecl.property}: ${stagedDecl.value};`,
          oldLineNumber: baselineRule.lineNumber,
          newLineNumber: stagedRule.lineNumber,
        });
      }
    }

    if (conflictingProperties.length > 0) {
      return {
        type: 'conflict',
        selector: stagedRule.selector,
        file: stagedRule.filePath,
        lineNumber: stagedRule.lineNumber,
        baselineFile: baselineRule.filePath,
        baselineLineNumber: baselineRule.lineNumber,
        conflictingProperties,
        severity: 'error',
        message: `Selector "${stagedRule.selector}" has conflicting declarations`,
      };
    }

    return null;
  }

  checkSpecificityIncrease(stagedRule, baselineRule) {
    const stagedSpec = stagedRule.specificity;
    const baselineSpec = baselineRule.specificity;

    // Calculate total specificity (simplified)
    const stagedTotal = stagedSpec[1] * 100 + stagedSpec[2] * 10 + stagedSpec[3];
    const baselineTotal = baselineSpec[1] * 100 + baselineSpec[2] * 10 + baselineSpec[3];

    const increase = stagedTotal - baselineTotal;
    const maxIncrease = this.thresholds.specificityIncrease || 2;

    if (increase > maxIncrease) {
      return {
        type: 'specificityIncrease',
        selector: stagedRule.selector,
        file: stagedRule.filePath,
        oldSpecificity: baselineSpec,
        newSpecificity: stagedSpec,
        increase,
        severity: 'warning',
        message: `Specificity increased by ${increase} for selector "${stagedRule.selector}"`,
      };
    }

    return null;
  }
}

export default ConflictDetector;
