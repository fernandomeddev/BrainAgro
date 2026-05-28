const { createReadStream, existsSync } = require('node:fs');
const { createServer } = require('node:http');
const { extname, join, normalize } = require('node:path');

const port = Number(process.env.WEB_PORT ?? 4173);
const root = join(__dirname, 'dist');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const requestedPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, requestedPath === '/' ? 'index.html' : requestedPath);
  const targetPath = existsSync(filePath) ? filePath : join(root, 'index.html');
  const extension = extname(targetPath);

  response.setHeader('Content-Type', contentTypes[extension] ?? 'application/octet-stream');
  createReadStream(targetPath)
    .on('error', () => {
      response.statusCode = 404;
      response.end('Not found');
    })
    .pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`web.static.started port=${port}`);
});
