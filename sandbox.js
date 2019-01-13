const Server = require('./index');
const fs = require('fs');
const http = require('http');

/* app.js */
const express = require('./example/simple/node_modules/express'),
  logger = require('./example/simple/node_modules/morgan');
const bodyParser = require('./example/simple/node_modules/body-parser');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get('/', (req, res) => res.send('Hello from ServerBuilder!'));

//Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
/* end of app.js */

const smallApp = (req, res) => {};
const securityOptions = {
  key: fs.readFileSync('./example/secure/server-key.pem'),
  cert: fs.readFileSync('./example/secure/server-cert.pem')
};
let port = 5000;

// let se = new Server(smallApp, port, { silent: true, gracefulClose: false });
// let ser = new Server(smallApp, port, { silent: true, gracefulClose: true });
(async() => {
  try {
    let s = new Server(app, port);
    let ser = await s.run();
    // console.log('ser=', ser);
  } catch (err) {
    console.log('err=', err);
  }

})();
// let newApp = (req, res) => console.log('res=', res);
// ser.app = newApp;
// ser.port = 4890;
// ser.name = 'Lorem';
// ser.useHttps = true;
// ser.options = securityOptions;
// ser.silent = false;
// ser.useHttp2 = true;
// let serv = http.createServer(smallApp);
// console.log('address=', ser.address);
// console.log('\n\tChange\n');
// ser.server = serv;
// ser.restart();