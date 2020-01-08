import * as net from 'net';
import { Protocol as MLLPProtocol } from '../mllp/protocol';
import { HL7Message, parse } from './parser';

export class Response {
  constructor(
    public socket: net.Socket,
  ) {}

  send(msg: HL7Message) {
    MLLPProtocol.send(msg.dump(), this.socket);
  }
}


export class Server extends net.Server {
  constructor() {
    super();
    this.on('connection', socket => this._onConnection(socket));
  }

  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'connection', listener: (socket: net.Socket) => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'listening', listener: () => void): this;
  addListener(event: 'message', listener: (message: HL7Message, response: Response) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: 'close'): boolean;
  emit(event: 'connection', socket: net.Socket): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'listening'): boolean;
  emit(event: 'message', message: HL7Message, response: Response): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: 'close', listener: () => void): this;
  on(event: 'connection', listener: (socket: net.Socket) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'listening', listener: () => void): this;
  on(event: 'message', listener: (message: HL7Message, response: Response) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: 'close', listener: () => void): this;
  once(event: 'connection', listener: (socket: net.Socket) => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'listening', listener: () => void): this;
  once(event: 'message', listener: (message: HL7Message, response: Response) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: 'close', listener: () => void): this;
  prependListener(event: 'connection', listener: (socket: net.Socket) => void): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'listening', listener: () => void): this;
  prependListener(event: 'message', listener: (message: HL7Message, response: Response) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(event: 'connection', listener: (socket: net.Socket) => void): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'listening', listener: () => void): this;
  prependOnceListener(event: 'message', listener: (message: HL7Message, response: Response) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  private _onConnection(socket: net.Socket): void {
    const mllp = new MLLPProtocol(socket);
    mllp.on('message', message => {
      const hl7 = parse(message);
      this.emit('message', hl7);
    });
  }
}
