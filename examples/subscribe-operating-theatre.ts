import { ESB, ServerEndpoint } from '../src/esb';
import { OperatingTheatre } from '../src/esb/models';

function subscribeOperatingTheatre() {
  const endpoint = new ServerEndpoint(50001, 'localhost');
  const esb = new ESB(endpoint);
  esb.filterMessageObs(OperatingTheatre).subscribe(ot => {
    console.log(ot);
  });
  esb.startAll();
}

subscribeOperatingTheatre();
