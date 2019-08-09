/* eslint-disable node/no-unpublished-require */
const stdout = require('test-console').stdout,
  expect = require('chai').expect;
/* eslint-enable node/no-unpublished-require */
const Server = require('../dist/index');
  // { getPublicIP } = require('../dist/utils');

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

const smallApp = (req, res) => {};

describe('Initial output', () => {
  let server;

  it('should print nothing straight away', () => {
    const output = stdout.inspectSync(() => { server = new Server(smallApp, 3001, { silent: true }) });
    expect(output).to.deep.equal([]);
  });

  it('should print something later', () => {
    const inspect = stdout.inspect();
    let options = {
      gracefulClose: false,
      callback(server) {
        inspect.restore();
        expect(server instanceof Server).to.be.true;
        expect(inspect.output.length).to.equal(2);
        expect(inspect.output[1]).to.deep.equal(`\u001b[36mServer listening at \u001b[37mhttp://localhost:${server.port}\u001b[36m (development environment)\u001b[39m\n`);
      }
    };
    server = new Server(smallApp, 4000, options);
    server.run()
      .then(srv => {})
      .catch(console.error);
  });

  it('should print something', () => {
    const inspect = stdout.inspect();
    let options = {
      name: 'Test Server',
      gracefulClose: false,
      callback(server) {
        inspect.restore();
        //output[0] is the 'should print something'
        expect(inspect.output.length).to.equal(2);
        expect(inspect.output[1]).to.deep.equal(`\u001b[36mTest Server listening at \u001b[37mhttp://localhost:${server.port}\u001b[36m (development environment)\u001b[39m\n`);
      },
    }
    server = new Server(makeApp(server), 4001, options);
    server.run()
      .then(srv => {})
      .catch(console.error);
  });

  it('should signal its end', (done) => {
    const inspect = stdout.inspect();
    let options = {
      callback(server) {
        inspect.restore();
        expect(inspect.output.length).to.equal(1);
        expect(inspect.output[0]).to.equal(`\u001b[36mServer listening at \u001b[37mhttp://localhost:${server.port}\u001b[36m (development environment)\u001b[39m\n`);
      },
    }
    server = new Server(makeApp(server), 4002, options);
    server.run()
      .then(srv => server.close(), err => console.log('Running error:', err))
      .then(closed => expect(closed).to.equal(true) && done())
      .catch(err => console.log('Closing error:', err));
  });
});

describe('Setting', function() {
  it('should show its public IP', (done) => {
    let port = 4568;
    let options = {
      silent: true,
      showPublicIP: true,
      gracefulClose: false
    };
    let server = new Server(smallApp, port, options);
    const inspect = stdout.inspect();
    (async() => {
      try {
        await server.run();
        inspect.restore();
        console.log('out=', inspect.output);
        expect(inspect.output[inspect.output.length - 1]).to.include('Public IP: ');
        done();
      } catch (err) {
        console.error('Setting error=', err)
      }
    })();
  });
});