"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-env node */

/**
 * @description Server builder.
 * @module
 * @requires http
 * @requires https
 * @requires colors
 * @requires external-ip
 * @requires ./utils
 * @exports Server
 */
var _require = require('nclr'),
    info = _require.info,
    error = _require.error;

var _require2 = require('./src/utils'),
    use = _require2.use,
    getPublicIP = _require2.getPublicIP;
/**
 * Normalize a port into a number, string, or false.
 * @param {(string|number)} val Port
 * @return {(string|number|boolean)} Port
 * @protected
 */


var normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);
  /* @todo test if val | 0 is better*/

  if (isNaN(port)) return port; //Named pipe

  if (port >= 0) return port; //Port number

  return false;
};
/**
 * @description Default options for {@link Server.constructor}.
 * @type {{name: string, useHttps: boolean, securityOptions: Object, callback: function(Server), showPublicIP: boolean, silent: boolean, gracefulClose: boolean, autoRun: boolean}}
 */


var DEFAULT_OPTS = {
  name: 'Server',
  useHttps: false,
  useHttp2: false,
  securityOptions: {},
  callback: function callback() {},
  showPublicIP: false,
  silent: false,
  gracefulClose: true,
  autoRun: false
};
/**
 * @name getEnv
 * @description Get the environment name.
 * @param {function|Object} app Application
 * @protected
 */

var getEnv = function getEnv(app) {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  return typeof app.get === 'function' ? app.get('env') : 'development';
};
/**
 * @description Create a server.
 * @param {Server} instance Server instance
 * @returns {(http.Server|https.Server|http2.Server)} HTTP* server
 */


var createServer = function createServer(instance) {
  if (instance._useHttp2) return require('http2').createSecureServer(instance._options, instance._app);
  return instance._useHttps ? require('https').createServer(instance._options, instance._app) : require('http').createServer(instance._app);
};
/**
 * @description Re-usable server.
 * @public
 */


