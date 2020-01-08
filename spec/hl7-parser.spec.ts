import { parse } from '../src/hl7';
import { readTestFile } from './support/utils';

describe('hl7 parser tests', () => {
  it('can parse message', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    expect(hl7.json[0][0]).toBe('MSH');
    expect(hl7.json[0][2]).toBe('OTM');
    const pid = hl7.segment('PID')!;
    expect(pid[0]).toBe('PID');
    expect(pid[1]).toBe('');
    expect(pid[3]).toBe('S8012345Z^J^M11^MRN');
  });

  it('can get components', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    const pid = hl7.segment('PID')!;
    expect(hl7.components(pid[3])[0]).toBe('S8012345Z');
  });

  it('is not case sensitive', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    const msh = hl7.segment('msh');
    expect(msh).not.toBeNull();
  });

  it('can parse repeated segments', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    const obx = hl7.allSegments('OBX');
    expect(obx.length).toBe(6);
    expect(obx[0][3]).toBe('OTR_NO^OTRoomNumber');
    expect(obx[5][3]).toBe('C_DETAILS^Case Details');
  });
});
