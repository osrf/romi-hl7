/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { Message, toHL7DateString } from '../../hl7';

export class Pain {
  static fromHL7(hl7: Message): Pain {
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
    if (observationId[0] !== 'PS') {
      throw new CastError('expected observation id "PS"');
    }

    let type = '';
    let description = '';
    let score = '';
    let site = '';

    const obxs = hl7.allSegments('OBX');
    for (const obx of obxs) {
      const id = hl7.components(obx[3]);
      switch (id[0]) {
        case 'P_TYPE': {
          type = obx[5];
          break;
        }
        case 'P_DESCRIPTION': {
          description = obx[5];
          break;
        }
        case 'P_SCORE': {
          score = obx[5];
          break;
        }
        case 'P_SITE': {
          site = obx[5];
          break;
        }
      }
    }
    return new Pain(
      type,
      description,
      score,
      site,
    );
  }

  constructor(
    public type: string,
    public description: string,
    public score: string,
    public site: string,
  ) {}

  toHL7Segments(): string[][] {
    const now = toHL7DateString(new Date());
    const segments: string[][] = [];

    segments.push([
      'OBR',
      '1', // set id
      '', // placer order number
      '', // filler order number +
      'PS', // universal service id
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
      'P_TYPE', // observation identifier
      '', // observation sub-id
      this.type, // observation value
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
      'P_DESCRIPTION', // observation identifier
      '', // observation sub-id
      this.description, // observation value
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
      'NM', // value type
      'P_SCORE', // observation identifier
      '', // observation sub-id
      this.score, // observation value
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
      'ST', // value type
      'P_SITE', // observation identifier
      '', // observation sub-id
      this.site, // observation value
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