var Server =
/*#__PURE__*/
function () {
  /**
   * @description Create a NodeJS HTTP(s) server.
   * @param {express} associatedApp Associated express application
   * @param {(string|number)} [port=(process.env.PORT || 3e3)] Port/pipe to use
   * @param {{name: string, useHttps: boolean, useHttp2: boolean, securityOptions: object, callback: function(Server), showPublicIP: boolean, silent: boolean, gracefulClose: boolean, autoRun: boolean}} [opts={name: 'Server', useHttps: false, securityOptions: {}, callback: (server) => {}, showPublicIP: false, silent: false, gracefulClose: true, autoRun: false}]
   * Options including the server's name, HTTPS, options needed for the HTTPs server (public keys and certificates), callback called within the <code>listen</code> event and whether it should show its public
   * IP and whether it needs to be silent (<em>which won't affect the public IP log</em>) and if it should run automatically upon being instantiated.
   *
   *
   * @example
   * const express = require('express');
   * let opts = {
   *   name: 'Custom Server',
   *   callback: () => console.log('READY');
   * }
   * let server = new Server(express(), 3002, opts);
   * @memberof Server
   * @throws {Error} Invalid port
   * @returns {undefined|Promise} Nothing or the promise returned by <code>run</code>
   */
  function Server(associatedApp) {
    var _this = this;

    var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.PORT || 3e3;
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTS;

    _classCallCheck(this, Server);

    this._port = normalizePort(port);
    if (this._port === NaN || !this._port) throw new Error("Port should be >= 0 and < 65536. Received ".concat(this._port));
    this._useHttp2 = opts.useHttp2 || DEFAULT_OPTS.useHttp2;
    this._useHttps = opts.useHttps || DEFAULT_OPTS.useHttps;
    this._app = associatedApp;
    this._options = opts.securityOptions || DEFAULT_OPTS.securityOptions;
    this._silent = opts.silent || DEFAULT_OPTS.silent;
    this._server = createServer(this);
    this._name = opts.name || DEFAULT_OPTS.name;

    this._server.on('error', this.onError(this));

    this._showPublicIP = opts.showPublicIP || DEFAULT_OPTS.showPublicIP;

    this._handler = function () {
      if (!_this._silent) {
        try {
          info("".concat(_this._name, " listening at ").concat(use('inp', _this.address), " (").concat(getEnv(_this._app), " environment)"));
        } catch (err) {
          throw new Error(err.message);
        }
      }

      if ('callback' in opts) opts.callback(_this);
    };

    opts.gracefulClose && process.on('SIGTERM', function () {
      return _this.close();
    }) && process.on('SIGINT', function () {
      return _this.close();
    }); //https://stackoverflow.com/questions/4328540/how-to-catch-http-client-request-exceptions-in-node-js
    // process.on('uncaughtException', (err) => console.log('Uncaught error:', err));

    if (opts.autoRun) return this.run();
  }
  /**
   * @description Get the associated application (Express instance).
   * @return {express} Associated Express instance
   * @memberof Server
   * @public
   */


  _createClass(Server, [{
    key: "run",

    /**
     * @description Run/start the server.
     * @memberof Server
     * @public
     * @async
     */
    value: function () {
      var _run = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var server, ip;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._server.listen(this._port, this._handler);

              case 3:
                server = _context.sent;

                if (!this._showPublicIP) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return getPublicIP();

              case 7:
                ip = _context.sent;
                info("Public IP: ".concat(use('spec', ip)));

              case 9:
                return _context.abrupt("return", server);

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 12]]);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
    /**
     * @description Event listener for HTTP server "error" event.
     * @param {*} error Error to handle
     * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
     * @memberof Server
     * @public
     * @throws {Error} EACCES/EADDRINUSE/ENOENT/...
     */

  }, {
    key: "onError",
    value: function onError(instance) {
      return function (error) {
        /* @this instance */
        if (error.syscall !== 'listen') throw error;
        var port = instance.port;
        var bind = typeof port === 'string' ? "Pipe ".concat(port) : "Port ".concat(port); //Handle specific listen errors with friendly messages

        switch (error.code) {
          case 'EACCES':
            throw new Error("".concat(bind, " requires elevated privileges"));

          case 'EADDRINUSE':
            throw new Error("".concat(bind, " is already in use"));

          case 'ENOENT':
            throw new Error("Nonexistent entry requested at ".concat(bind));

          default:
            throw error;
        }
      };
    }
  }, {
    key: "close",

    /**
     * @description Gracefully close the server.
     * @returns {Promise} Closure promise
     * @memberof Server
     * @public
     * @async
     */
    value: function () {
      var _close = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var closing, closed;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                closing = new Promise(function (resolve, reject) {
                  _this2._server.close(function (err) {
                    if (err) reject(err);
                    if (!_this2._silent) info("Closing the server ".concat(use('out', _this2.name), "..."));
                    resolve(true);
                  });
                });
                _context2.prev = 1;
                _context2.next = 4;
                return closing;

              case 4:
                closed = _context2.sent;
                if (!this._silent) info("".concat(use('out', this.name), " is now closed."));
                return _context2.abrupt("return", closed);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                error("Server closure of ".concat(use('out', this.name), " led to:"), _context2.t0);
                return _context2.abrupt("return", _context2.t0);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
    /**
     * @description Textual representation of a Server object.
     * @return {string} Server object in text
     * @memberof Server
     * @public
     */

  }, {
    key: "toString",
    value: function toString() {
      return "Server(name='".concat(this.name, "', port=").concat(this.port, ", app=").concat(this.app, ", useHttps=").concat(this.useHttps, ", useHttp2=").concat(this.useHttp2, ", options=").concat(JSON.stringify(this.options), ")");
    }
  }, {
    key: "app",
    get: function get() {
      return this._app;
    }
    /**
     * @description Set the Express application associated to the router.
     * @param {express} value Express app
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._app = value;
    }
    /**
     * @description Get the port/pipe of used by the server.
     * @return {(number|string)} Port/pipes
     * @memberof Server
     * @public
     */

  }, {
    key: "port",
    get: function get() {
      return this._port;
    }
    /**
     * @description Change the port/pipe of the server <strong>without affecting the server instance</strong>.<br>
     * <em style="color: red">Use this method at your own risk!</em>
     * @param {(number|string)} value New port/pipe
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._port = value;
    }
    /**
     * @description Get the server's name.
     * @return {string} Name
     * @memberof Server
     * @public
     */

  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
    /**
     * @description Change the server's name.
     * @param {string} value New name
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._name = value;
    }
    /**
     * @description See if whether or not the server is using HTTPS.
     * @return {boolean} S flag
     * @memberof Server
     * @public
     */

  }, {
    key: "useHttps",
    get: function get() {
      return this._useHttps;
    }
    /**
     * @description Changes the HTTP<strong>S</strong> flag <strong>without affecting the server instance</strong>.<br>
     * <em style="color: red">Use this method at your own risk!</em>
     * @param {boolean} value New flag
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._useHttps = value;
    }
    /**
     * @description See if whether or not the server is using HTTP/2.
     * @return {boolean} Version 2 flag
     * @memberof Server
     * @public
     */

  }, {
    key: "useHttp2",
    get: function get() {
      return this._useHttp2;
    }
    /**
     * @description Changes the HTTP version flag <strong>without affecting the server instance</strong>.<br>
     * <em style="color: red">Use this method at your own risk!</em>
     * @param {boolean} value New flag
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._useHttp2 = value;
    }
    /**
     * @description Get the server options (that is the ones used for the HTTPS and HTTP/2 mode).
     * @return {Object} Options
     * @memberof Server
     * @public
     */

  }, {
    key: "options",
    get: function get() {
      return this._options;
    }
    /**
     * @description Change the server options <strong>without affecting the server instance</strong>.<br>
     * <em style="color: red">Use this method at your own risk!</em>
     * @param {Object} value New options
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._options = value;
    }
    /**
     * @description Get the server's instance.
     * @return {(http.Server|https.Server|http2.Server)} Server instance
     * @memberof Server
     * @public
     */

  }, {
    key: "server",
    get: function get() {
      return this._server;
    }
    /**
     * @description Change the server's instance.<br>
     * <em>However it's recommended to restart the server otherwise the event handlers won't work properly.
     * @param {(http.Server|https.Server|http2.Server)} value New server instance
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._server = value;
    }
    /**
     * @description Get the silent flag.
     * @return {boolean} Server's silence
     * @memberof Server
     * @public
     */

  }, {
    key: "silent",
    get: function get() {
      return this._silent;
    }
    /**
     * @description Change the server' silence.
     * @param {boolean} value New silence mode
     * @memberof Server
     * @public
     */
    ,
    set: function set(value) {
      this._silent = value;
    }
    /**
     * @description Get the HTTP protocol.
     * @returns {string} Protocol
     */

  }, {
    key: "protocol",
    get: function get() {
      return this._useHttps || this._useHttp2 ? 'https' : 'http';
    }
    /**
     * @description Get the server's address.
     * @returns {string} Address
     */

  }, {
    key: "address",
    get: function get() {
      var ipAddress = this._server.address();

      var location = typeof ipAddress === 'string' ? "pipe ".concat(ipAddress) : "".concat(this.protocol, "://").concat(ipAddress.address === '::' ? 'localhost' : ipAddress.address, ":").concat(ipAddress.port);
      return location;
    }
  }]);

  return Server;
}();

module.exports = Server;