/* eslint-disable @typescript-eslint/no-explicit-any */
// needed to provide generic implementation for EventEmitter methods

import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';

enum _MLLPParserState {
  SOM,
  MSG,
  EOM,
}

export class Protocol extends EventEmitter {
  static send(msg: string, stream: Writable): void {
    stream.write(`\x0b${msg}\x1c\x0d`);
  }

  constructor(stream: Readable) {
    super();
    this._stream = stream;
    this._stream.on('data', data => this._onData(data));
  }

  addListener(event: 'message', listener: (message: string) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this;
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: 'message', message: string): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: 'message', listener: (message: string) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: 'message', listener: (message: string) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: 'message', listener: (message: string) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this;
  prependListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: 'message', listener: (message: string) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  private _stream: Readable;
  private _buffer = '';
  private _state = _MLLPParserState.SOM;
  private _start = -1;
  private _end = -1;

  private _onData(data: Buffer): void {
    if (this._state === _MLLPParserState.SOM) {
      const idx = data.indexOf('\x0b');
      if (idx !== -1) {
        this._start = idx + 1;
        this._state = _MLLPParserState.MSG;
      }
    }
    if (this._state === _MLLPParserState.MSG) {
      const idx = data.indexOf('\x0b', this._start);
      this._end = data.indexOf('\x1c\x0d');
      if (idx !== -1 && idx < this._end) {
        console.warn(`discarded incomplete message "${this._buffer.toString()}"`);
        this._state = _MLLPParserState.SOM;
        this._buffer = '';
        return this._onData(data);
      }
      if (this._end === -1) {
        this._buffer += data.slice(this._start);
        this._start = 0;
      } else {
        this._buffer += data.slice(this._start, this._end);
        this._state = _MLLPParserState.EOM;
      }
    }
    if (this._state === _MLLPParserState.EOM) {
      this.emit('message', this._buffer.slice());
      this._buffer = '';
      this._state = _MLLPParserState.SOM;
      const remaining = data.slice(this._end + 2);
      if (remaining) {
        this._onData(remaining);
      }
    }
  }
}
