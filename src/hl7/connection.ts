import * as net from 'net';
import { Protocol as MLLPProtocol } from '../mllp';
import { Message, parse } from './parser';

export type Middleware =
  (msg: Message, connection: Connection, next: () => void) => void;

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

  /**
   * Sends a HL7 message.
   * @param msg
   */
  send(msg: Message): void {
    let i = 0;
    const next = (): void => {
      if (i < this._outgoingMdws.length) {
        this._outgoingMdws[i++](msg, this, next);
      } else {
        MLLPProtocol.send(msg.dump(), this._socket);
      }
    };
    next();
  }

  /**
   * Closes the connection, equivalent to calling `end()` on the underlying socket.
   */
  end(): void {
    this._socket.end();
  }

  private _socket: net.Socket;
  private _mllp: MLLPProtocol;
  private _incomingMdws: Middleware[];
  private _outgoingMdws: Middleware[];

  private _onMessage(msg: string): void {
    const hl7 = parse(msg);
    let i = 0;
    const next = (): void => {
      if (i < this._incomingMdws.length) {
        this._incomingMdws[i++](hl7, this, next);
      }
    };
    next();
  }
}
