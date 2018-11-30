/* eslint-env node, es6 */
const fs = require('fs'),
  app = require('../app'),
  Server = require('serverbuilder'),
  port = 3000;
const securityOptions = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};
app.set('port', port);

let options = {
  name: 'Example HTTP/2 Server',
  useHttp2: true,
  securityOptions,
  callback: (server) => {
    app.set(server.port)
    console.log(`"${server.name}" is READY and app has the correct port set`);
  },
  showPublicIP: true
}

new Server(app, port, options);