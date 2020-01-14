import * as uuidv1 from 'uuid/v1';
export class HL7ParseError extends Error { }

export enum ACKCode {
  AA = 'AA',
  AE = 'AE',
  AR = 'AR',
}

export type Segment = string[]

// TODO: parse escape character
export class Message {
  constructor(
    public segments: Segment[],
    public readonly encodingChars: string = '^~\\\\&',
    public readonly fieldSep: string = '|',
  ) {
    this._repetitionSep = encodingChars[1];
    this._componentSep = encodingChars[0];
    this._subComponentSep = encodingChars[4];
  }

  segment(id: string): Segment | null {
    id = id.toUpperCase();
    for (const segment of this.segments) {
      if (segment[0] === id) {
        return segment;
      }
    }
    return null;
  }

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

  repetitions(field: string): string[] {
    return field.split(this._repetitionSep);
  }

  components(field: string): string[] {
    return field.split(this._componentSep);
  }

  subcomponents(component: string): string[] {
    return component.split(this._subComponentSep);
  }

  dump(): string {
    let out = '';
    for (let i = 0; i < this.segments.length - 1; i++) {
      out += `${this.segments[i].join(this.fieldSep)}\r`;
    }
    out += `${this.segments[this.segments.length - 1].join(this.fieldSep)}`;
    return out;
  }

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
      toHL7DateString(new Date()), // data/time
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

  private _repetitionSep: string;
  private _componentSep: string;
  private _subComponentSep: string;
}

// TODO: parse escape character
export function parse(msg: string): Message {
  const mshIdx = msg.indexOf('MSH');
  if (mshIdx === -1) {
    throw new HL7ParseError('missing "MSH" segment');
  }
  const segmentSep = '\r';
  const fieldSep = msg[mshIdx+3];
  const encodingChars = msg.slice(4, 9);

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

export function toHL7DateString(date: Date): string {
  return date.getFullYear() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    (date.getDate()).toString().padStart(2, '0') +
    (date.getHours()).toString().padStart(2, '0') +
    (date.getMinutes()).toString().padStart(2, '0') +
    (date.getSeconds()).toString().padStart(2, '0');
}

export function createHeader(
  messageType: string,
  recvApplication: string,
  recvFacility: string,
  encodingChars = '^~\\\\&',
): Segment {
  return [
    'MSH',
    encodingChars,
    'ROMI', // sending application
    'ROMI', // sending facility
    recvApplication, // receiving application
    recvFacility, // receiving facility
    toHL7DateString(new Date()), // date/time of message
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
