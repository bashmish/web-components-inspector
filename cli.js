#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const openInEditor = require('express-open-in-editor');
const yargs = require('yargs');

const argv = yargs
  .usage('Usage: wci')
  .example('wci', 'Run Web Components inspector server on default port')
  .example('wci -e code', 'Run Web Components inspector server on default port and open files in VSCode')
  .string('editor')
  .alias('editor', 'e')
  .describe('editor', 'Editor to open file in (choose one of supported https://www.npmjs.com/package/open-in-editor)')
  .number('port')
  .default('port', 9247)
  .alias('port', 'p')
  .describe('port', 'Port to listen on')
  .argv;

const app = express();

app.use(cors());

if (argv.editor) {
  app.get('/open-in-editor', openInEditor({ editor: argv.editor }));
}

const bookmarkletFiles = [
  'publisher.js',
  'publisher.js.map',
  'subscriber.js',
  'subscriber.js.map',
];

bookmarkletFiles.forEach((filename) => {
  app.get(`/${filename}`, (req, res) => {
    const absPath = path.resolve(__dirname, './dist/', filename);
    let content = fs.readFileSync(absPath, 'utf8');
    if (filename === 'publisher.js' || filename === 'subscriber.js') {
      content = content.replace(
        `//# sourceMappingURL=${filename}.map`,
        `//# sourceMappingURL=http://127.0.0.1:${argv.port}/${filename}.map`,
      );
    }
    if (filename === 'publisher.js') {
      content = content
        .replace(
          'http://127.0.0.1:8247/subscriber.js',
          `http://127.0.0.1:${argv.port}/subscriber.js`,
        )
        .replace(
          'http://127.0.0.1:6437/open-in-editor/',
          `http://127.0.0.1:${argv.port}/open-in-editor/`,
        );
    }
    res.type('application/json');
    res.send(content);
  });
});

app.listen(argv.port, () => {
  console.log(`WCI server is running on 127.0.0.1:${argv.port}...`);
});
