const fs = require('fs');
const path = require('path');
// -- создать папку project-dist

const projectDist = path.join(__dirname, 'project-dist');
fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) throw err;
});
// -- Собирает в единый файл стили из папки styles и помещает их в файл project-dist/style.css.
const styles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'style.css');

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

// Заменить шаблонные теги в файле template.html на содержимое компонентов articles,footer,header
async function createHtml() {
  const templateHTML = path.join(__dirname, 'template.html');
  const indexHtml = path.join(__dirname, 'project-dist', 'index.html');
  const component = path.join(__dirname, 'components');
  let templateHTMLData = '';
  try {
    fs.readFile(templateHTML, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      templateHTMLData = data;
    });
    const HtmlFiles = await fs.promises.readdir(component);

    const components = await Promise.all(
      HtmlFiles.map(async (file) => {
        const componentDataString = await fs.promises.readFile(
          `06-build-page/components/${file}`,
          'utf-8',
        );

        return {
          fileName: file.replace('.html', ''),
          content: componentDataString,
        };
      }),
    );

    components.forEach(({ fileName, content }) => {
      templateHTMLData = templateHTMLData.replace(`{{${fileName}}}`, content);
    });

    await fs.promises.writeFile(indexHtml, templateHTMLData, 'utf-8');
  } catch (err) {
    console.log('Error', err);
  }
}
createHtml();

// -- копировать папку assets в project-dist
async function copyAssets(folder, folderCopy) {
  try {
    fs.mkdir(folderCopy, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
    const files = await fs.promises.readdir(folder, {
      withFileTypes: true,
    });

    files.forEach((file) => {
      const folderPath = path.join(folder, file.name);
      const folderCopyPath = path.join(folderCopy, file.name);

      if (file.isDirectory()) {
        copyAssets(folderPath, folderCopyPath);
      } else {
        fs.promises.copyFile(
          folderPath,
          folderCopyPath,
          fs.constants.COPYFILE_FICLONE,
        );
      }
    });
  } catch (err) {
    console.log('Error', err);
  }
}

copyAssets(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);
