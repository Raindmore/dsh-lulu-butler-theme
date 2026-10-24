import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8' };
const port = Number(process.env.LULU_PREVIEW_PORT || 4178);
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') { res.writeHead(302, { Location: '/preview/index.html' }); res.end(); return; }
    const pathname = decodeURIComponent(url.pathname === '/' ? '/preview/index.html' : url.pathname);
    const filename = path.resolve(root, `.${pathname}`);
    if (!filename.startsWith(root) || !(await stat(filename)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(filename));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Lulu theme preview: http://127.0.0.1:${port}`));
