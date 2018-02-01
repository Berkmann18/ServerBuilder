/**
 * @description Server builder.
 * @module serverBuilder
 * @requires http, https, colors, ./utils
 * @exports Server
 */

const eip = require('external-ip')(), {setColours, info, error, colour} = require('./src/utils');

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
   * @param {string} [name='Server'] Server's name
   * @param {boolean} [useHttps=false] Use HTTPS instead of HTTP or not
   * @param {object} [securityOptions={}] Options needed for the HTTPS server
   */
  constructor(associatedApp, port=(process.env.PORT || 3e3), name='Server', useHttps=false, securityOptions={}) {
    this._port = normalizePort(port);
    this._usesHttps = useHttps;
    this._app = associatedApp;
    this._options = securityOptions;
    this._server = this._usesHttps ? require('https').createServer(this._options, this._app) : require('http').createServer(this._app);
    this._name = name;
    //this._app.set('port', this._port);
    this._server.listen(this._port, /*'0.0.0.0',*/ () => {
      const ipAddress = this._server.address();
      const location = typeof ipAddress === 'string'
        ? `pipe ${ipAddress}`
        : `http://${ipAddress.address === '::' ? 'localhost' : ipAddress.address}:${ipAddress.port}`;
      info(`${this._name} listening at ${colour('in', location)} `);
    });
    this._server.on('error', Server.onError);
    eip((err, ip) => {
      if (err) error('Public IP error:', err);
      info(`Public IP: ${colour('spec', ip)}`);
    });
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
      break;
    default:
      throw error;
    }
  };

  /**
   * @description Textual representation of a Server object.
   * @return {string} Server object in text
   */
  toString() {
    return `Server(name='${this.name}', port=${this.port}, app=${this.app}, useHttps=${this.useHttps}, options=${this.options}, instance=${this.server})`
  }
}

module.exports = Server;