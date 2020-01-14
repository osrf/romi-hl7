import * as net from 'net';
import { Client, parse, Server, Driver } from '../../src/hl7';
import { readTestFile } from '../support/utils';
import { OperatingTheatre } from '../../src/esb/models';

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
      const ot = OperatingTheatre.fromHL7(msg);
      expect(ot.roomNumber).toBe('2A');
      expect(msg.dump()).toBe(data);
      done();
    });

    const data = readTestFile('operating-theatre.bin');
    const hl7 = parse(data);

    const clientConn = await clientApp.connect(50001, 'localhost');
    clientConn.send(hl7);
  });

  it('echo driver', async done => {
    const echoDriver: Driver = {
      onIncoming: (msg, conn, _) => {
        conn.send(msg);
      },
    }
    serverApp.useDriver(echoDriver);
    clientApp.useIncoming(msg => {
      expect(msg.dump()).toBe(data);
      done();
    });

    const data = readTestFile('operating-theatre.bin');
    const hl7 = parse(data);

    const clientConn = await clientApp.connect(50001, 'localhost');
    clientConn.send(hl7);
  });

  it('transformation middleware', async done => {
    clientApp.useOutgoing((msg, _, next) => {
      const obr = msg.segment('OBR')!;
      obr[1] = 'TEST';
      next();
    });
    serverApp.useIncoming((msg, _, _1) => {
      const obr = msg.segment('OBR')!;
      expect(obr[1]).toBe('TEST');
      done();
    });

    const data = readTestFile('operating-theatre.bin');
    const hl7 = parse(data);

    const clientConn = await clientApp.connect(50001, 'localhost');
    clientConn.send(hl7);
  });
});
