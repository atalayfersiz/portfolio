const fs = require('fs');
const path = require('path');

const targets = ['.next', 'out'];
for (const target of targets) {
  const targetPath = path.join(__dirname, '..', target);
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`🧹 Cleaned stale ${target} cache.`);
    } catch (e) {
      // Ignored if file locked
    }
  }
}
