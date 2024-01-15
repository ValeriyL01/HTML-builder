const path = require('path');
const fs = require('fs');

const secret = path.join(__dirname, 'secret-folder');

fs.readdir(secret, { withFileTypes: true }, (err, data) => {
  if (err) throw err;

  data.forEach((file) => {
    if (file.isDirectory()) {
      return;
    }

    const f = path.join(__dirname, 'secret-folder', `${file.name}`);
    fs.stat(f, (err, stat) => {
      if (err) {
        console.log(err);
      }
      console.log(
        `${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${
          stat.size
        }b`,
      );
    });
  });
});
