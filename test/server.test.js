const Server = require('../index');
const expect = require('chai').expect,
  request = require('request'),
  fs = require('fs');

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
  });
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

describe('Attributes (HTTP)', () => {
  let ser = new Server(smallApp), server = require('http').Server;
  it('should have getters', () => {
    expect(ser.app).to.equal(smallApp);
    expect(ser.port).to.equal(3e3);
    expect(ser.name).to.equal('Server');
    expect(ser.useHttps).to.equal(false);
    expect(ser.useHttp2).to.equal(false);
    expect(ser.options).to.deep.equal({});
    expect(ser.server instanceof server).to.equal(true);
  });

  it('should have methods', () => {
    expect(ser.toString()).to.equal(`Server(name='Server', port=3000, app=${smallApp}, useHttps=false, useHttp2=false, options={})`);
  });

  it('should not over-start', () => {
    expect(() => ser.restart()).to.throw('Listen method has been called more than once without closing.')
  });
});

const securityOptions = {
  key: fs.readFileSync('./example/secure/server-key.pem'),
  cert: fs.readFileSync('./example/secure/server-cert.pem')
};

describe('HTTPS', () => {
  let ser = new Server(smallApp, 3e3, { useHttps: true, securityOptions }), server = require('https').Server;
  it('should have getters', () => {
    expect(ser.app).to.equal(smallApp);
    expect(ser.port).to.equal(3e3);
    expect(ser.name).to.equal('Server');
    expect(ser.useHttps).to.equal(true);
    expect(ser.useHttp2).to.equal(false);
    expect(ser.options).to.deep.equal(securityOptions);
    expect(ser.server instanceof server).to.equal(true);
  });

  it('should have methods', () => {
    expect(ser.toString()).to.equal(`Server(name='Server', port=3000, app=${smallApp}, useHttps=true, useHttp2=false, options=${JSON.stringify(securityOptions)})`);
  });
});


describe('HTTP/2', () => {
  let ser = new Server(smallApp, 3e3, { useHttp2: true, securityOptions });
  it('should have getters', () => {
    expect(ser.app).to.equal(smallApp);
    expect(ser.port).to.equal(3e3);
    expect(ser.name).to.equal('Server');
    expect(ser.useHttps).to.equal(false);
    expect(ser.useHttp2).to.equal(true);
    expect(ser.options).to.deep.equal(securityOptions);
    expect(ser.server.constructor.name).to.equal('Server'); //Since the class isn't exported by http2
  });

  it('should have methods', () => {
    expect(ser.toString()).to.equal(`Server(name='Server', port=3000, app=${smallApp}, useHttps=false, useHttp2=true, options=${JSON.stringify(securityOptions)})`);
  });
});