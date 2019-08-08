/// <reference types="node" />
import http from 'http';
import https from 'https';
import http2 from 'http2';
declare type HttpServer = http.Server | https.Server | http2.Http2Server | Function | {
    on?: Function;
};
declare type NumLike = number | string;
interface App extends Function {
    get?: Function;
}
interface Options {
    name: string;
    useHttps: boolean;
    useHttp2: boolean;
    securityOptions: Record<string, any>;
    showPublicIP: boolean;
    silent: boolean;
    gracefulClose?: boolean;
    autoRun?: boolean;
}
/**
 * @description Re-usable server.
 * @public
 */
declare class Server {
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
     * }
     * let server = new Server(express(), 3002, opts);
     * @memberof Server
     * @throws {Error} Invalid port
     * @returns {undefined|Promise} Nothing or the promise returned by <code>run</code>
     */
    private _port;
    private _useHttp2;
    private _useHttps;
    private _app;
    private _options;
    private _silent;
    private _server;
    private _name;
    private _showPublicIP;
    private _env;
    private _handler;
    constructor(associatedApp: App | HttpServer, port?: NumLike, opts?: Options);
    /**
     * @description Get the associated application (Express instance).
     * @return {express} Associated Express instance
     * @memberof Server
     * @public
     */
    /**
    * @description Set the Express application associated to the router.
    * @param {express} value Express app
    * @memberof Server
    * @public
    */
    app: Function | http.Server | https.Server | http2.Http2Server | {
        on?: Function | undefined;
    } | App;
    /**
     * @description Get the port/pipe of used by the server.
     * @return {(number|string)} Port/pipes
     * @memberof Server
     * @public
     */
    /**
    * @description Change the port/pipe of the server <strong>without affecting the server instance</strong>.<br>
    * <em style="color: red">Use this method at your own risk!</em>
    * @param {(number|string)} value New port/pipe
    * @memberof Server
    * @public
    */
    port: number;
    /**
     * @description Get the server's name.
     * @return {string} Name
     * @memberof Server
     * @public
     */
    /**
    * @description Change the server's name.
    * @param {string} value New name
    * @memberof Server
    * @public
    */
    name: string;
    /**
     * @description See if whether or not the server is using HTTPS.
     * @return {boolean} S flag
     * @memberof Server
     * @public
     */
    /**
    * @description Changes the HTTP<strong>S</strong> flag <strong>without affecting the server instance</strong>.<br>
    * <em style="color: red">Use this method at your own risk!</em>
    * @param {boolean} value New flag
    * @memberof Server
    * @public
    */
    useHttps: boolean;
    /**
     * @description See if whether or not the server is using HTTP/2.
     * @return {boolean} Version 2 flag
     * @memberof Server
     * @public
     */
    /**
    * @description Changes the HTTP version flag <strong>without affecting the server instance</strong>.<br>
    * <em style="color: red">Use this method at your own risk!</em>
    * @param {boolean} value New flag
    * @memberof Server
    * @public
    */
    useHttp2: boolean;
    /**
     * @description Get the server options (that is the ones used for the HTTPS and HTTP/2 mode).
     * @return {Object} Options
     * @memberof Server
     * @public
     */
    /**
    * @description Change the server options <strong>without affecting the server instance</strong>.<br>
    * <em style="color: red">Use this method at your own risk!</em>
    * @param {Object} value New options
    * @memberof Server
    * @public
    */
    options: Record<string, any>;
    /**
     * @description Get the server's instance.
     * @return {(http.Server|https.Server|http2.Server)} Server instance
     * @memberof Server
     * @public
     */
    /**
    * @description Change the server's instance.<br>
    * <em>However it's recommended to restart the server otherwise the event handlers won't work properly.
    * @param {(http.Server|https.Server|http2.Server)} value New server instance
    * @memberof Server
    * @public
    */
    server: HttpServer;
    /**
     * @description Get the silent flag.
     * @return {boolean} Server's silence
     * @memberof Server
     * @public
     */
    /**
    * @description Change the server' silence.
    * @param {boolean} value New silence mode
    * @memberof Server
    * @public
    */
    silent: boolean;
    /**
     * @description Get the HTTP protocol.
     * @returns {string} Protocol
     */
    readonly protocol: "https" | "http";
    /**
     * @description Get the server's address.
     * @returns {string} Address
     */
    readonly address: string;
    /**
     * @description Run/start the server.
     * @memberof Server
     * @returns {Server} Server
     * @throws {Error} Running error
     * @public
     */
    run(): Promise<Server | void>;
    /**
     * @description Event listener for HTTP server "error" event.
     * @param {Error} error Error to handle
     * @memberof Server
     * @public
     * @returns {function(Error)} Error handler
     * @throws {Error} EACCES/EADDRINUSE/ENOENT errors
     */
    onError(error: Error): void;
    /**
     * @description Gracefully close the server.
     * @returns {Promise} Closure promise
     * @throws {Error} Closing error
     * @memberof Server
     * @public
     */
    close(): Promise<unknown>;
    /**
     * @description Textual representation of a Server object.
     * @return {string} Server object in text
     * @memberof Server
     * @public
     */
    toString(): string;
}
export default Server;
