const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'projects');

const academic = ['tidescape', 'pb-workshop', 'canography', 'roboshore', 'amorf', 'kairo-looro', 'kartalkaya', 'mdc'];
const professional = ['tower-in-kadikoy', 'tower-in-ihsaniye', 'iris-tower'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(path.join(baseDir, 'academic'));
ensureDir(path.join(baseDir, 'professional'));
ensureDir(path.join(baseDir, 'explorations'));

academic.forEach(p => {
  const src = path.join(baseDir, p);
  const dest = path.join(baseDir, 'academic', p);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.renameSync(src, dest);
    console.log(`Moved academic/${p}`);
  }
});

professional.forEach(p => {
  const src = path.join(baseDir, p);
  const dest = path.join(baseDir, 'professional', p);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.renameSync(src, dest);
    console.log(`Moved professional/${p}`);
  }
});

const parametricDir = path.join(baseDir, 'parametric');
if (fs.existsSync(parametricDir)) {
  const items = fs.readdirSync(parametricDir);
  items.forEach(item => {
    const src = path.join(parametricDir, item);
    const dest = path.join(baseDir, 'explorations', item);
    if (!fs.existsSync(dest)) {
      fs.renameSync(src, dest);
      console.log(`Moved explorations/${item}`);
    }
  });
  try {
    fs.rmdirSync(parametricDir);
  } catch (e) {
    console.log('Parametric dir removed or not empty');
  }
}

console.log('Reorganization complete.');
