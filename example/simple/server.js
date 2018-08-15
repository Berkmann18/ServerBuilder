/* eslint-env node, es6 */
const app = require('../app'),
  Server = require('serverbuilder'),
  port = 3e3;
app.set('port', port);

let options = {
  name: 'Example Server',
  callback: (server) => {
    app.set(server.port)
    console.log(`"${server.name}" is READY and app has the correct port set`);
  },
  showPublicIP: true
}

new Server(app, port, options);