import { ACKCode, parse } from '../src/hl7';
import { readTestFile } from './support/utils';

describe('hl7 parser', () => {
  it('can parse message', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    expect(hl7.segments[0][0]).toBe('MSH');
    expect(hl7.segments[0][2]).toBe('OTM');
    const pid = hl7.segment('PID')!;
    expect(pid).toBeDefined();
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
    expect(obx.length).toBe(8);
    expect(obx[0][3]).toBe('OTR_NO^OTRoomNumber');
    expect(obx[7][3]).toBe('C_DETAILS^Case Details');
  });

  it('dumps message correctly', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    expect(hl7.dump()).toBe(msg);
  });

  it('creates correct ack message', () => {
    const msg = readTestFile('operating-theatre.bin');
    const hl7 = parse(msg);
    const ack = hl7.createACK(ACKCode.AE, 'test');

    const msh = ack.segments[0];
    expect(msh[0]).toBe('MSH');
    expect(msh[1]).toBe('^~\\&');
    expect(msh[2]).toBe('ESB');
    expect(msh[3]).toBe('ESB');
    expect(msh[4]).toBe('OTM');
    expect(msh[5]).toBe('OTM^CG');

    const msa = ack.segments[1];
    expect(msa[0]).toBe('MSA');
    expect(msa[1]).toBe('AE');
    expect(msa[2]).toBe('20161019171955121101327');
    expect(msa[3]).toBe('test');
  });
});
