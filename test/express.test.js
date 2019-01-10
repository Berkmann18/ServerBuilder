const Server = require('../index');
/* eslint-disable node/no-unpublished-require */
const { expect } = require('chai'),
  getPort = require('get-port'),
  express = require('express');
/* eslint-enable node/no-unpublished-require */

describe('Simply Express', () => {
  it('should run well', (done) => {
    getPort()
      .then(port => {
        const app = express();
        app.set('env', 'test');
        const server = new Server(app, port, { gracefulClose: false, silent: true });
        expect(typeof server, 'is an object').to.equal('object');
      }, err => console.error('getPort error:', err))
      .catch(err => console.error('HTTPS test error:', err))
      .then(done)
  });

  it('should RUN WELL', (done) => {
    getPort()
      .then(port => {
        const app = express();
        app.set('env', 'test');
        const server = new Server(app, port, { name: 'Express' });
        expect(typeof server, 'is an object').to.equal('object');
      }, err => console.error('getPort error:', err))
      .catch(err => console.error('HTTPS test error:', err))
      .then(done)
  });
});

describe('Auto', () => {
  it('should run immediately', (done) => {
    getPort()
      .then(port => {
        const app = express();
        const server = new Server(app, port, { name: 'Auto', autoRun: true });
        setTimeout(() => expect(server.address !== '', 'address found').to.equal(true), 100)
      }, err => console.error('getPort error:', err))
      .catch(err => console.error('HTTPS test error:', err))
      .then(done)
  });
});