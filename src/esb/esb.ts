import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as hl7 from '../hl7';
import { SerializationError } from './error';

export interface Request {
  msg: hl7.Message;
  conn: hl7.Connection;
}

export type MessageType<T> = { fromHL7(hl7: hl7.Message): T };
type MessageInstanceType<T> = T extends MessageType<infer U> ? U : never;

export class ESB implements hl7.Driver {
  /**
   * Returns an observable event that fires when a HL7 message is received.
   */
  get messageObs(): Observable<Request> { return this._msgSubject; }

  /**
   * Sends a HL7 message to each connected peers.
   * @param msg
   */
  broadcast(
    segments: hl7.Segment[],
    messageType: string,
    recvApplication: string,
    recvFacility: string,
    encodingChars = '^~\\\\&',
    fieldSep = '|',
  ): void {
    const msh = hl7.createHeader(messageType, recvApplication, recvFacility, encodingChars);
    const msg = new hl7.Message([msh, ...segments], encodingChars, fieldSep);

    for (const conn of this._connections) {
      conn.send(msg);
    }
  }

  /**
   * Returns an message observable that filters only messages of a certain type.
   * @param messageType
   */
  filterMessageObs<
    T extends MessageType<U>,
    U = MessageInstanceType<T>,
  >(messageType: T): Observable<U> {
    let result: U;
    return this.messageObs.pipe(filter(req => {
      try {
        result =  messageType.fromHL7(req.msg);
        return true;
      } catch (e) {
        if (e instanceof SerializationError) {
          return false;
        }
        throw e;
      }
    }), map(() => {
      return result;
    }));
  }

  onConnection(conn: hl7.Connection): void {
    this._connections.add(conn);
    conn.socket.on('close', () => {
      this._connections.delete(conn);
    });
  }

  onIncoming(msg: hl7.Message, conn: hl7.Connection): void {
    this._msgSubject.next({
      msg: msg,
      conn: conn,
    });
    conn.send(msg.createACK(hl7.ACKCode.AA));
  }

  private _connections = new Set<hl7.Connection>();
  private _msgSubject = new Subject<Request>();
}
