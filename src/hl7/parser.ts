import * as uuidv1 from 'uuid/v1';
export class HL7ParseError extends Error { }

export enum ACKCode {
  AA = 'AA',
  AE = 'AE',
  AR = 'AR',
}

// TODO: parse escape character
export class HL7Message {
  constructor(
    public json: string[][],
    public readonly encodingChars: string = '^~\\&',
    public readonly fieldSep: string = '|',
  ) {
    this._repetitionSep = encodingChars[1];
    this._componentSep = encodingChars[0];
    this._subComponentSep = encodingChars[4];
  }

  segment(id: string): string[] | null {
    id = id.toUpperCase();
    for (const segment of this.json) {
      if (segment[0] === id) {
        return segment;
      }
    }
    return null;
  }

  allSegments(id: string): string[][] {
    const segments = [];
    id = id.toUpperCase();
    for (const segment of this.json) {
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
    for (let i = 0; i < this.json.length - 1; i++) {
      out += `${this.json[i].join(this.fieldSep)}\r`;
    }
    out += `${this.json[this.json.length - 1].join(this.fieldSep)}`;
    return out;
  }

  createACK(ackCode: ACKCode, error?: string): HL7Message {
    const msh = [
      'MSH',
      this.encodingChars,
      this.json[0][4], // sending application, copied from original receiving application
      this.json[0][5], // sending facility, copied from original receiving facility
      this.json[0][2], // receiving application, copied from original sending application
      this.json[0][3], // receiving facility, copied from original sending facility
      toHL7DateString(new Date()), // data/time
      '', // security
      'ACK', // message type
      `ACK-${uuidv1()}`, // message control ID
      this.json[0][10], // processing ID
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
      this.json[0][9], // message control ID
      error, // error message
      '', // expected sequence number
      '', // delayed acknowledgement type
    ];
    return new HL7Message([msh, msa], this.encodingChars, this.fieldSep);
  }

  private _repetitionSep: string;
  private _componentSep: string;
  private _subComponentSep: string;
}

// TODO: parse escape character
export function parse(msg: string): HL7Message {
  const mshIdx = msg.indexOf('MSH');
  if (mshIdx === -1) {
    throw new HL7ParseError('missing "MSH" segment');
  }
  const segmentSep = '\r';
  const fieldSep = msg[mshIdx+3];
  const encodingChars = msg.slice(4, 9);

  const hl7Json = [];
  const segments = msg.split(segmentSep);
  for (const segment of segments) {
    const fields = segment.split(fieldSep);
    const jsonFields = [];
    for (const field of fields) {
      jsonFields.push(field);
    }
    hl7Json.push(jsonFields);
  }
  return new HL7Message(hl7Json, encodingChars);
}

function toHL7DateString(date: Date): string {
  return date.getFullYear() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    (date.getDate()).toString().padStart(2, '0') +
    (date.getHours()).toString().padStart(2, '0') +
    (date.getMinutes()).toString().padStart(2, '0') +
    (date.getSeconds()).toString().padStart(2, '0');
}
