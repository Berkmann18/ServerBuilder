"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
const _require = require('nclr'),
      info = _require.info,
      error = _require.error;

const _require2 = require('./src/utils'),
      use = _require2.use,
      getPublicIP = _require2.getPublicIP,
      getNodeVersion = _require2.getNodeVersion;

const http2 = require(getNodeVersion().major < 8 ? 'node-http2' : 'http2');
/**
 * Normalize a port into a number, string, or false.
 * @param {(string|number)} val Port
 * @return {(string|number|boolean)} Port
 * @protected
 */


const normalizePort = val => {
  let port = parseInt(val, 10);
  /* @todo test if val | 0 is better*/

  if (isNaN(port)) return port; //Named pipe

  if (port >= 0) return port; //Port number

  return false;
};
/**
 * @description Default options for {@link Server.constructor}.
 * @type {{name: string, useHttps: boolean, securityOptions: Object, callback: function(Server), showPublicIP: boolean, silent: boolean, gracefulClose: boolean, autoRun: boolean}}
 */


const DEFAULT_OPTS = {
  name: 'Server',
  useHttps: false,
  useHttp2: false,
  securityOptions: {},
  callback: () => {},
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

const getEnv = app => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  return typeof app.get === 'function' ? app.get('env') : 'development';
};
/**
 * @description Create a server.
 * @param {Server} instance Server instance
 * @returns {(http.Server|https.Server|http2.Server)} HTTP* server
 */


const createServer = instance => {
  if (instance._useHttp2) return http2.createSecureServer(instance._options, instance._app);
  return instance._useHttps ? require('https').createServer(instance._options, instance._app) : require('http').createServer(instance._app);
};
/**
 * @description Re-usable server.
 * @public
 */


class Server {
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
  constructor(associatedApp, port = process.env.PORT || 3e3, opts = DEFAULT_OPTS) {
    this._port = normalizePort(port);
    if (this._port === NaN || !this._port) throw new Error(`Port should be >= 0 and < 65536. Received ${this._port}`);
    this._useHttp2 = opts.useHttp2 || DEFAULT_OPTS.useHttp2;
    this._useHttps = opts.useHttps || DEFAULT_OPTS.useHttps;
    this._app = associatedApp;
    this._options = opts.securityOptions || DEFAULT_OPTS.securityOptions;
    this._silent = opts.silent || DEFAULT_OPTS.silent;
    this._server = createServer(this);
    this._name = opts.name || DEFAULT_OPTS.name;

    this._server.on('error', this.onError(this));

    this._showPublicIP = opts.showPublicIP || DEFAULT_OPTS.showPublicIP;

    this._handler = () => {
      if (!this._silent) {
        try {
          info(`${this._name} listening at ${use('inp', this.address)} (${getEnv(this._app)} environment)`);
        } catch (err) {
          throw new Error(err.message);
        }
      }

      if ('callback' in opts) opts.callback(this);
    };

    opts.gracefulClose && process.on('SIGTERM', () => this.close()) && process.on('SIGINT', () => this.close()); //https://stackoverflow.com/questions/4328540/how-to-catch-http-client-request-exceptions-in-node-js
    // process.on('uncaughtException', (err) => console.log('Uncaught error:', err));

    if (opts.autoRun) return this.run();
  }
  /**
   * @description Get the associated application (Express instance).
   * @return {express} Associated Express instance
   * @memberof Server
   * @public
   */


  get app() {
    return this._app;
  }
  /**
   * @description Set the Express application associated to the router.
   * @param {express} value Express app
   * @memberof Server
   * @public
   */


  set app(value) {
    this._app = value;
  }
  /**
   * @description Get the port/pipe of used by the server.
   * @return {(number|string)} Port/pipes
   * @memberof Server
   * @public
   */


  get port() {
    return this._port;
  }
  /**
   * @description Change the port/pipe of the server <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {(number|string)} value New port/pipe
   * @memberof Server
   * @public
   */


  set port(value) {
    this._port = value;
  }
  /**
   * @description Get the server's name.
   * @return {string} Name
   * @memberof Server
   * @public
   */


  get name() {
    return this._name;
  }
  /**
   * @description Change the server's name.
   * @param {string} value New name
   * @memberof Server
   * @public
   */


  set name(value) {
    this._name = value;
  }
  /**
   * @description See if whether or not the server is using HTTPS.
   * @return {boolean} S flag
   * @memberof Server
   * @public
   */


