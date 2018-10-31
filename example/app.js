/* eslint-env node, es6 */
const express = require('./simple/node_modules/express'),
  logger = require('./simple/node_modules/morgan');
const cookieParser = require('./simple/node_modules/cookie-parser'),
  bodyParser = require('./simple/node_modules/body-parser');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

module.exports = app;
