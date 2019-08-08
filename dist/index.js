"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-env node */
//eslint-disable-next-line @typescript-eslint/no-triple-slash-reference
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const http2_1 = __importDefault(require("http2"));
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
const { use, getPublicIP } = require('./utils');
/**
 * Normalize a port into a number, string, or false.
 * @param {(string|number)} val Port
 * @return {(string|number|boolean)} Port
 * @protected
 */
const normalizePort = (val) => {
    let port = parseInt(val, 10); /* @todo test if val | 0 is better*/
    if (isNaN(port))
        return port; //Named pipe
    if (port >= 0)
        return port; //Port number
    return false;
};
/**
 * @description Default options for {@link Server.constructor}.
 * @type {{name: string, useHttps: boolean, securityOptions: Object, showPublicIP: boolean, silent: boolean}}
 */
const DEFAULT_OPTS = {
    name: 'Server',
    useHttps: false,
    useHttp2: false,
    securityOptions: {},
    showPublicIP: false,
    silent: false
};
/**
 * @name getEnv
 * @description Get the environment name.
 * @param {function|Object} app Application
 * @protected
 */
const getEnv = (app) => {
    if (process.env.NODE_ENV)
        return process.env.NODE_ENV;
    return (typeof app.get === 'function') ? app.get('env') : 'development';
};
/**
 * @description Create a server.
 * @param {Server} instance Server instance
 * @returns {(http.Server|https.Server|http2.Server)} HTTP* server
 */
const createServer = (instance) => {
    if (instance.useHttp2)
        return http2_1.default.createSecureServer(instance.options, instance.app);
    return instance.useHttps ?
        https_1.default.createServer(instance.options, instance.app) :
        http_1.default.createServer(instance.app);
};
/**
 * @description Re-usable server.
 * @public
 */
class Server {
    constructor(associatedApp, port = (process.env.PORT || 3e3), opts = DEFAULT_OPTS) {
        this._port = normalizePort(port);
        if (this._port === NaN || !this._port)
            throw new Error(`Port should be >= 0 and < 65536. Received ${this._port}`);
        this._useHttp2 = opts.useHttp2 || DEFAULT_OPTS.useHttp2;
        this._useHttps = opts.useHttps || DEFAULT_OPTS.useHttps;
        this._app = associatedApp;
        this._options = opts.securityOptions || DEFAULT_OPTS.securityOptions;
        this._silent = opts.silent || DEFAULT_OPTS.silent;
        this._server = createServer(this);
        this._name = opts.name || DEFAULT_OPTS.name;
        if ('name' in this._server)
            this._server.name = this._name;
        this._server.on('error', this.onError);
        this._showPublicIP = opts.showPublicIP || DEFAULT_OPTS.showPublicIP;
        this._env = getEnv(this._app);
        this._handler = () => {
            if (!this._silent) {
                try {
                    info(`${this._name} listening at ${use('inp', this.address)} (${this._env} environment)`);
                }
                catch (err) {
                    this.onError(err);
                }
            }
        };
        opts.gracefulClose && process.on('SIGTERM', () => this.close()) && process.on('SIGINT', () => this.close());
        // if (opts.autoRun) return this.run();
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
        return (this._useHttps || this._useHttp2) ? 'https' : 'http';
    }
    /**
     * @description Get the server's address.
     * @returns {string} Address
     */
    get address() {
        const ipAddress = this._server.address();
        const location = typeof ipAddress === 'string' ?
            `pipe ${ipAddress}` :
            `${this.protocol}://${(ipAddress.address === '::') ? 'localhost' : ipAddress.address}:${ipAddress.port}`;
        return location;
    }
    /**
     * @description Run/start the server.
     * @memberof Server
     * @returns {Server} Server
     * @throws {Error} Running error
     * @public
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let server = yield this._server.listen(this._port, this._handler);
                if (this._showPublicIP) {
                    let ip = yield getPublicIP();
                    info(`Public IP: ${use('spec', ip)}`);
                }
                return this;
            }
            catch (err) {
                this.onError(err);
            }
        });
    }
    /**
     * @description Event listener for HTTP server "error" event.
     * @param {Error} error Error to handle
     * @memberof Server
     * @public
     * @returns {function(Error)} Error handler
     * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
     */
    onError(error) {
        /*
          ERR_SERVER_ALREADY_LISTEN (listen method called more than once w/o closing)
          ERR_SERVER_NOT_RUNNING (Server is not running or in Node 8 "Not running")
          ...
          */
        if (error.syscall !== 'listen')
            throw error;
        const port = this.address().port;
        const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;
        //Handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                throw new Error(`${bind} requires elevated privileges`);
            case 'EADDRINUSE':
                throw new Error(`${bind} is already in use`);
            default:
                throw error;
        }
    }
    ;
    /**
     * @description Gracefully close the server.
     * @returns {Promise} Closure promise
     * @throws {Error} Closing error
     * @memberof Server
     * @public
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let closed = yield new Promise((resolve, reject) => {
                    this._server.close((err) => {
                        if (err)
                            reject(err);
                        if (!this._silent)
                            info(`Closing the server ${use('out', this.name)}...`);
                        resolve(true);
                    });
                });
                if (!this._silent)
                    info(`${use('out', this.name)} is now closed.`);
                return closed;
            }
            catch (err) {
                error(`Server closure of ${use('out', this.name)} led to:`, err);
                this.onError(err);
            }
        });
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
exports.default = Server;
