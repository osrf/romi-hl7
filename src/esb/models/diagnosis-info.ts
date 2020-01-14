/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { Message } from '../../hl7';

export class DiagnosisInfo {
  static fromHL7(hl7: Message): DiagnosisInfo {
    const seg = hl7.segment('DG1');
    if (seg === null) {
      throw new CastError('missing segment "DG1"');
    }

    return new DiagnosisInfo(
      seg[3],
      seg[4],
    );
  }

  constructor(
    public diagnosis: string,
    public details: string,
  ) {}

  toHL7Segments(): string[][] {
    return [[
      'DG1',
      '',
      '',
      this.diagnosis,
      this.details,
    ]];
  }
}
