/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class DiagnosisInfo {
  static fromHL7(hl7: HL7Message): DiagnosisInfo {
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
}
