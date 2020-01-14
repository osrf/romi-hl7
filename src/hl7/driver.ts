import { Connection, Middleware } from './connection';

/**
 * A driver is can be registered to HL7 server or client apps to provide a compatibility layer
 * between the hardware and romi-hl7.
 */
export interface Driver {
  onConnect?(conn: Connection): void;
  onIncoming?: Middleware;
  onOutgoing?: Middleware;
}
