import { Patient } from '../src/esb/models';
import { parse } from '../src/hl7';
import { readTestFile } from './support/utils';

describe('basic model tests', () => {
  it('converts from hl7 correctly', () => {
    const data = readTestFile('operating-theatre.bin');
    const msg = parse(data);
    const patient = Patient.fromHL7(msg);
    expect(patient.id).toBe('S8012345Z^J^M11^MRN');
    expect(patient.name).toBe('Wang Shu^^^^Mr');
  });
});
