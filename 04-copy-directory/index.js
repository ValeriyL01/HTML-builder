const fs = require('fs');
const path = require('path');

const files1 = path.join(__dirname, 'files');
const files2 = path.join(__dirname, 'files-copy');
async function copyDir() {
  fs.mkdir(files2, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const f1 = await fs.promises.readdir(
    files2,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    },
  );
  f1.forEach((file) => {
    fs.unlink(path.join(files2, file.name), (err) => {
      if (err) throw err;
    });
  });
  const f2 = await fs.promises.readdir(
    files1,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    },
  );
  f2.forEach((file) => {
    fs.copyFile(
      path.join(files1, file.name),
      path.join(files2, file.name),
      (err) => {
        if (err) {
          throw err;
        }
      },
    );
  });
}
copyDir();
