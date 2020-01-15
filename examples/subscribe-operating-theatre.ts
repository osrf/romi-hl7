import { ESB } from '../src/esb';
import { OperatingTheatre } from '../src/esb/models';
import { Server } from '../src/hl7';

function subscribeOperatingTheatre(): void {
  const server = new Server();
  const esb = new ESB();
  server.useDriver(esb);
  server.listen(50001, 'localhost');
  esb.filterMessageObs(OperatingTheatre).subscribe(ot => {
    console.log(ot);
  });
}

subscribeOperatingTheatre();
