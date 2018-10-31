/* eslint-env node, es6 */
/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */

const path = require('path'), clr = require('colors');

/**
 * @description Colour scheme for the CLI
 * @type {{in: string, out: string, inf: string, err: string, warn: string, debug: string, spec: string}}
 * @protected
 */
const clrScheme = {
  in: 'white',
  out: 'cyan', //nclr use the bold one
  inf: 'green',
  err: 'red',
  warn: 'yellow',
  debug: 'grey',
  spec: 'magenta' //nclr doesn't have that
};

/**
 * @description Set a colour scheme for the CLI.
 * @protected
 */
const setColours = () => clr.setTheme(clrScheme);
setColours();

/**
 * @description Colourise something.
 * @param {string} name Name of the colour in the theme
 * @param {...*} data Data
 * @return {*} Coloured output
 * @protected
 */
const colour = (name, ...data) => {
  switch (name) {
  case 'in':
    return clr.in(...data);
  case 'out':
    return clr.out(...data);
  case 'inf':
    return clr.inf(...data);
  case 'err':
    return clr.err(...data);
  case 'warn':
    return clr.warn(...data);
  case 'debug':
    return clr.debug(...data);
  case 'spec':
    return clr.spec(...data);
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
const load = (res, page='index') => res.sendFile(path.join(`${__dirname}/${page}.html`));

/**
 * @description Get the Incoming IP address.
 * @param {Object} req HTTP request
 * @return {?string} IP Address
 * @protected
 */
const incomingIp = (req) => {
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
 * @protected
 */
const view = (res, file='index') => {
  res.sendFile(`${__dirname}/${file}.html`);
};

module.exports = {
  setColours, load, incomingIp, clrScheme, colour, view
};