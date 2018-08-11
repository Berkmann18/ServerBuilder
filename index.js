/* eslint-env node, es6 */
/**
 * @description Server builder.
 * @module serverBuilder
 * @requires http
 * @requires https
 * @requires colors
 * @requires external-ip
 * @requires ./utils
 * @exports Server
 */

const { setColours, info, error, colour } = require('./src/utils');

setColours();

/**
 * Normalize a port into a number, string, or false.
 * @param {(string|number)} val Port
 * @return {(string|number|boolean)} Port
 */
const normalizePort = (val) => {
  let port = parseInt(val);
  if (isNaN(port)) return port; //Named pipe
  if (port >= 0) return port; //Port number
  return false;
};

const DEFAULT_OPTS = {
  name: 'Server',
  useHttps: false,
  securityOptions: {},
  callback: () => {},
  showPublicIP: false
}

/**
 * @description Get the environment name.
 * @param {function|object} app Application
 */
const getEnv = (app) => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  return (typeof app.get === 'function') ? app.get('env') : 'development';
}

/**
 * @description Re-usable server.
 * @property {express} Server._app Associated Express application
 * @property {(number|string)} Server._port Port/pipe of the server
 * @property {boolean} Server._usesHttps Security flag concerning HTTP(S)
 * @property {object} Server._options Security options for the server (public keys and certificates)
 * @property {(http.Server|https.Server)} Server._server HTTP(S) Server instance
 * @property {string} Server._name Name of the server
 */
class Server {
  /**
   * @description Create a NodeJS HTTP(s) server.
   * @param {express} associatedApp Associated express application
   * @param {(string|number)} [port=(process.env.PORT || 3e3)] Port/pipe to use
   * @param {{string, boolean, object, function(Server), boolean}} [opts={name: 'Server', useHttps: false, securityOptions: {}, callback: (server) => {}, showPublicIP: false}]
   * Options including the server's name, HTTPS, options needed for the HTTPs server, callback called within the listen event and whether it should show its public
   * IP
   * @example
   * const express = require('express');
   * let opts = {
   *   name: 'Custom Server',
   *   callback: () => console.log('READY');
   * }
   * let server = new Server(express(), 3002, opts);
   */
  constructor(associatedApp, port = (process.env.PORT || 3e3), opts = DEFAULT_OPTS) {
    this._port = normalizePort(port);
    this._usesHttps = opts.useHttps || DEFAULT_OPTS.useHttps;
    this._app = associatedApp;
    this._options = opts.securityOptions || DEFAULT_OPTS.securityOptions;
    this._server = this._usesHttps ? require('https').createServer(this._options, this._app) : require('http').createServer(this._app);
    this._name = opts.name;
    this._server.on('error', Server.onError);

    this._handler = () => {
      const ipAddress = this._server.address();
      const protocol = this._useHttps ? 'https' : 'http';
      const location = typeof ipAddress === 'string' ?
        `pipe ${ipAddress}` :
        `${protocol}://${ipAddress.address === '::' ? 'localhost' : ipAddress.address}:${ipAddress.port}`;
      info(`${this._name} listening at ${colour('in', location)} (${getEnv(this._app)} environment)`);
      if ('callback' in opts) opts.callback(this);
    };
    this.restart();

    if (opts.showPublicIP) {
      require('external-ip')()((err, ip) => {
        if (err) error('Public IP error:', err);
        info(`Public IP: ${colour('spec', ip)}`);
      });
    }

    process.on('SIGTERM', () => this.close());
    process.on('SIGINT', () => this.close());
  }

  /**
   * @description Get the associated application (Express instance).
   * @return {express} Associated Express instance
   */
  get app() {
    return this._app;
  }

  /**
   * @description Set the Express application associated to the router.
   * @param {express} value Express app
   */
  set app(value) {
    this._app = value;
  }

  /**
   * @description Get the port/pipe of used by the server.
   * @return {(number|string)} Port/pipes
   */
  get port() {
    return this._port;
  }

  /**
   * @description Change the port/pipe of the server <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {(number|string)} value New port/pipe
   */
  set port(value) {
    this._port = value;
  }

  /**
   * @description Get the server's name.
   * @return {string} Name
   */
  get name() {
    return this._name;
  }

  /**
   * @description Change the server's name.
   * @param {string} value New name
   */
  set name(value) {
    this._name = value;
  }

  /**
   * @description See if whether or not the server is using HTTPS.
   * @return {boolean} S flag
   */
  get useHttps() {
    return this._useHttps;
  }

  /**
   * @description Changes the HTT<strong>S</strong> flag <strong>without affecting the server instance</strong>.<br>
   * <em style="color: red">Use this method at your own risk!</em>
   * @param {boolean} value New flag
   */
  set useHttps(value) {
    this._useHttps = value;
  }

  /**
   * @description Get the server options (that is the ones used for the HTTPS mode).
   * @return {object} Options
   */
  get options() {
    return this._options;
  }

  /**
   * @description Change the server options.<br>
   * <em>Caution: this may not change the options used when the server's instance was made.</em>
   * @param {object} value New options
   */
  set options(value) {
    this._serverOptions = value;
  }

  /**
   * @description Get the server's instance.
   * @return {(http.Server|https.Server)} Server instance
   */
  get server() {
    return this._server;
  }

  /**
   * @description Change the server's instance.
   * @param {(http.Server|https.Server)} value new server instance
   */
  set server(value) {
    this._server = value;
  }

  /**
   * @descripton (Re)start the server.
   */
  restart() {
    this._server.listen(this._port, this._handler);
  }

  /**
   * Event listener for HTTP server "error" event.
   * @param {*} error Error to handle
   * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
   */
  static onError(error) {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof this._port === 'string' ? `Pipe ${this._port}` : `Port ${this._port}`;

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
   * @description Close the server gracefully.
   */
  close() {
    let closing = new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) reject(err);
        info(`Closing the server ${colour('out', this.name)}...`);
        resolve(this);
      });
    });
    return closing.then(server => {
      info(`${colour('out', this.name)} is now closed.`);
      process.exit();
    }).catch(err => {
      error(`Server closure of ${colour('out', this.name)} led to:`, err);
      process.exit();
    })
  }

  /**
   * @description Textual representation of a Server object.
   * @return {string} Server object in text
   */
  toString() {
    return `Server(name='${this.name}', port=${this.port}, app=${this.app}, useHttps=${this.useHttps}, options=${this.options}, instance=${this.server})`
  }
}

module.exports = Server;