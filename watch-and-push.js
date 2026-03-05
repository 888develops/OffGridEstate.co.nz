#!/usr/bin/env node
/**
 * Watches the project folder and runs: git add . && git commit && git push
 * when files change. Excludes .git, node_modules, and this script's log output.
 * Run with: npm run watch-push
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Use chokidar if installed, otherwise fall back to fs.watch
let watcher;
try {
  watcher = require('chokidar');
} catch (e) {
  console.error('Missing dependency. Run: npm install --save-dev chokidar');
  process.exit(1);
}

const root = path.resolve(__dirname);
const DEBOUNCE_MS = 8000;  // Wait 8 seconds after last change before pushing
let debounceTimer = null;

function runShell(command) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const p = spawn(isWin ? 'cmd' : 'sh', [isWin ? '/c' : '-c', command], {
      stdio: 'inherit',
      cwd: root
    });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error('exited ' + code))));
  });
}

async function push() {
  console.log('\n[watch-push] Changes detected — committing and pushing...');
  debounceTimer = null;
  const msg = 'Update site (auto from watch-push)';
  try {
    await runShell('git add . && git commit -m "' + msg.replace(/"/g, '\\"') + '" && git push origin main');
    console.log('[watch-push] Done. Netlify will deploy from the new push.\n');
  } catch (e) {
    console.log('[watch-push] (If you see "nothing to commit" or "already up-to-date" above, that’s OK.)\n');
  }
}

function schedulePush() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(push, DEBOUNCE_MS);
}

const watchOpts = {
  persistent: true,
  ignoreInitial: true,
  ignored: [
    /(^|[\/\\])\.git([\/\\]|$)/,
    /(^|[\/\\])node_modules([\/\\]|$)/,
    /watch-and-push\.js$/,
    /\.log$/
  ]
};

console.log('Watching for file changes. Will commit + push to origin main after', DEBOUNCE_MS / 1000, 's of no changes.');
console.log('Stop with Ctrl+C.\n');

watcher.watch(root, watchOpts)
  .on('change', () => schedulePush())
  .on('add', () => schedulePush())
  .on('unlink', () => schedulePush());
