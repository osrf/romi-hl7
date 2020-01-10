import * as net from 'net';
import { Protocol as MLLPProtocol } from '../mllp';
import { HL7Message, parse } from './parser';

export type Middleware =
  (msg: HL7Message, connection: Connection, next: () => void) => void;

export class Connection {
  get socket(): net.Socket {
    return this._socket;
  }

  constructor(
    socket: net.Socket,
    incomingMdws: Middleware[],
    outgoingMdws: Middleware[],
  ) {
    this._socket = socket;
    this._incomingMdws = incomingMdws;
    this._outgoingMdws = outgoingMdws;
    this._mllp = new MLLPProtocol(this._socket);
    this._mllp.on('message', msg => this._onMessage(msg));
  }

  send(msg: HL7Message): void {
    let i = 0;
    const next = () => {
      if (i < this._outgoingMdws.length) {
        this._outgoingMdws[i](msg, this, next);
        i++;
      } else {
        MLLPProtocol.send(msg.dump(), this._socket);
      }
    }
    next();
  }

  end(): void {
    this._socket.end();
  }

  private _socket: net.Socket;
  private _mllp: MLLPProtocol;
  private _incomingMdws: Middleware[];
  private _outgoingMdws: Middleware[];

  private _onMessage(msg: string) {
    const hl7 = parse(msg);
    let i = 0;
    const next = () => {
      if (i < this._incomingMdws.length) {
        this._incomingMdws[i](hl7, this, next);
        i++;
      }
    };
    next();
  }
}
