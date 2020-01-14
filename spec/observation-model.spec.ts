import { OperatingTheatre } from '../src/esb/models';
import { parse } from '../src/hl7';
import { readTestFile } from './support/utils';

describe('esb observation model tests', () => {
  it('converts from hl7 correctly', () => {
    const data = readTestFile('operating-theatre.bin');
    const msg = parse(data);
    const ot = OperatingTheatre.fromHL7(msg);
    expect(ot.roomNumber).toBe('2A');
    expect(ot.discipline).toBe('Orthopaedic');
    expect(ot.caseType).toBe('Thyroidectomy');
    expect(ot.startTime).toBe('153000');
    expect(ot.endTime).toBe('163000');
    expect(ot.details).toBe('Suspect cancer spread from Lung to Trachea');
  });
});
