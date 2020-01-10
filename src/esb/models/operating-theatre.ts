/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class OperatingTheatre {
  static fromHL7(hl7: HL7Message): OperatingTheatre {
    const msh = hl7.segment('MSH')!;

    const messageType = hl7.components(msh[9]);
    if (messageType[0] !== 'ORU' || messageType[1] !== 'R01') {
      throw new CastError('wrong message type');
    }

    const oru = hl7.segment('ORU');
    if (oru === null) {
      throw new CastError('missing ORU segment');
    }

    const observationId = hl7.components(oru[4]);
    if (observationId[0] !== 'OT') {
      throw new CastError('expected observation id "OT"');
    }

    let roomNumber = '';
    let discipline = '';
    let caseType = '';
    let startTime = '';
    let endTime = '';
    let details = '';
    let surgeonName = '';
    let date = '';

    const obxs = hl7.allSegments('OBX');
    for (const obx of obxs) {
      const id = hl7.components(obx[4]);
      switch (id[0]) {
        case 'OTR_NO': {
          roomNumber = obx[5];
          break;
        }
        case 'C_DISPLINE': {
          discipline = obx[5];
          break;
        }
        case 'C_CASETYPE': {
          caseType = obx[5];
          break;
        }
        case 'C_STARTTIME': {
          startTime = obx[5];
          break;
        }
        case 'C_ENDTIME': {
          endTime = obx[5];
          break;
        }
        case 'C_DETAILS': {
          details = obx[5];
          break;
        }
        case 'C_SURGEON_NAME': {
          surgeonName = obx[5];
          break;
        }
        case 'C_DATE': {
          date = obx[5];
          break;
        }
      }
    }
    return new OperatingTheatre(
      roomNumber,
      discipline,
      caseType,
      startTime,
      endTime,
      details,
      surgeonName,
      date,
    );
  }

  constructor(
    public roomNumber: string,
    public discipline: string,
    public caseType: string,
    public startTime: string,
    public endTime: string,
    public details: string,
    public surgeonName: string,
    public date: string,
  ) {}
}
