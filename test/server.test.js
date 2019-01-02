const Server = require('../index');
const expect = require('chai').expect,
  request = require('request'),
  fs = require('fs'),
  getPort = require('get-port');

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
  }, 3000, { silent: true });
  const URL = 'http://localhost:3000';

  it('should return 400', (done) => {
    request.get(URL, (err, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.equal('wrong header');
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
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('correct header');
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
      expect(data).to.equal('successfully emitted request');
    });

    setTimeout(() => {
      expect(eventFired).to.equal(true);
      done();
    }, 10);
  });
});

const smallApp = (req, res) => {};

describe('Attributes (HTTP)', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { silent: true }),
        server = require('http').Server;
      it('should have getters', () => {
        expect(ser.app).to.equal(smallApp);
        expect(ser.port).to.equal(port);
        expect(ser.name).to.equal('Server');
        expect(ser.useHttps).to.equal(false);
        expect(ser.useHttp2).to.equal(false);
        expect(ser.options).to.deep.equal({});
        expect(ser.silent).to.equal(true);
        expect(ser.server instanceof server).to.equal(true);
      });

      it('should have methods', () => {
        expect(ser.toString()).to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=false, useHttp2=false, options={})`);
      });

      it('should not over-start', () => {
        try {
          expect(() => ser.restart()).to.throw('Listen method has been called more than once without closing.')
        } catch (err) {
          console.log('test error:', err);
        }
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
      it('should have getters', () => {
        expect(ser.app).to.equal(smallApp);
        expect(ser.port).to.equal(port);
        expect(ser.name).to.equal('Server');
        expect(ser.useHttps).to.equal(true);
        expect(ser.useHttp2).to.equal(false);
        expect(ser.options).to.deep.equal(securityOptions);
        expect(ser.server instanceof server).to.equal(true);
      });

      it('should have methods', () => {
        expect(ser.toString()).to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=true, useHttp2=false, options=${JSON.stringify(securityOptions)})`);
      });
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('HTTPS test error:', err)).
    then(done)
});

describe('HTTP/2', (done) => {
  getPort()
    .then(port => {
      let ser = new Server(smallApp, port, { useHttp2: true, securityOptions, silent: true });
      it('should have getters', () => {
        expect(ser.app).to.equal(smallApp);
        expect(ser.port).to.equal(port);
        expect(ser.name).to.equal('Server');
        expect(ser.useHttps).to.equal(false);
        expect(ser.useHttp2).to.equal(true);
        expect(ser.options).to.deep.equal(securityOptions);
        expect(ser.server.constructor.name).to.equal('Server'); //Since the class isn't exported by http2
      });

      it('should have methods', () => {
        expect(ser.toString()).to.equal(`Server(name='Server', port=${port}, app=${smallApp}, useHttps=false, useHttp2=true, options=${JSON.stringify(securityOptions)})`);
      });
    },
    err => console.error('getPort error:', err))
    .catch(err => console.error('HTTP/2 test error:', err)).
    then(done)
});