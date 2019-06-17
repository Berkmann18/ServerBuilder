/// <reference path="../src/utils.d.ts" />
/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */
declare const clr: any, promisify: any;
declare const eip: any;
/**
 * @description Get the public IP of the host.
 * @returns {string|Error} IP or an error
 */
declare const getPublicIP: () => Promise<string | Error>;
declare const SEMANTIC_VERSION: RegExp;
/**
 * @description Get the Node version.
 * @returns {{major: number, minor: number, patch: number}} Semantic version
 */
declare const getNodeVersion: Record<string, any>;
