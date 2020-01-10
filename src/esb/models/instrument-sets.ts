/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { HL7Message } from '../../hl7';

export class InstrumentSets {
  static fromHL7(hl7: HL7Message): InstrumentSets {
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
    if (observationId[0] !== 'IS') {
      throw new CastError('expected observation id "IS"');
    }

    let sku = '';
    let serialNo = '';
    let quantity = '';
    let name = '';
    let manufacturer = '';
    let location = '';

    const obxs = hl7.allSegments('OBX');
    for (const obx of obxs) {
      const id = hl7.components(obx[4]);
      switch (id[0]) {
        case 'SKU_CODE': {
          sku = obx[5];
          break;
        }
        case 'SERIAL_NO': {
          serialNo = obx[5];
          break;
        }
        case 'QUANTITY': {
          quantity = obx[5];
          break;
        }
        case 'NAME': {
          name = obx[5];
          break;
        }
        case 'MANUFACTURER': {
          manufacturer = obx[5];
          break;
        }
        case 'LOCATION': {
          location = obx[5];
          break;
        }
      }
    }
    return new InstrumentSets(
      sku,
      serialNo,
      quantity,
      name,
      manufacturer,
      location,
    );
  }

  constructor(
    public sku: string,
    public serialNo: string,
    public quantity: string,
    public name: string,
    public manufacturer: string,
    public location: string,
  ) {}
}
