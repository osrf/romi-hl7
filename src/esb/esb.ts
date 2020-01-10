import { Observable, Subject } from 'rxjs';
import { ACKCode, Connection, HL7Message } from '../hl7';
import { Driver } from './driver';
import { Endpoint } from './endpoint';

export interface Request {
  msg: HL7Message,
  conn: Connection,
}

export class ESB implements Driver {
  /**
   * Returns an observable event that fires when a HL7 message is received.
   */
  get messageObs(): Observable<Request> { return this._msgSubject; }

  constructor(endpoints: Endpoint[]) {
    this._endpoints = endpoints;

    for (const ep of this._endpoints) {
      ep.useDriver(this);
    }
  }

  /**
   * Starts each endpoints, for server endpoints, this will start listening for connections, for
   * client endpoints, this will establish a connection with the server.
   */
  start() {
    for (const ep of this._endpoints) {
      ep.start();
    }
  }

  /**
   * Sends a HL7 message to each supported endpoints, each endpoint have its own outgoing middleware
   * that filters the messages that it supports.
   * @param msg
   */
  send(msg: HL7Message): void {
    for (const ep of this._endpoints) {
      ep.send(msg);
    }
  }

  onIncoming(msg: HL7Message, conn: Connection, _: () => void): void {
    this._msgSubject.next({
      msg: msg,
      conn: conn,
    });
    conn.send(msg.createACK(ACKCode.AA));
  }

  private _endpoints: Endpoint[];
  private _msgSubject = new Subject<Request>();
}
