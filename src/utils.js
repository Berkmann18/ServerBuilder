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

clr.setTheme(clrScheme);

/**
 * @description Colourise something.
 * @param {string} name Name of the colour in the theme
 * @param {...*} data Data
 * @return {*} Coloured output
 * @protected
 */
const colour = (name, ...data) => {
  if (['in', 'out', 'inf', 'err', 'warn', 'debug', 'spec'].includes(name)) return clr[name](...data);
  else throw new Error(`The name ${name} isn't specified in the theme used`);
};

module.exports = {
  clrScheme, colour
};