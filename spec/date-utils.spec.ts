import * as moment from 'moment';
import { fromHL7DateString, toHL7DateString } from '../src';

// FIXME: HL7 allows date string with precision less than hours to include timezone. This creates a
// predicament when parsing, suppose a date string of 20200101+0200, it means that year 2020, month
// 01 and day 01, with timezone of +0200. Since we don't know the hours, we don't know if how we
// should account for the offset, moment assumes the hour to be 0 when its not present, so it
// computes the date as UTC 2019-12-31. Intuitively, it makes sense for the date to be 2020-01-01,
// it is also in the hl7 spec how should the date be interpreted in such scenario.
describe('date utils tests', () => {
  it('formats hl7 date string', () => {
    const date = moment('2020-01-02T03:04:05.006', ).toDate();
    const hl7date = toHL7DateString(date);
    expect(hl7date.startsWith('20200102030405')).toBeTrue;
    expect(hl7date.length).toBe(19);
  });

  it('formats hl7 date string without timezone', () => {
    const date = moment('2020-01-02T03:04:05.006').toDate();
    expect(toHL7DateString(date, false)).toBe('20200102030405');
  });

  it('parses hl7 date string', () => {
    // when there is no timezone, it is assumed to be sender local time
    const date = fromHL7DateString('20200102030405.006');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(3);
    expect(date.getMinutes()).toBe(4);
    expect(date.getSeconds()).toBe(5);
    expect(date.getMilliseconds()).toBe(6);
  });

  it('parses hl7 date string with timezone', () => {
    const date = fromHL7DateString('20200102030405.006+0100');
    expect(date.getUTCFullYear()).toBe(2020);
    expect(date.getUTCMonth()).toBe(0);
    expect(date.getUTCDate()).toBe(2);
    expect(date.getUTCHours()).toBe(2);
    expect(date.getUTCMinutes()).toBe(4);
    expect(date.getUTCSeconds()).toBe(5);
    expect(date.getUTCMilliseconds()).toBe(6);
  });

  it('parses year precision date string', () => {
    const date = fromHL7DateString('2020');
    expect(date.getFullYear()).toBe(2020);
  });

  // FIXME: how should this be parsed?
  // it('parses year precision date string with timezone', () => {
  //   const date = fromHL7DateString('2020+0100');
  //   expect(date.getUTCFullYear()).toBe(2020);
  // });

  it('parses month precision date string', () => {
    const date = fromHL7DateString('202001');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
  });

  // FIXME: how should this be parsed?
  // it('parses month precision date string with timezone', () => {
  //   const date = fromHL7DateString('202001');
  //   expect(date.getUTCFullYear()).toBe(2020);
  //   expect(date.getUTCMonth()).toBe(0);
  // });

  it('parses day precision date string', () => {
    const date = fromHL7DateString('20200102');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
  });

  it('parses hours precision date string', () => {
    const date = fromHL7DateString('2020010203');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(3);
  });

  // FIXME: how should this be parsed?
  // it('parses day precision date string with timezone', () => {
  //   const date = fromHL7DateString('20200102');
  //   expect(date.getUTCFullYear()).toBe(2020);
  //   expect(date.getUTCMonth()).toBe(0);
  //   expect(date.getUTCDate()).toBe(2);
  // });

  it('parses hours precision date string with timezone', () => {
    const date = fromHL7DateString('2020010203+0100');
    expect(date.getUTCFullYear()).toBe(2020);
    expect(date.getUTCMonth()).toBe(0);
    expect(date.getUTCDate()).toBe(2);
    expect(date.getUTCHours()).toBe(2);
  });

  it('parses hours precision date string with timezone', () => {
    const date = fromHL7DateString('2020010102+0300');
    expect(date.getUTCFullYear()).toBe(2019);
    expect(date.getUTCMonth()).toBe(11);
    expect(date.getUTCDate()).toBe(31);
    expect(date.getUTCHours()).toBe(23);
  });

  it('parses minutes precision date string', () => {
    const date = fromHL7DateString('202001020304');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(3);
    expect(date.getMinutes()).toBe(4);
  });

  it('parses minutes precision date string with timezone', () => {
    const date = fromHL7DateString('202001010203+0300');
    expect(date.getUTCFullYear()).toBe(2019);
    expect(date.getUTCMonth()).toBe(11);
    expect(date.getUTCDate()).toBe(31);
    expect(date.getUTCHours()).toBe(23);
    expect(date.getUTCMinutes()).toBe(3);
  });

  it('parses seconds precision date string', () => {
    const date = fromHL7DateString('20200102030405');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(3);
    expect(date.getMinutes()).toBe(4);
    expect(date.getSeconds()).toBe(5);
  });

  it('parses seconds precision date string with timezone', () => {
    const date = fromHL7DateString('20200101020304+0300');
    expect(date.getUTCFullYear()).toBe(2019);
    expect(date.getUTCMonth()).toBe(11);
    expect(date.getUTCDate()).toBe(31);
    expect(date.getUTCHours()).toBe(23);
    expect(date.getUTCMinutes()).toBe(3);
    expect(date.getUTCSeconds()).toBe(4);
  });

  it('parses milliseconds precision date string', () => {
    const date = fromHL7DateString('20200102030405.006');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(3);
    expect(date.getMinutes()).toBe(4);
    expect(date.getSeconds()).toBe(5);
    expect(date.getMilliseconds()).toBe(6);
  });

  it('parses milliseconds precision date string with timezone', () => {
    const date = fromHL7DateString('20200101020304.005+0300');
    expect(date.getUTCFullYear()).toBe(2019);
    expect(date.getUTCMonth()).toBe(11);
    expect(date.getUTCDate()).toBe(31);
    expect(date.getUTCHours()).toBe(23);
    expect(date.getUTCMinutes()).toBe(3);
    expect(date.getUTCSeconds()).toBe(4);
    expect(date.getUTCMilliseconds()).toBe(5);
  });
});
