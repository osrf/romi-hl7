import * as net from 'net';
import { Server } from '../../src/hl7';
import { readTestFile } from '../support/utils';

describe('hl7 server tests', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server();
    server.listen(50001, 'localhost');
  });

  it('can receive message', done => {
    server.on('message', hl7 => {
      expect(hl7.segment('MSH')![0]).toBe('MSH');
      done();
    });
    const data = readTestFile('operating-theatre.bin');
    const socket = net.createConnection(50001, 'localhost');
    socket.write(`\x0b${data}\x1c\x0d`);
  });
});
