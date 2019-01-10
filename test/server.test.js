const Server = require('../index');
/* eslint-disable node/no-unpublished-require */
const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  request = require('request'),
  fs = require('fs'),
  getPort = require('get-port'),
  { getNodeVersion } = require('../src/utils');
/* eslint-enable node/no-unpublished-require */

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Server response', () => {
  let server = new Server((req, res) => {
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
  }, 3000, { silent: true, callback(srv) { console.log(`${srv.name} started`) } });
  const URL = 'http://localhost:3000';

  it('should run fine', (done) => {
    server.run()
      .then(serv => expect(serv, 'to satisfy').to.deep.equal(server.server))
      .catch(err => console.error('run test error:', err))
      .then(_ => done())
  });

  it('should return 400', (done) => {
    request.get(URL, (err, res, body) => {
      expect(res.statusCode, 'status code').to.equal(400);
      expect(res.body, 'body').to.equal('wrong header');
      done();
    });
  });

  it('should return 200', (done) => {
    let options = {
      url: URL,
      headers: {
        'Content-Type': 'text/plain'
      }
    };
    request.get(options, (err, res, body) => {
      expect(res.statusCode, 'status code').to.equal(200);
      expect(res.body, 'body').to.equal('correct header');
      done();
    });
  });

  it('should emit request body', (done) => {
    let options = {
      url: URL,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'successfully emitted request'
    };
    let eventFired = false;

    request.get(options, (err, res, body) => {});

    server.server.on('success', (data) => {
      eventFired = true;
      expect(data, 'emitted data').to.equal('successfully emitted request');
    });

    setTimeout(() => {
      expect(eventFired, 'event fired').to.equal(true);
      done();
    }, 20);
  });
});

const smallApp = (req, res) => {};

