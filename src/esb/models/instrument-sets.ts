/**
 * DO NOT EDIT, this is a generated file.
 */

import { CastError } from '..';
import { Message, toHL7DateString } from '../../hl7';

export class InstrumentSets {
  static fromHL7(hl7: Message): InstrumentSets {
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
      const id = hl7.components(obx[3]);
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

  toHL7Segments(): string[][] {
    const now = toHL7DateString(new Date());
    const segments: string[][] = [];

    segments.push([
      'OBR',
      '1', // set id
      '', // placer order number
      '', // filler order number +
      'IS', // universal service id
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
      'SKU_CODE', // observation identifier
      '', // observation sub-id
      this.sku, // observation value
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
      'SERIAL_NO', // observation identifier
      '', // observation sub-id
      this.serialNo, // observation value
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
      'QUANTITY', // observation identifier
      '', // observation sub-id
      this.quantity, // observation value
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
      'NAME', // observation identifier
      '', // observation sub-id
      this.name, // observation value
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
      'ST', // value type
      'MANUFACTURER', // observation identifier
      '', // observation sub-id
      this.manufacturer, // observation value
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
      'LOCATION', // observation identifier
      '', // observation sub-id
      this.location, // observation value
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
