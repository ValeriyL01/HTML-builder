const fs = require('fs');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
async function createBuild() {
  const bundleStream = fs.createWriteStream(bundle, 'utf-8');
  const files = await fs.promises.readdir(styles, {
    withFileTypes: true,
  });

  files.forEach((file) => {
    if (path.extname(file.name) === '.css') {
      const cssFiles = path.join(__dirname, 'styles', `${file.name}`);
      const readStream = fs.createReadStream(cssFiles, 'utf-8');
      readStream.pipe(bundleStream);
    }
  });
}

createBuild();
