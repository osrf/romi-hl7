/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class PatientVisit {
  static fromHL7(hl7: HL7Message): PatientVisit {
    const seg = hl7.segment('PV1');
    if (seg === null) {
      throw new CastError('missing segment "PV1"');
    }

    return new PatientVisit(
      seg[2],
      seg[3],
      seg[4],
      seg[10],
      seg[14],
      seg[19],
      seg[20],
      seg[36],
      seg[37],
      seg[44],
      seg[45],
    );
  }

  constructor(
    public typeCareLevel: string,
    public location: string,
    public caseType: string,
    public service: string,
    public admitVia: string,
    public case_: string,
    public treatmentClass: string,
    public dischargeDisposition: string,
    public dischargeLocation: string,
    public admitDateTime: string,
    public actualDischargeDate: string,
  ) {}
}
