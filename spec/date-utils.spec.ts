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
    const date = moment('2020-01-02T03:04:05.006', );
    const hl7date = toHL7DateString(date);
    expect(hl7date.startsWith('20200102030405')).toBeTrue;
    expect(hl7date.length).toBe(19);
  });

  it('formats hl7 date string without timezone', () => {
    const date = moment('2020-01-02T03:04:05.006');
    expect(toHL7DateString(date, false)).toBe('20200102030405');
  });

  it('parses hl7 date string', () => {
    // when there is no timezone, it is assumed to be sender local time
    const date = fromHL7DateString('20200102030405.006');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(3);
    expect(date.minute()).toBe(4);
    expect(date.second()).toBe(5);
    expect(date.millisecond()).toBe(6);
  });

  it('parses hl7 date string with timezone', () => {
    const date = fromHL7DateString('20200102030405.006+0100').utc();
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(2);
    expect(date.minute()).toBe(4);
    expect(date.second()).toBe(5);
    expect(date.millisecond()).toBe(6);
  });

  it('parses year precision date string', () => {
    const date = fromHL7DateString('2020');
    expect(date.year()).toBe(2020);
  });

  // FIXME: how should this be parsed?
  // fit('parses year precision date string with timezone', () => {
  //   const date = fromHL7DateString('2020+0100').utc();
  //   expect(date.year()).toBe(2020);
  // });

  it('parses month precision date string', () => {
    const date = fromHL7DateString('202001');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
  });

  // FIXME: how should this be parsed?
  // it('parses month precision date string with timezone', () => {
  //   const date = fromHL7DateString('202001').utc();
  //   expect(date.year()).toBe(2020);
  //   expect(date.month()).toBe(0);
  // });

  it('parses day precision date string', () => {
    const date = fromHL7DateString('20200102');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
  });

  // FIXME: how should this be parsed?
  // it('parses day precision date string with timezone', () => {
  //   const date = fromHL7DateString('202001').utc();
  //   expect(date.year()).toBe(2020);
  //   expect(date.month()).toBe(0);
  //   expect(date.date()).toBe(2);
  // });

  it('parses hours precision date string', () => {
    const date = fromHL7DateString('2020010203');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(3);
  });

  it('parses hours precision date string with timezone', () => {
    const date = fromHL7DateString('2020010203+0100').utc();
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(2);
  });

  it('parses hours precision date string with timezone', () => {
    const date = fromHL7DateString('2020010102+0300').utc();
    expect(date.year()).toBe(2019);
    expect(date.month()).toBe(11);
    expect(date.date()).toBe(31);
    expect(date.hour()).toBe(23);
  });

  it('parses minutes precision date string', () => {
    const date = fromHL7DateString('202001020304');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(3);
    expect(date.minute()).toBe(4);
  });

  it('parses minutes precision date string with timezone', () => {
    const date = fromHL7DateString('202001010203+0300').utc();
    expect(date.year()).toBe(2019);
    expect(date.month()).toBe(11);
    expect(date.date()).toBe(31);
    expect(date.hour()).toBe(23);
    expect(date.minute()).toBe(3);
  });

  it('parses seconds precision date string', () => {
    const date = fromHL7DateString('20200102030405');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(3);
    expect(date.minute()).toBe(4);
    expect(date.second()).toBe(5);
  });

  it('parses seconds precision date string with timezone', () => {
    const date = fromHL7DateString('20200101020304+0300').utc();
    expect(date.year()).toBe(2019);
    expect(date.month()).toBe(11);
    expect(date.date()).toBe(31);
    expect(date.hour()).toBe(23);
    expect(date.minute()).toBe(3);
    expect(date.second()).toBe(4);
  });

  it('parses milliseconds precision date string', () => {
    const date = fromHL7DateString('20200102030405.006');
    expect(date.year()).toBe(2020);
    expect(date.month()).toBe(0);
    expect(date.date()).toBe(2);
    expect(date.hour()).toBe(3);
    expect(date.minute()).toBe(4);
    expect(date.second()).toBe(5);
    expect(date.millisecond()).toBe(6);
  });

  it('parses milliseconds precision date string with timezone', () => {
    const date = fromHL7DateString('20200101020304.005+0300').utc();
    expect(date.year()).toBe(2019);
    expect(date.month()).toBe(11);
    expect(date.date()).toBe(31);
    expect(date.hour()).toBe(23);
    expect(date.minute()).toBe(3);
    expect(date.second()).toBe(4);
    expect(date.millisecond()).toBe(5);
  });
});
