const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
const file = fs.createWriteStream(path.join('02-write-file', 'text.txt'));

stdout.write('Введите текст\n');

stdin.on('data', (data) => {
  file.write(data);
  if (data.toString().trim() === 'exit') {
    stdout.write('Пока удачи!');
    process.exit();
  }
});

process.on('SIGINT', () => {
  stdout.write('Пока удачи!');
  process.exit();
});
