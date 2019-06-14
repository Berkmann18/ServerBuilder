import http from 'http'
import https from 'https'
import http2 from 'http2'
import Server from './index';

type HttpServer = http.Server | https.Server | http2.Http2Server | Function;
type NumLike = number | string;
type ServerCallback = (server:Server) => void;
interface Options {
  name: string,
  useHttps: boolean,
  useHttp2: boolean,
  securityOptions: Object,
  callback: ServerCallback,
  showPublicIP: boolean,
  silent: boolean,
  gracefulClose?: boolean,
  autoRun?: boolean,
}

type App = Function | Object | {get: Function}