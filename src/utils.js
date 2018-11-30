/* eslint-env node, es6 */
/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */

const clr = require('nclr');

clr.extend({
  spec: 'magenta'
});

module.exports = {
  use: clr.use,
  spec: clr.spec
};