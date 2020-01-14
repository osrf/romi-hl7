/* eslint-disable @typescript-eslint/no-explicit-any */
// needed to provide generic implementation for EventEmitter methods

import { EventEmitter } from 'events';
import * as net from 'net';
import { Driver } from './driver';
import { Connection, Middleware } from './connection';

export class BaseApp extends EventEmitter {
  addListener(event: 'connection', listener: (conn: Connection) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: 'connection', conn: Connection): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: 'connection', listener: (conn: Connection) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: 'connection', listener: (conn: Connection) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: 'connection', listener: (conn: Connection) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: 'connection', listener: (conn: Connection) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  useDriver(driver: Driver): void {
    if (driver.onConnect) {
      this.on('connection', conn => driver.onConnect!(conn));
    }
    if (driver.onIncoming) {
      this._incomingMdws.push((msg, conn, next) => driver.onIncoming!(msg, conn, next));
    }
    if (driver.onOutgoing) {
      this._outgoingMdws.push((msg, conn, next) => driver.onOutgoing!(msg, conn, next));
    }
  }

  useIncoming(middleware: Middleware): void {
    this._incomingMdws.push(middleware);
  }

  useOutgoing(middleware: Middleware): void {
    this._outgoingMdws.push(middleware);
  }

  protected _incomingMdws: Middleware[] = [];
  protected _outgoingMdws: Middleware[] = [];
}

export class Client extends BaseApp {
  async connect(port: number, host: string): Promise<Connection> {
    const socket = net.connect(port, host);
    return new Promise<Connection>(res => {
      socket.on('connect', () => {
        const conn = new Connection(socket, this._incomingMdws, this._outgoingMdws);
        this.emit('connection', conn);
        res(conn);
      });
    });
  }
}

export class Server extends BaseApp {
  constructor() {
    super();
    this._server = new net.Server(socket => this._onConnection(socket));
  }

  listen(port: number, host?: string): net.Server {
    return this._server.listen(port, host);
  }

  private _server: net.Server;

  private _onConnection(socket: net.Socket): void {
    const conn = new Connection(socket, this._incomingMdws, this._outgoingMdws);
    this.emit('connection', conn);
  }
}
