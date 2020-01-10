import * as net from 'net';
import { Connection, IncomingMiddleware, OutgoingMiddleware } from './connection';

export class Client {
  async connect(port: number, host: string): Promise<Connection> {
    const socket = net.connect(port, host);
    return new Promise<Connection>(res => {
      socket.on('connect', () => {
        res(new Connection(socket, this._incomingMdws, this._outgoingMdws));
      });
    })
  }

  useIncoming(middleware: IncomingMiddleware) {
    this._incomingMdws.push(middleware);
  }

  useOutgoing(middleware: OutgoingMiddleware) {
    this._outgoingMdws.push(middleware);
  }

  private _incomingMdws: IncomingMiddleware[] = [];
  private _outgoingMdws: OutgoingMiddleware[] = [];
}
