/* eslint-env node */
/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */

const clr = require('nclr'),
  { promisify } = require('util');
const eip = promisify(require('external-ip')());

clr.extend({
  spec: 'magenta'
});

/**
 * @description Get the public IP of the host.
 * @returns {string|Error} IP or an error
 */
const getPublicIP = async() => {
  try {
    let ip = await eip();
    return ip
  } catch (err) {
    /* istanbul ignore next */
    return err;
  }
}

module.exports = {
  use: clr.use,
  spec: clr.spec,
  getPublicIP
};