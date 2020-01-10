/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class PatientVisit2 {
  static fromHL7(hl7: HL7Message): PatientVisit2 {
    const seg = hl7.segment('PV2');
    if (seg === null) {
      throw new CastError('missing segment "PV2"');
    }

    return new PatientVisit2(
      seg[2],
      seg[9],
    );
  }

  constructor(
    public treatmentCategory: string,
    public expectedDischargeDate: string,
  ) {}
}
