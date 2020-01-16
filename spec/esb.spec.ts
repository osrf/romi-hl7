import * as net from 'net';
import * as typemoq from 'typemoq';
import { ESB } from '../src/esb';
import { OperatingTheatre } from '../src/esb/models';
import { Connection, parse } from '../src/hl7';
import { readTestFile } from './support/utils';

function createMockConnection(): typemoq.IMock<Connection> {
  const mockSocket = typemoq.Mock.ofType<net.Socket>();
  const mockConnection = typemoq.Mock.ofType<Connection>();
  mockConnection.setup(x => x.socket).returns(() => mockSocket.object);
  return mockConnection;
}

describe('esb tests', () => {
  let esb: ESB;

  beforeEach(() => {
    esb = new ESB();
  });

  it('broadcast to all connections', () => {
    const mockConnections = [
      createMockConnection(),
      createMockConnection(),
    ];

    esb.onConnection(mockConnections[0].object);
    esb.onConnection(mockConnections[1].object);

    const data = readTestFile('operating-theatre.bin');
    const msg = parse(data);
    esb.broadcast(msg);

    mockConnections[0].verify(x => x.send(typemoq.It.isAny()), typemoq.Times.once());
    mockConnections[1].verify(x => x.send(typemoq.It.isAny()), typemoq.Times.once());
  });

  it('filters message obs', done => {
    esb.filterMessageObs(OperatingTheatre).subscribe(() => {
      done();
    });

    const mockConnection = createMockConnection();
    const data = readTestFile('operating-theatre.bin');
    const msg = parse(data);
    esb.onIncoming(msg, mockConnection.object);
  });
});
