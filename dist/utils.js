"use strict";
/* eslint-env node */
/// <reference path="utils.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @description Utility module for this package.
 * @module
 * @exports {error, info, warn, dbg, inp, out, setColours, load, incomingIp, clrScheme, colour, view}
 */
const clr = require('nclr'), { promisify } = require('util');
const eip = promisify(require('external-ip')());
clr.extend({
    spec: 'magenta'
});
/**
 * @description Get the public IP of the host.
 * @returns {string|Error} IP or an error
 */
const getPublicIP = () => __awaiter(this, void 0, void 0, function* () {
    try {
        let ip = yield eip();
        return ip;
    }
    catch (err) {
        /* istanbul ignore next */
        return err;
    }
});
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
    };
};
module.exports = {
    use: clr.use,
    spec: clr.spec,
    getPublicIP,
    getNodeVersion
};