  get useHttps() {
    return this._useHttps;
  }
  /**
   * @description Changes the HTTP<strong>S</strong> flag <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {boolean} value New flag
   * @memberof Server
   * @public
   */


  set useHttps(value) {
    this._useHttps = value;
  }
  /**
   * @description See if whether or not the server is using HTTP/2.
   * @return {boolean} Version 2 flag
   * @memberof Server
   * @public
   */


  get useHttp2() {
    return this._useHttp2;
  }
  /**
   * @description Changes the HTTP version flag <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {boolean} value New flag
   * @memberof Server
   * @public
   */


  set useHttp2(value) {
    this._useHttp2 = value;
  }
  /**
   * @description Get the server options (that is the ones used for the HTTPS and HTTP/2 mode).
   * @return {Object} Options
   * @memberof Server
   * @public
   */


  get options() {
    return this._options;
  }
  /**
   * @description Change the server options <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {Object} value New options
   * @memberof Server
   * @public
   */


  set options(value) {
    this._options = value;
  }
  /**
   * @description Get the server's instance.
   * @return {(http.Server|https.Server|http2.Server)} Server instance
   * @memberof Server
   * @public
   */


  get server() {
    return this._server;
  }
  /**
   * @description Change the server's instance.<br>
   * <em>However it's recommended to restart the server otherwise the event handlers won't work properly.
   * @param {(http.Server|https.Server|http2.Server)} value New server instance
   * @memberof Server
   * @public
   */


  set server(value) {
    this._server = value;
  }
  /**
   * @description Get the silent flag.
   * @return {boolean} Server's silence
   * @memberof Server
   * @public
   */


  get silent() {
    return this._silent;
  }
  /**
   * @description Change the server' silence.
   * @param {boolean} value New silence mode
   * @memberof Server
   * @public
   */


  set silent(value) {
    this._silent = value;
  }
  /**
   * @description Get the HTTP protocol.
   * @returns {string} Protocol
   */


  get protocol() {
    return this._useHttps || this._useHttp2 ? 'https' : 'http';
  }
  /**
   * @description Get the server's address.
   * @returns {string} Address
   */


  get address() {
    const ipAddress = this._server.address();

    const location = typeof ipAddress === 'string' ? `pipe ${ipAddress}` : `${this.protocol}://${ipAddress.address === '::' ? 'localhost' : ipAddress.address}:${ipAddress.port}`;
    return location;
  }
  /**
   * @description Run/start the server.
   * @memberof Server
   * @public
   * @async
   */


  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        let server = yield _this._server.listen(_this._port, _this._handler);

        if (_this._showPublicIP) {
          let ip = yield getPublicIP();
          info(`Public IP: ${use('spec', ip)}`);
        }

        return server;
      } catch (err) {
        throw err;
      }
    })();
  }
  /**
   * @description Event listener for HTTP server "error" event.
   * @param {*} error Error to handle
   * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
   * @memberof Server
   * @public
   * @throws {Error} EACCES/EADDRINUSE/ENOENT/...
   */


  onError(instance) {
    return error => {
      /* @this instance */
      if (error.syscall !== 'listen') throw error;
      const port = instance.port;
      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`; //Handle specific listen errors with friendly messages

      switch (error.code) {
        case 'EACCES':
          throw new Error(`${bind} requires elevated privileges`);

        case 'EADDRINUSE':
          throw new Error(`${bind} is already in use`);

        case 'ENOENT':
          throw new Error(`Nonexistent entry requested at ${bind}`);

        default:
          throw error;
      }
    };
  }

  /**
   * @description Gracefully close the server.
   * @returns {Promise} Closure promise
   * @memberof Server
   * @public
   * @async
   */
  close() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let closing = new Promise((resolve, reject) => {
        _this2._server.close(err => {
          if (err) reject(err);
          if (!_this2._silent) info(`Closing the server ${use('out', _this2.name)}...`);
          resolve(true);
        });
      });

      try {
        let closed = yield closing;
        if (!_this2._silent) info(`${use('out', _this2.name)} is now closed.`);
        return closed;
      } catch (err) {
        error(`Server closure of ${use('out', _this2.name)} led to:`, err);
        return err;
      }
    })();
  }
  /**
   * @description Textual representation of a Server object.
   * @return {string} Server object in text
   * @memberof Server
   * @public
   */


  toString() {
    return `Server(name='${this.name}', port=${this.port}, app=${this.app}, useHttps=${this.useHttps}, useHttp2=${this.useHttp2}, options=${JSON.stringify(this.options)})`;
  }

}

module.exports = Server;