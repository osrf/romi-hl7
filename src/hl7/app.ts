import { HL7Message } from './parser';
import { Response as HL7Response, Server } from './server';

export interface Request {
  msg: HL7Message;
  [extraProps: string]: any;
}

export interface Response {
  send(msg: HL7Message): void;
  [extraProps: string]: any;
}

export type Middleware = (req: Request, resp: Response, mdw: Middleware) => void | (() => void);

export class App {
  start(port: number, host?: string): void {
    this._server.listen(port, host);
    this._server.on('message', (message, resp) => this._onMessage(message, resp));
  }

  use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }

  private _server = new Server();
  private _middlewares: Middleware[] = [];

  private _onMessage(hl7: HL7Message, hl7Resp: HL7Response): void {
    let i = 0;
    const req: Request = {
      msg: hl7,
    };
    const resp: Response = {
      send: msg => hl7Resp.send(msg),
    };
    const next = () => {
      this._middlewares[i](req, resp, next);
      i++;
    };
    next();
  }
}
