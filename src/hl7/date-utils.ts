import * as moment from 'moment';

export enum Precision {
  Year = 1,
  Month = 2,
  Day = 3,
  Hours = 4,
  Minutes = 5,
  Seconds = 6,
  Milliseconds = 7,
}

export function toHL7DateString(
  date: moment.Moment,
  includeTZ = true,
  precision = Precision.Seconds,
): string {
  let formatString = '';
  if (precision >= Precision.Year) {
    formatString += 'YYYY';
  }
  if (precision >= Precision.Month) {
    formatString += 'MM';
  }
  if (precision >= Precision.Day) {
    formatString += 'DD';
  }
  if (precision >= Precision.Hours) {
    formatString += 'HH';
  }
  if (precision >= Precision.Minutes) {
    formatString += 'mm';
  }
  if (precision >= Precision.Seconds) {
    formatString += 'ss';
  }
  if (precision >= Precision.Milliseconds) {
    formatString += '.SSS';
  }
  if (includeTZ) {
    formatString += 'ZZ';
  }
  return date.format(formatString);
}

export function fromHL7DateString(dateString: string): moment.Moment {
  const formats = [
    'YYYYZZ',
    'YYYYMMZZ',
    'YYYYMMDDZZ',
    'YYYYMMDDHHZZ',
    'YYYYMMDDHHmmZZ',
    'YYYYMMDDHHmmssZZ',
    'YYYYMMDDHHmmss.SSSZZ'
  ];
  return moment(dateString, formats);
}
