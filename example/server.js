/* eslint-env node, es6 */
const app = require('./app'), Server = require('../index'), port = 3e3;
app.set('port', port);

new Server(app, port, 'Example Server');