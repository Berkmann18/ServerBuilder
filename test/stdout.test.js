const stdout = require('test-console').stdout,
  expect = require('chai').expect;
const Server = require('../index');

/**
 * Creates an application for a given server.
 * @param {Server} server Server
 */
const makeApp = (server) => {
  return (req, res) => {
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
}

describe('Initial output', () => {
  let server;

  it('should print nothing straight away', () => {
    const output = stdout.inspectSync(() => server = new Server((req, res) => {}));
    expect(output).to.deep.equal([]);
  });

  it('should print something later', () => {
    const inspect = stdout.inspect();
    let port = 3e3;
    let options = {
      callback(server) {
        inspect.restore();
        expect(server instanceof Server).to.be.true;
        expect(inspect.output.length).to.equal(2);
        expect(inspect.output[1]).to.deep.equal(`\u001b[32mServer listening at \u001b[37mhttp://localhost:${port}\u001b[32m (development environment)\u001b[39m\n`);
      }
    };
    server = new Server((req, res) => {}, 3e3, options);
  });
  
  it('should print something', () => {
    const inspect = stdout.inspect();
    let port = 3e3;
    let options = {
      name: 'Test Server',
      callback(server) {
        inspect.restore();
        //output[0] is the "should print something"
        expect(inspect.output.length).to.equal(2);
        expect(inspect.output[1]).to.deep.equal(`\u001b[32mTest Server listening at \u001b[37mhttp://localhost:${port}\u001b[32m (development environment)\u001b[39m\n`);
      },
    }
    server = new Server(makeApp(server), port, options);

  });

  it('should signal its end', (done) => {
    const inspect = stdout.inspect();
    let port = 3e3;
    let options = {
      callback(server) {
        inspect.restore();
        expect(inspect.output.length).to.equal(2);
        expect(inspect.output[1]).to.deep.equal(`\u001b[32mServer listening at \u001b[37mhttp://localhost:${port}\u001b[32m (development environment)\u001b[39m\n`);
      },
    }
    server = new Server(makeApp(server), port, options);
    server.close()
      .then(closed => expect(closed).to.equal(true) && done())
      .catch(err => console.log('Closing error:', err));
  });

});