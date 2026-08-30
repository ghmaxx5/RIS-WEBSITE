const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      if (['node_modules', '.git', 'android', 'www', '.gemini'].includes(item)) continue;
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync('www')) fs.mkdirSync('www', { recursive: true });
copyRecursive('css', 'www/css');
copyRecursive('js', 'www/js');
copyRecursive('assets', 'www/assets');
fs.copyFileSync('index.html', 'www/index.html');
console.log('⚡ RIS School App: Web bundle built to www/ successfully.');
