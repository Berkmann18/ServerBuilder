const Server = require('../index');
const expect = require('chai').expect,
  request = require('request');

describe('server response', () => {
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