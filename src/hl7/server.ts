import * as net from 'net';
import { Protocol as MLLPProtocol } from '../mllp/protocol';
import { HL7Message, parse } from './parser';

export interface Request {
  msg: HL7Message;
  [extraProps: string]: any;
}

export interface Response {
  send(msg: HL7Message): void;
  [extraProps: string]: any;
}

class ResponseImpl implements Response {
  constructor(
    public socket: net.Socket,
  ) {}

  send(msg: HL7Message): void {
    MLLPProtocol.send(msg.dump(), this.socket);
  }
}

export type Middleware = (req: Request, resp: Response, mdw: Middleware) => void | (() => void);

export class Server {
  constructor() {
    this._server = new net.Server(socket => this._onConnection(socket));
  }

  listen(port: number, host?: string): net.Server {
    return this._server.listen(port, host);
  }

  use(middleware: Middleware) {
    this._middlewares.push(middleware);
  }

  private _server: net.Server;
  private _middlewares: Middleware[] = [];

  private _onConnection(socket: net.Socket): void {
    const mllp = new MLLPProtocol(socket);
    mllp.on('message', message => {
      const hl7 = parse(message);
      this._handleMsg(hl7, socket);
    });
  }

  private _handleMsg(msg: HL7Message, socket: net.Socket) {
    const req: Request = {
      msg: msg,
    }
    const resp: Response = new ResponseImpl(socket);
    let i = 0;
    const next = () => {
      this._middlewares[i](req, resp, next);
      i++;
    };
    next();
  }
}
