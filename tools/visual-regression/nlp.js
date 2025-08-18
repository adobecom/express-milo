/**
 * Improved Natural Language Processing for visual regression commands
 */

export function parseVisualRegressionQuery(input) {
  const text = input.toLowerCase().trim();
  
  // Common branch names and patterns
  const commonBranches = ['main', 'stage', 'prod', 'production', 'master', 'develop', 'dev'];
  
  // Extract quoted strings first (these are likely exact parameters)
  const quotedStrings = text.match(/"([^"]+)"|'([^']+)'/g) || [];
  const quotes = quotedStrings.map(q => q.slice(1, -1)); // remove quotes
  
  // Remove quoted strings from text for easier parsing
  let cleanText = text;
  quotedStrings.forEach(q => {
    cleanText = cleanText.replace(q, '');
  });
  
  // Split into words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  let controlBranch = null;
  let experimentalBranch = null;
  let subdirectory = null;
  
  // Look for branches
  const branches = [];
  
  // Find branches in quotes first
  quotes.forEach(quote => {
    if (quote.startsWith('/')) {
      subdirectory = quote;
    } else if (quote.includes('-') || commonBranches.includes(quote)) {
      branches.push(quote);
    }
  });
  
  // Find branches in text
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^\w-]/g, '');
    
    // Check if this looks like a branch name
    if (cleanWord.includes('-') || commonBranches.includes(cleanWord)) {
      if (!branches.includes(cleanWord)) {
        branches.push(cleanWord);
      }
    }
    
    // Look for paths
    if (word.startsWith('/')) {
      subdirectory = word.replace(/[^\w\/-]/g, '');
    }
    
    // Check for path indicators
    const pathWords = ['path', 'page', 'url', 'at', 'for', 'on'];
    if (pathWords.includes(word) && index + 1 < words.length) {
      const nextWord = words[index + 1];
      if (nextWord.startsWith('/') || nextWord.includes('/')) {
        subdirectory = nextWord.replace(/[^\w\/-]/g, '');
      } else {
        // Build path from multiple words
        const pathParts = [];
        for (let i = index + 1; i < words.length; i++) {
          const part = words[i].replace(/[^\w-]/g, '');
          if (!part || branches.includes(part) || commonBranches.includes(part)) break;
          pathParts.push(part);
        }
        if (pathParts.length > 0) {
          subdirectory = '/' + pathParts.join('/');
        }
      }
    }
  });
  
  // Determine control and experimental branches
  if (branches.length >= 2) {
    // If main/master is present, it's usually the control
    if (branches.includes('main')) {
      controlBranch = 'main';
      experimentalBranch = branches.find(b => b !== 'main');
    } else if (branches.includes('master')) {
      controlBranch = 'master';
      experimentalBranch = branches.find(b => b !== 'master');
    } else if (branches.includes('stage') || branches.includes('prod')) {
      // If comparing stable branches, first mentioned is control
      controlBranch = branches[0];
      experimentalBranch = branches[1];
    } else {
      // First branch is control
      controlBranch = branches[0];
      experimentalBranch = branches[1];
    }
  } else if (branches.length === 1) {
    // Only one branch mentioned, assume comparing against main
    if (branches[0] === 'main' || branches[0] === 'master') {
      controlBranch = branches[0];
      experimentalBranch = 'stage'; // default
    } else {
      controlBranch = 'main'; // default
      experimentalBranch = branches[0];
    }
  } else {
    // No branches found, use defaults
    controlBranch = 'main';
    experimentalBranch = 'stage';
  }
  
  // Default path if none found
  if (!subdirectory) {
    subdirectory = '/express'; // sensible default for this project
  }
  
  // Clean up subdirectory
  if (subdirectory && !subdirectory.startsWith('/')) {
    subdirectory = '/' + subdirectory;
  }
  
  return {
    controlBranch: controlBranch || 'main',
    experimentalBranch: experimentalBranch || 'stage',
    subdirectory: subdirectory || '/express',
    confidence: calculateConfidence(text, controlBranch, experimentalBranch, subdirectory)
  };
}

function calculateConfidence(text, control, experimental, path) {
  let score = 0;
  
  // Higher confidence if we found explicit branch names
  if (text.includes(control)) score += 30;
  if (text.includes(experimental)) score += 30;
  
  // Higher confidence if we found a path
  if (text.includes(path)) score += 25;
  if (text.includes('/')) score += 15;
  
  // Keywords that indicate intent
  const keywords = ['compare', 'test', 'check', 'visual', 'difference', 'regression'];
  keywords.forEach(keyword => {
    if (text.includes(keyword)) score += 5;
  });
  
  return Math.min(100, score);
}

export function suggestCorrections(parsed, originalQuery) {
  const suggestions = [];
  
  if (parsed.confidence < 60) {
    suggestions.push('Query confidence is low. Consider being more specific.');
  }
  
  if (parsed.controlBranch === 'main' && parsed.experimentalBranch === 'stage' && 
      !originalQuery.includes('main') && !originalQuery.includes('stage')) {
    suggestions.push('No branches detected, using default: main vs stage');
  }
  
  if (parsed.subdirectory === '/express' && !originalQuery.includes('express') && !originalQuery.includes('/')) {
    suggestions.push('No path detected, using default: /express');
  }
  
  return suggestions;
}