"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-env node */

/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */
const clr = require('nclr'),
      _require = require('util'),
      promisify = _require.promisify;

const eip = promisify(require('external-ip')());
clr.extend({
  spec: 'magenta'
});
/**
 * @description Get the public IP of the host.
 * @returns {string|Error} IP or an error
 */

const getPublicIP =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    try {
      let ip = yield eip();
      return ip;
    } catch (err) {
      return err;
    }
  });

  return function getPublicIP() {
    return _ref.apply(this, arguments);
  };
}();

const SEMANTIC_VERSION = /^v(\d+\.)?(\d+\.)?(\*|\d+)$/;
/**
 * @description Get the Node version.
 * @returns {{major: number, minor: number, patch: number}} Semantic version
 */

const getNodeVersion = () => {
  let _SEMANTIC_VERSION$exe = SEMANTIC_VERSION.exec(process.version),
      _SEMANTIC_VERSION$exe2 = _slicedToArray(_SEMANTIC_VERSION$exe, 4),
      major = _SEMANTIC_VERSION$exe2[1],
      minor = _SEMANTIC_VERSION$exe2[2],
      patch = _SEMANTIC_VERSION$exe2[3];

  return {
    major: parseInt(major.slice(0, -1)),
    minor: parseInt(minor.slice(0, -1)),
    patch: parseInt(patch)
  };
};

module.exports = {
  use: clr.use,
  spec: clr.spec,
  getPublicIP,
  getNodeVersion
};