describe('Attributes (HTTP)', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { silent: true }),
        server = require('http').Server;
      it('should have getters', (done) => {
        ser.run()
          .then(srv => {
            expect(ser.app, 'app').to.equal(smallApp);
            expect(ser.port, 'port').to.equal(port);
            expect(ser.name, 'name').to.equal('Server');
            expect(ser.useHttps, 'no HTTPS').to.equal(false);
            expect(ser.useHttp2, 'no HTTP/2').to.equal(false);
            expect(ser.options, 'no security options').to.deep.equal({});
            expect(ser.silent, 'silence').to.equal(true);
            expect(ser.protocol, 'protocol').to.equal('http');
            expect(ser.address, 'address').to.equal(`http://localhost:${port}`);
            expect(ser.server instanceof server, 'correct HTTP server').to.equal(true);
            done();
          })
          .catch(console.error);
      });

      it('should have methods', () => {
        expect(ser.toString(), 'toString').to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=false, useHttp2=false, options={})`);
      });

      it('should not over-start', (done) => {
        let fx = async() => {
          try {
            let serv = await ser.run();
            return serv;
          } catch (err) {
            expect(err.message).to.equal('Listen method has been called more than once without closing.');
            return err;
          } finally {
            done();
          }
        };
        fx();
      });
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('HTTPS test error:', err))
    .then(done)
});

const securityOptions = {
  key: fs.readFileSync('./example/secure/server-key.pem'),
  cert: fs.readFileSync('./example/secure/server-cert.pem')
};

describe('HTTPS', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { useHttps: true, securityOptions, silent: true }),
        server = require('https').Server;
      it('should have getters', async() => {
        expect(ser.app, 'app').to.equal(smallApp);
        expect(ser.port, 'port').to.equal(port);
        expect(ser.name, 'name').to.equal('Server');
        expect(ser.useHttps, 'HTTPS').to.equal(true);
        expect(ser.useHttp2, 'no HTTP/2').to.equal(false);
        expect(ser.options, 'security options').to.deep.equal(securityOptions);
        expect(ser.protocol, 'protocol').to.equal('https');
        let serv = await ser.run();
        expect(ser.address, 'address').to.equal(`https://localhost:${port}`);
        expect(ser.server instanceof server, 'correct HTTPS server').to.equal(true);
      });

      it('should have methods', () => {
        expect(ser.toString(), 'toString').to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=true, useHttp2=false, options=${JSON.stringify(securityOptions)})`);
      });
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('HTTPS test error:', err))
    .then(done)
});

describe('HTTP/2', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { useHttp2: true, securityOptions, silent: true, gracefulClose: false });
      it('should have getters', async() => {
        expect(ser.app, 'app').to.equal(smallApp);
        expect(ser.port, 'port').to.equal(port);
        expect(ser.name, 'name').to.equal('Server');
        expect(ser.useHttps, 'no HTTPS').to.equal(false);
        expect(ser.useHttp2, 'HTTP/2').to.equal(true);
        expect(ser.options, 'security options').to.deep.equal(securityOptions);
        expect(ser.protocol, 'protocol').to.equal('https');
        let serv = await ser.run();
        expect(ser.address, 'address').to.equal(`https://localhost:${port}`);
        expect(ser.server.constructor.name, 'correct HTTP/2 server').to.equal('Http2SecureServer'); //Since the class isn't exported by http2
      });

      it('should have methods', () => {
        expect(ser.toString(), 'toString').to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=false, useHttp2=true, options=${JSON.stringify(securityOptions)})`);
      });
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('HTTP/2 test error:', err)).
    then(done)
});

describe('Wrongs', () => {
  it('should have fail on \'port\' setting', () => {
    expect(() => new Server(smallApp, 'port', { silent: true, gracefulClose: false }), 'port is NaN').to.throw('Port should be >= 0 and < 65536. Received NaN');
  });

  it('should have fail on negative port setting', () => {
    expect(() => new Server(smallApp, -3e3, { silent: true, gracefulClose: false }), 'port < 0').to.throw('Port should be >= 0 and < 65536. Received false');
  });

  it('should set bad things', () => {
    let ser = new Server(smallApp, 5e3, { silent: true, gracefulClose: false });
    let newApp = (req, res) => console.log('res=', res);
    ser.app = newApp;
    expect(ser.app, 'new app').to.equal(newApp);
    ser.port = 4790;
    expect(ser.port, 'new port').to.equal(4790);
    ser.name = 'Lorem';
    expect(ser.name, 'new name').to.equal('Lorem');
    ser.useHttps = true;
    expect(ser.useHttps, 'HTTPS enabled').to.equal(true);
    ser.options = securityOptions;
    expect(ser.options, 'options set').to.deep.equal(securityOptions);
    ser.silent = false;
    expect(ser.silent, 'silenced').to.equal(false);
    ser.useHttp2 = true;
    expect(ser.useHttp2, 'HTTP/2 enabled').to.equal(true);
    let serv = require('http').createServer(smallApp);
    ser.server = serv;
    ser.run();
    expect(ser.server, 'new server').to.deep.equal(serv);
  });

  it('should throw EADDRINUSE', async() => {
    let port = 5000,
      ser = new Server(smallApp, port, { name: 'Copycat', gracefulClose: false });
    try {
      let serv = await ser.run();
    } catch (err) {
      expect(err.message, 'EADDRINUSE').to.equal(`Port ${port} is already in use`);
    }
  });

  /* it('should throw EACCES', async() => {
    let port = 500;
    try {
      let ser = new Server(smallApp, port, { name: 'Priviledged' });
      console.log('port=', ser.port);
      let serv = await ser.run();
      console.log('serv=', serv);
      expect.fail('No EACCES error');
    } catch (err) {
      console.log('E', err);
      expect(err.message, 'EACCES').to.equal(`Port ${port} requires elevated privileges`);
      return err;
    }
  }); */

  it('should not handle', async() => {
    let port = await getPort();
    let ser = new Server(smallApp, port, { gracefulClose: false });
    expect(() => ser._handler()).to.throw('Cannot read property \'address\' of null')
  })
});

describe('Accidental stop', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { silent: true, gracefulClose: false });

      it('should re-open fine', (done) => {
        ser.run()
          .then(srv => {
            ser.close();
            return ser.run()
          }, err => console.log('Running error:', err))
          .then(srv => {
            expect(typeof srv).to.equal('object')
          })
          .then(_ => ser.close())
          .catch(console.error)
          .then(_ => done())
      });

      it('should fail closing', async() => {
        try {
          await ser.close();
        } catch (err) {
          let isNode8l = getNodeVersion().major <= 8;
          expect(err.message).to.equal(isNode8l ? 'Not running' : 'Server is not running.');
        }
      })
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('Test error:', err)).
    then(done)
});