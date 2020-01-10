/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class Pain {
  static fromHL7(hl7: HL7Message): Pain {
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
    if (observationId[0] !== 'PS') {
      throw new CastError('expected observation id "PS"');
    }

    let type = '';
    let description = '';
    let score = '';
    let site = '';

    const obxs = hl7.allSegments('OBX');
    for (const obx of obxs) {
      const id = hl7.components(obx[4]);
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
}
