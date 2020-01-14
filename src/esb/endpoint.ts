import * as net from 'net';
import * as hl7 from '../hl7';

export interface Endpoint {
  readonly app: hl7.BaseApp;
  start(): void;
  stop(): void;

  /**
   * Sends a HL7 message to all connected peers.
   * @param msg
   */
  broadcast(msg: hl7.Message): void;

  useDriver(driver: hl7.Driver): void;
}

export class ServerEndpoint implements Endpoint {
  get app(): hl7.BaseApp { return this._app; }

  constructor(port: number, host?: string) {
    this._port = port;
    this._host = host;
    this._app = new hl7.Server();
    this._app.on('connection', conn => this._onConnection(conn));
  }

  start(): void {
    this._app.listen(this._port, this._host);
  }

  stop(): void {
    this._server?.close();
  }

  broadcast(msg: hl7.Message): void {
    const it = this._connections.values();
    let next = it.next();
    while (!next.done) {
      next.value.send(msg);
      next = it.next();
    }
  }

  useDriver(driver: hl7.Driver): void {
    this._app.useDriver(driver);
  }

  private _port: number;
  private _host?: string;
  private _app: hl7.Server;
  private _server?: net.Server;
  private _connections = new Set<hl7.Connection>();

  private _onConnection(conn: hl7.Connection): void {
    conn.socket.on('close', () => {
      this._connections.delete(conn);
    });
    this._connections.add(conn);
  }
}

export class ClientEndpoint implements Endpoint {
  get app(): hl7.BaseApp { return this._app; }

  constructor(port: number, host: string) {
    this._port = port;
    this._host = host;
    this._app = new hl7.Client();
    this._app.on('connection', conn => this._conn = conn);
  }

  start(): void {
    this._app.connect(this._port, this._host);
  }

  stop(): void {
    this._conn?.end();
  }

  broadcast(msg: hl7.Message): void {
    this._conn?.send(msg);
  }

  useDriver(driver: hl7.Driver): void {
    this._app.useDriver(driver);
  }

  private _port: number;
  private _host: string;
  private _app: hl7.Client;
  private _conn?: hl7.Connection;
}
