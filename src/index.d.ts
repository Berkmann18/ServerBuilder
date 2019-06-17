import http from 'http'
import https from 'https'
import http2 from 'http2'
import Server from './index';

export type HttpServer = http.Server | https.Server | http2.Http2Server | Function;
export type NumLike = number | string;
export type ServerCallback = (server: Server) => void;
export interface Options {
  name: string;
  useHttps: boolean;
  useHttp2: boolean;
  securityOptions: Record<string, any>;
  callback: ServerCallback;
  showPublicIP: boolean;
  silent: boolean;
  gracefulClose?: boolean;
  autoRun?: boolean;
}

export type App = Function | Record<string, any> | {get: Function}