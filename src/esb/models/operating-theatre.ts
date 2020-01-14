/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { Message, toHL7DateString } from '../../hl7';

export class OperatingTheatre {
  static fromHL7(hl7: Message): OperatingTheatre {
    const msh = hl7.segment('MSH')!;

    const messageType = hl7.components(msh[8]);
    if (messageType[0] !== 'ORU' || messageType[1] !== 'R01') {
      throw new CastError('wrong message type');
    }

    const obr = hl7.segment('OBR');
    if (obr === null) {
      throw new CastError('missing OBR segment');
    }

    const observationId = hl7.components(obr[4]);
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
      const id = hl7.components(obx[3]);
      switch (id[0]) {
        case 'OTR_NO': {
          roomNumber = obx[5];
          break;
        }
        case 'C_DISCIPLINE': {
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

  toHL7Segments(): string[][] {
    const now = toHL7DateString(new Date());
    const segments: string[][] = [];

    segments.push([
      'OBR',
      '1', // set id
      '', // placer order number
      '', // filler order number +
      'OT', // universal service id
      '', // priority
      '', // requested date/time
      now, // observation date/time #
      '', // observation end date/time #
      '', // collection volume *
      '', // collector identifier *
      '', // specimen action code *
      '', // danger code
      '', // relevant clinical info
      '', // specimen received date/time *
      '', // specimen source *
      '', // ordering provider
      '', // order callback phone number
      '', // placer field 1
      '', // placer field 2
      '', // filler field 1 +
      '', // filler field 2 +
      now, // results rpt/status chng date/time +
      '', // charge to practice +
      '', // diagnostic serv sect id
      'F', // result status +
      '', // parent result +
      '', // quantity/timing
      '', // result copies to
      '', // parent *
      '', // transportation mode
      '', // reason for study
    ]);

    segments.push([
      'OBX',
      '2', // set id
      'ST', // value type
      'OTR_NO', // observation identifier
      '', // observation sub-id
      this.roomNumber, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '3', // set id
      'ST', // value type
      'C_DISCIPLINE', // observation identifier
      '', // observation sub-id
      this.discipline, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '4', // set id
      'ST', // value type
      'C_CASETYPE', // observation identifier
      '', // observation sub-id
      this.caseType, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '5', // set id
      'TS', // value type
      'C_STARTTIME', // observation identifier
      '', // observation sub-id
      this.startTime, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '6', // set id
      'TS', // value type
      'C_ENDTIME', // observation identifier
      '', // observation sub-id
      this.endTime, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '7', // set id
      'ST', // value type
      'C_DETAILS', // observation identifier
      '', // observation sub-id
      this.details, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '8', // set id
      'ST', // value type
      'C_SURGEON_NAME', // observation identifier
      '', // observation sub-id
      this.surgeonName, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    segments.push([
      'OBX',
      '9', // set id
      'TS', // value type
      'C_DATE', // observation identifier
      '', // observation sub-id
      this.date, // observation value
      '', // units
      '', // references range
      '', // abnormal flags
      '', // probability
      '', // nature of abnormal test
      'F', // observation result status
      '', // date last obs normal values
      '', // user defined access checks
      now, // date/time of the observation
      '', // producer's id
      '', // responsible observer
      '', // observation method
    ]);

    return segments;
  }
}
