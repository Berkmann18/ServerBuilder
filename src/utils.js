/* eslint-env node, es6 */
/**
 * @description Utility module for this package.
 * @module com/utils
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */

const path = require('path'), clr = require('colors');

const clrScheme = {
  in: 'white',
  out: 'cyan',
  inf: 'green',
  err: 'red',
  warn: 'yellow',
  debug: 'grey',
  spec: 'magenta'
};

/**
 * @description Print an error.
 * @param {...*} data Data to print
 * @private
 */
let error = (...data) => console.error(clr.err(...data));

/**
 * @description Print an information.
 * @param {...*} data Data to print
 * @private
 */
let info = (...data) => {
  try {
    console.info(clr.inf(...data));
  } catch (err) {
    console.log(clr.inf(...data));
  }
};

/**
 * @description Print a  warning.
 * @param {...*} data Data to print
 * @private
 */
let warn = (...data) => {
  try {
    console.warn(clr.warn(...data));
  } catch (err) {
    console.log(clr.warn(...data));
  }
};

/**
 * @description Print a debug message.
 * @param {...*} data Data to print
 * @private
 */
let dbg = (...data) => {
  try {
    console.debug(clr.debug(...data));
  } catch (err) {
    console.log(clr.debug(...data));
  }
};

/**
 * @description Print an output.
 * @param {...*} data Data to print
 * @private
 */
let out = (...data) => console.log(clr.out(...data));
/**
 * @description Print an input.
 * @param {...*} data Data to print
 * @private
 */
let inp = (...data) => console.log(clr.in(...data));

/**
 * @description Set a colour scheme for the CLI.
 * @protected
 */
let setColours = () => clr.setTheme(clrScheme);

/**
 * @description Colourise something.
 * @param {string} name Name of the colour in the theme
 * @param {...*} data Data
 * @return {*} Coloured output
 */
let colour = (name, ...data) => {
  switch (name) {
  case 'in':
    return clr.in(...data);
    break;
  case 'out':
    return clr.out(...data);
    break;
  case 'inf':
    return clr.inf(...data);
    break;
  case 'err':
    return clr.err(...data);
    break;
  case 'warn':
    return clr.warn(...data);
    break;
  case 'debug':
    return clr.debug(...data);
    break;
  case 'spec':
    return clr.spec(...data);
    break;
  default:
    return error(`The name ${name} isn't specified in the theme used`);
  }
};

/**
 * @description Load an HTML page.
 * @param {Object} res ExpressJS result
 * @param {string} [page='index'] Page name
 * @protected
 */
let load = (res, page='index') => res.sendFile(path.join(`${__dirname}/${page}.html`));

/**
 * @description Get the Incoming IP address.
 * @param {Object} req HTTP request
 * @return {?string} IP Address
 * @protected
 */
let incomingIp = (req) => {
  if ('x-forwarded-for' in req.headers) return req.headers['x-forwarded-for'].split(',').pop();
  try {
    return req.connection.remoteAddress;
  } catch (err) {}
  try {
    return req.ip;
  } catch (err) {}
  try {
    return req.socket.remoteAddress;
  } catch (err) {}
  try {
    return req.connection.socket.remoteAddress;
  } catch (err) {}
  return null; //Should never reach that
};

/**
 * @description Renders an HTML page.
 * @param {Object} res Resulting Express view module
 * @param {string} [file='index'] Filename of the HTML page to render.
 */
let view = (res, file='index') => {
  res.sendFile(`${__dirname}/${file}.html`);
};

module.exports = {
  error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view
};