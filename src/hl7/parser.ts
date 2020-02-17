import * as moment from 'moment';
import * as uuidv1 from 'uuid/v1';
import { toHL7DateString } from './date-utils';

export class ParseError extends Error { }

export enum ACKCode {
  AA = 'AA',
  AE = 'AE',
  AR = 'AR',
}

export type Segment = string[]

// export function fromHL7DateString(dateTime: string): Date {
//   Date.parse()
// }

// TODO: parse escape character
export class Message {
  constructor(
    public segments: Segment[],
    public readonly encodingChars: string = '^~\\&',
    public readonly fieldSep: string = '|',
  ) {
    this._repetitionSep = encodingChars[1];
    this._componentSep = encodingChars[0];
    this._subComponentSep = encodingChars[3];
  }

  /**
   * Gets the first segment in the message with the corresponding id.
   * @param id
   */
  segment(id: string): Segment | null {
    id = id.toUpperCase();
    for (const segment of this.segments) {
      if (segment[0] === id) {
        return segment;
      }
    }
    return null;
  }

  /**
   * Gets all segments in the message with the corresponding id.
   * @param id
   */
  allSegments(id: string): Segment[] {
    const segments = [];
    id = id.toUpperCase();
    for (const segment of this.segments) {
      if (segment[0] === id) {
        segments.push(segment);
      }
    }
    return segments;
  }

  /**
   * Gets the repetitions of a field, a field consists of one or more repetitions, which consists of
   * one or more components, which consists of one or more subcomponents.
   * @param field
   */
  repetitions(field: string): string[] {
    return field.split(this._repetitionSep);
  }

  /**
   * Gets the components of a repetition, a field consists of one or more repetitions, which
   * consists of one or more components, which consists of one or more subcomponents.
   * @param repetition If a field only has one repetition, it is possible to use the field directly
   * without resolving its repetitions.
   */
  components(repetition: string): string[] {
    return repetition.split(this._componentSep);
  }

  /**
   * Gets the subcomponents of a component, a field consists of one or more repetitions, which
   * consists of one or more components, which consists of one or more subcomponents.
   * @param component
   */
  subcomponents(component: string): string[] {
    return component.split(this._subComponentSep);
  }

  /**
   * Serializes this message into HL7 form.
   */
  dump(): string {
    let out = '';
    for (let i = 0; i < this.segments.length - 1; i++) {
      out += `${this.segments[i].join(this.fieldSep)}\r`;
    }
    out += `${this.segments[this.segments.length - 1].join(this.fieldSep)}`;
    return out;
  }

  /**
   * Creates an ACK message for this message.
   * @param ackCode
   * @param error
   */
  createACK(ackCode: ACKCode, error?: string): Message {
    const originalMsh = this.segment('MSH');
    if (!originalMsh) {
      throw new RangeError('missing MSH segment');
    }

    const msh = [
      'MSH',
      this.encodingChars,
      originalMsh[4], // sending application, copied from original receiving application
      originalMsh[5], // sending facility, copied from original receiving facility
      originalMsh[2], // receiving application, copied from original sending application
      originalMsh[3], // receiving facility, copied from original sending facility
      toHL7DateString(moment()), // data/time
      '', // security
      'ACK', // message type
      `ACK-${uuidv1()}`, // message control ID
      originalMsh[10], // processing ID
      '2.3', // version ID
      '', // sequence number
      '', // continuation pointer
    ];
    if (error === undefined) {
      error = '';
    }
    const msa = [
      'MSA',
      ackCode.toString(), // acknowledgement code
      originalMsh[9], // message control ID
      error, // error message
      '', // expected sequence number
      '', // delayed acknowledgement type
    ];
    return new Message([msh, msa], this.encodingChars, this.fieldSep);
  }

  /**
   * Equivalent to segments.push(...args)
   * @param segments
   */
  push(segments: Segment[]): void {
    this.segments.push(...segments);
  }

  private _repetitionSep: string;
  private _componentSep: string;
  private _subComponentSep: string;
}

// TODO: parse escape character
export function parse(msg: string): Message {
  const mshIdx = msg.indexOf('MSH');
  if (mshIdx === -1) {
    throw new ParseError('missing "MSH" segment');
  }
  const segmentSep = '\r';
  const fieldSep = msg[mshIdx+3];
  const encodingChars = msg.slice(4, 8);

  const segments: Segment[] = [];
  const segmentsRaw = msg.split(segmentSep);
  for (const segment of segmentsRaw) {
    const fieldsRaw = segment.split(fieldSep);
    const fields: string[] = [];
    for (const field of fieldsRaw) {
      fields.push(field);
    }
    segments.push(fields);
  }
  return new Message(segments, encodingChars);
}

export function createHeader(
  messageType: string,
  recvApplication: string,
  recvFacility: string,
  encodingChars = '^~\\&',
): Segment {
  return [
    'MSH',
    encodingChars,
    'ROMI', // sending application
    'ROMI', // sending facility
    recvApplication, // receiving application
    recvFacility, // receiving facility
    toHL7DateString(moment()), // date/time of message
    '', // security
    messageType, // message type
    `ROMI-${uuidv1()}`, // message control id
     'P', // processing id
     '2.3', // version id
     '', // sequence number
     '', // continuation pointer
     'AL', // accept acknowledgement type
     'NE', // application acknowledgement type
     '', // country code
     '', // character set
     '', // principal language of message
     '', // alternate character set handling scheme
  ];
}
