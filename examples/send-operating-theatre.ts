import { OperatingTheatre } from '../src/esb/models';
import { Client, Message, createHeader } from '../src/hl7';

async function sendOperatingTheatre(): Promise<void> {
  const client = new Client();
  const ot = new OperatingTheatre(
    'roomNumber',
    'disipline',
    'castType',
    'startTime',
    'endTime',
    'details',
    'surgeonName',
    'date',
  );
  const conn = await client.connect(50001, 'localhost');
  const header = createHeader('ORU^R01', 'recvApplication', 'recvFacility');
  const segments = ot.toHL7Segments();
  conn.send(new Message([header, ...segments]));
  conn.end();
}

sendOperatingTheatre();
