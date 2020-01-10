import * as net from 'net';
import { Client, Server, HL7Message } from '../hl7';
import { Connection } from '../hl7/connection';
import { Driver } from './driver';

export interface Endpoint {
  start(): void;
  stop(): void;
  send(msg: HL7Message): void;
  useDriver(driver: Driver): void;
}

export class ServerEndpoint implements Endpoint {
  constructor(port: number, host?: string) {
    this._port = port;
    this._host = host;
    this._app = new Server();
    this._app.on('connection', conn => this._onConnection(conn));
  }

  private _port: number;
  private _host?: string;
  private _app: Server;
  private _server?: net.Server;
  private _connections = new Set<Connection>();

  start(): void {
    this._app.listen(this._port, this._host);
  }

  stop(): void {
    this._server?.close();
  }

  send(msg: HL7Message): void {
    let it = this._connections.values().next();
    while (!it.done) {
      it.value.send(msg);
    }
  }

  useDriver(driver: Driver): void {
    if (driver.onConnect) {
      this._app.on('connection', driver.onConnect);
    }
    if (driver.onIncoming) {
      this._app.useIncoming(driver.onIncoming);
    }
    if (driver.onOutgoing) {
      this._app.useOutgoing(driver.onOutgoing);
    }
  }

  private _onConnection(conn: Connection) {
    conn.socket.on('close', () => {
      this._connections.delete(conn);
    });
    this._connections.add(conn);
  }
}

export class ClientEndpoint implements Endpoint {
  constructor(port: number, host: string) {
    this._port = port;
    this._host = host;
    this._app = new Client();
    this._app.on('connection', conn => this._conn = conn);
  }

  private _port: number;
  private _host: string;
  private _app: Client;
  private _conn?: Connection;

  start(): void {
    this._app.connect(this._port, this._host);
  }

  stop(): void {
    this._conn?.end();
  }

  send(msg: HL7Message): void {
    this._conn?.send(msg);
  }

  useDriver(driver: Driver): void {
    if (driver.onConnect) {
      this._app.on('connection', driver.onConnect);
    }
    if (driver.onIncoming) {
      this._app.useIncoming(driver.onIncoming);
    }
    if (driver.onOutgoing) {
      this._app.useOutgoing(driver.onOutgoing);
    }
  }
}
