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
};

const SEMANTIC_VERSION = /^v(\d+\.)?(\d+\.)?(\*|\d+)$/;

/**
 * @description Get the Node version.
 * @returns {{major: number, minor: number, patch: number}} Semantic version
 */
const getNodeVersion = () => {
  let [, major, minor, patch] = SEMANTIC_VERSION.exec(process.version);
  return {
    major: parseInt(major.slice(0, -1)),
    minor: parseInt(minor.slice(0, -1)),
    patch: parseInt(patch)
  }
};

module.exports = {
  use: clr.use,
  spec: clr.spec,
  getPublicIP,
  getNodeVersion
};