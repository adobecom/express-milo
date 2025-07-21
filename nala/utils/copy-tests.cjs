#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ✅ Usage: node nala/utils/copy-and-fix-imports.js <source-repo-path> block1 block2

const [,, sourceRepo, ...blocks] = process.argv;

if (!sourceRepo || blocks.length === 0) {
  console.error(chalk.red('\n❌ Usage: node nala/utils/copy-and-fix-imports.cjs <source-repo-path> <block1> <block2> ...\n'));
  process.exit(1);
}

console.log(chalk.cyan(`\n📁 Source repo: ${sourceRepo}`));
console.log(chalk.cyan(`📦 Blocks to copy: ${blocks.join(', ')}`));

blocks.forEach((blockName) => {
  console.log(chalk.blue.bold(`\n🔄 Processing block: ${blockName}`));

  const sources = {
    page: path.join(sourceRepo, 'selectors/express', `${blockName}.page.js`),
    test: path.join(sourceRepo, 'tests/express', `${blockName}.test.js`),
    spec: path.join(sourceRepo, 'features/express', `${blockName}.spec.js`),
  };

  const destFolder = path.join(process.cwd(), 'nala', 'blocks', blockName);
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
    console.log(chalk.green(`📁 Created: ${destFolder}`));
  }

  for (const [type, src] of Object.entries(sources)) {
    const dest = path.join(destFolder, `${blockName}.${type}.cjs`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(chalk.green(`✅ Copied ${type} → ${dest}`));
    } else {
      console.log(chalk.yellow(`⚠️  Missing ${type}: ${src}`));
    }
  }

  // ✅ Update import paths inside the test.js file
  const testFile = path.join(destFolder, `${blockName}.test.cjs`);
  if (fs.existsSync(testFile)) {
    let content = fs.readFileSync(testFile, 'utf8');
    // Replace features/cc → current folder
    content = content.replace(`../../features/express/${blockName}.spec.js`, `./${blockName}.spec.cjs`);
    // Replace selectors/cc → current folder
    content = content.replace(`../../selectors/express/${blockName}.page.js`, `./${blockName}.page.cjs`);
    fs.writeFileSync(testFile, content);
    console.log(chalk.green(`✅ Fixed import paths in: ${testFile}`));
  }
});

console.log(chalk.green.bold('\n🎉 All blocks copied and imports fixed successfully!\n'));
