/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { Message } from '../../hl7';

export class Patient {
  static fromHL7(hl7: Message): Patient {
    const seg = hl7.segment('PID');
    if (seg === null) {
      throw new CastError('missing segment "PID"');
    }

    return new Patient(
      seg[3],
      seg[5],
      seg[7],
      seg[8],
      seg[10],
      seg[11],
      seg[15],
      seg[16],
      seg[17],
    );
  }

  constructor(
    public id: string,
    public name: string,
    public dob: string,
    public gender: string,
    public race: string,
    public address: string,
    public primaryLanguage: string,
    public martialStatus: string,
    public religion: string,
  ) {}

  toHL7Segments(): string[][] {
    return [[
      'PID',
      '',
      '',
      this.id,
      '',
      this.name,
      '',
      this.dob,
      this.gender,
      '',
      this.race,
      this.address,
      '',
      '',
      '',
      this.primaryLanguage,
      this.martialStatus,
      this.religion,
    ]];
  }
}
