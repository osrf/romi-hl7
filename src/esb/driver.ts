import { Connection, Middleware } from '../hl7/connection';

export interface Driver {
  onConnect?(conn: Connection): void;
  onIncoming?: Middleware;
  onOutgoing?: Middleware;
}
