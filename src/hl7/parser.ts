export class HL7ParseError extends Error { }

// TODO: parse escape character
export class HL7Message {
  constructor(
    public json: string[][],
    public readonly encodingChars: string = '^~\\&',
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
    return 'STUB';
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
