#!/usr/bin/env node
// Small CLI tool to scan the repo for risky service worker patterns and optionally fix them.
// Usage: node tools/ia_scanner.js [--fix]

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];

  if (/importScripts\(\s*['\"]https?:\/\//.test(content)) {
    findings.push({ type: 'remote-import', message: 'Remote importScripts detected' });
  }
  if (/self\.options\s*=/.test(content)) {
    findings.push({ type: 'global-options', message: 'Use of self.options (potential collision)' });
  }
  if (/self\.lary\s*=/.test(content)) {
    findings.push({ type: 'unused-var', message: 'Found self.lary — possibly unused' });
  }

  return findings;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace self.options with namespaced key
  content = content.replace(/self\.options\s*=\s*\{/g, 'self.__cinecash_sw_options__ = {');
  // Remove self.lary assignments
  content = content.replace(/\n?\s*self\.lary\s*=\s*['\"][^'\"]*['\"];?\s*\n?/g, '\n');
  // Wrap importScripts with try/catch if remote import detected
  content = content.replace(/importScripts\((['\"]https?:\/\/[^)]+\)['\"]\);?/g, match => {
    return `try { ${match} } catch (err) { console.error('[sw] Failed to import remote service worker script:', err); self.addEventListener('fetch', function noopFetchHandler(event) {}); }`;
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  const files = glob.sync('**/sw.js', { nodir: true, ignore: 'node_modules/**' });
  if (!files.length) {
    console.log('No sw.js files found');
    return;
  }

  for (const f of files) {
    const findings = scanFile(f);
    if (findings.length) {
      console.log(`Findings in ${f}:`);
      findings.forEach(r => console.log(` - [${r.type}] ${r.message}`));
      if (shouldFix) {
        console.log(`Applying fixes to ${f}`);
        fixFile(f);
      }
    } else {
      console.log(`${f}: OK`);
    }
  }
}

if (require.main === module) main();
