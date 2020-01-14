import { Connection, Middleware } from './connection';

export interface Driver {
  onConnect?(conn: Connection): void;
  onIncoming?: Middleware;
  onOutgoing?: Middleware;
}
