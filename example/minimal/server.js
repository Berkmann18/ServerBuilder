/* eslint-env node, es6 */
const app = (req, res) => {
  if (req.headers['content-type'] === 'text/plain') {
    let body = '';

    req.on('data', (chunk) => body += chunk.toString());

    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('correct header');
      server.server.emit('success', body);
    });

  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('wrong header');
  }
};

const Server = require('serverbuilder'),
  port = 3000;

let options = {
  name: 'Minimal Example Server',
  callback: (server) => {
    console.log(`"${server.name}" is READY and app has the correct port set`);
  },
}

let server = new Server(app, port, options);