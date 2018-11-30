/* eslint-env node, es6 */
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

const { info, error } = require('nclr');
const { use } = require('./src/utils');

/**
 * Normalize a port into a number, string, or false.
 * @param {(string|number)} val Port
 * @return {(string|number|boolean)} Port
 * @protected
 */
const normalizePort = (val) => {
  let port = parseInt(val, 10);
  if (isNaN(port)) return port; //Named pipe
  if (port >= 0) return port; //Port number
  return false;
};

/**
 * @description Default options for {@link Server.constructor}.
 * @type {{name: string, useHttps: boolean, securityOptions: Object, callback: function(Server), showPublicIP: boolean}}
 */
const DEFAULT_OPTS = {
  name: 'Server',
  useHttps: false,
  useHttp2: false,
  securityOptions: {},
  callback: () => {},
  showPublicIP: false
}

/**
 * @name getEnv
 * @description Get the environment name.
 * @param {function|Object} app Application
 * @protected
 */
const getEnv = (app) => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  return (typeof app.get === 'function') ? app.get('env') : 'development';
}

/**
 * @description Re-usable server.
 * @public
 */
class Server {
  /**
   * @description Create a NodeJS HTTP(s) server.
   * @param {express} associatedApp Associated express application
   * @param {(string|number)} [port=(process.env.PORT || 3e3)] Port/pipe to use
   * @param {{name: string, useHttps: boolean, useHttp2: boolean, securityOptions: object, callback: function(Server), showPublicIP: boolean}} [opts={name: 'Server', useHttps: false, securityOptions: {}, callback: (server) => {}, showPublicIP: false}]
   * Options including the server's name, HTTPS, options needed for the HTTPs server (public keys and certificates), callback called within the <code>listen</code> event and whether it should show its public
   * IP
   *
   * @example
   * const express = require('express');
   * let opts = {
   *   name: 'Custom Server',
   *   callback: () => console.log('READY');
   * }
   * let server = new Server(express(), 3002, opts);
   * @memberof Server
   */
  constructor(associatedApp, port = (process.env.PORT || 3e3), opts = DEFAULT_OPTS) {
    this._port = normalizePort(port);
    this._useHttp2 = opts.useHttp2 || DEFAULT_OPTS.useHttp2;
    this._useHttps = opts.useHttps || DEFAULT_OPTS.useHttps;
    this._app = associatedApp;
    this._options = opts.securityOptions || DEFAULT_OPTS.securityOptions;
    this._server = this._usesHttp2 ?
      require('http2').createSecureServer(this._options, this._app)
      : (this._useHttps ?
        require('https').createServer(this._options, this._app)
        : require('http').createServer(this._app));
    this._name = opts.name || DEFAULT_OPTS.name;
    this._server.on('error', Server.onError);

    this._handler = () => {
      const ipAddress = this._server.address();
      const protocol = (this._useHttps || this._useHttp2) ? 'https' : 'http';
      const location = typeof ipAddress === 'string' ?
        `pipe ${ipAddress}` :
        `${protocol}://${ipAddress.address === '::' ? 'localhost' : ipAddress.address}:${ipAddress.port}`;
      info(`${this._name} listening at ${use('inp', location)} (${getEnv(this._app)} environment)`);
      if ('callback' in opts) opts.callback(this);
    };
    this.restart();

    if (opts.showPublicIP) {
      require('external-ip')()((err, ip) => {
        if (err) error('Public IP error:', err);
        info(`Public IP: ${use('spec', ip)}`);
      });
    }

    process.on('SIGTERM', () => this.close());
    process.on('SIGINT', () => this.close());
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
    this._serverOptions = value;
  }

  /**
   * @description Get the server's instance.
   * @return {(http.Server|https.Server)} Server instance
   * @memberof Server
   * @public
   */
  get server() {
    return this._server;
  }

  /**
   * @description Change the server's instance.
   * @param {(http.Server|https.Server)} value new server instance
   * @memberof Server
   * @public
   */
  set server(value) {
    this._server = value;
  }

  /**
   * @description (Re)start the server.
   * @memberof Server
   * @public
   */
  restart() {
    this._server.listen(this._port, this._handler);
  }

  /**
   * @description Event listener for HTTP server "error" event.
   * @param {*} error Error to handle
   * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
   * @memberof Server
   * @public
   */
  static onError(error) {
    if (error.syscall !== 'listen') throw error;
    const port = this._port;
    const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

    //Handle specific listen errors with friendly messages
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

  /**
   * @description Gracefully close the server.
   * @returns {Promise} Closure promise
   * @memberof Server
   * @public
   */
  close() {
    let closing = new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) reject(err);
        info(`Closing the server ${use('out', this.name)}...`);
        resolve(this);
      });
    });
    return closing.then(server => {
      info(`${use('out', this.name)} is now closed.`);
      process.exit();
    }).catch(err => {
      error(`Server closure of ${use('out', this.name)} led to:`, err);
      process.exit();
    })
  }

  /**
   * @description Textual representation of a Server object.
   * @return {string} Server object in text
   * @memberof Server
   * @public
   */
  toString() {
    return `Server(name='${this.name}', port=${this.port}, app=${this.app}, useHttps=${this.useHttps}, useHttp2=${this.useHttp2}, options=${JSON.stringify(this.options)})`
  }
}

module.exports = Server;