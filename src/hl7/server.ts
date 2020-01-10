import * as net from 'net';
import { Connection, IncomingMiddleware, OutgoingMiddleware } from './connection';

export class Server {
  constructor() {
    this._server = new net.Server(socket => this._onConnection(socket));
  }

  listen(port: number, host?: string): net.Server {
    return this._server.listen(port, host);
  }

  useIncoming(middleware: IncomingMiddleware) {
    this._incomingMdws.push(middleware);
  }

  useOutgoing(middleware: OutgoingMiddleware) {
    this._outgoingMdws.push(middleware);
  }

  private _server: net.Server;
  private _incomingMdws: IncomingMiddleware[] = [];
  private _outgoingMdws: OutgoingMiddleware[] = [];

  private _onConnection(socket: net.Socket): void {
    new Connection(socket, this._incomingMdws, this._outgoingMdws);
  }
}
