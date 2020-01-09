import * as net from 'net';
import { Server } from '../../src/hl7';
import { readTestFile } from '../support/utils';

describe('hl7 server tests', () => {
  let app: Server;
  let server: net.Server;

  beforeEach(() => {
    app = new Server();
    server = app.listen(50001, 'localhost');
  });

  afterEach(() => {
    server.close();
  });

  it('can receive message', done => {
    app.use((req, resp, next) => {
      expect(req.msg.segment('MSH')![0]).toBe('MSH');
      done();
    });
    const data = readTestFile('operating-theatre.bin');
    const socket = net.createConnection(50001, 'localhost');
    socket.write(`\x0b${data}\x1c\x0d`);
  });
});
