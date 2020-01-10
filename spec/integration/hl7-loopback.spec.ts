import * as net from 'net';
import { Client, parse, Server } from '../../src/hl7';
import { readTestFile } from '../support/utils';

describe('hl7 loopback tests', () => {
  let serverApp: Server;
  let clientApp: Client;
  let server: net.Server;

  beforeEach(() => {
    serverApp = new Server();
    clientApp = new Client();
    server = serverApp.listen(50001, 'localhost');
  });

  afterEach(() => {
    server.close();
  });

  it('loopback message', async done => {
    serverApp.useIncoming((msg, conn) => {
      conn.send(msg);
    });
    clientApp.useIncoming(msg => {
      expect(msg.dump()).toBe(data);
      done();
    });

    const data = readTestFile('operating-theatre.bin');
    const hl7 = parse(data);

    const clientConn = await clientApp.connect(50001, 'localhost');
    clientConn.send(hl7);
  });
});
