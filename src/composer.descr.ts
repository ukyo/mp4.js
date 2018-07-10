import { BaseBuilder } from "./composer";
import {
  DESCR_TAG_DECODER_CONFIG_DESCRIPTOR,
  DESCR_TAG_DECODER_SPECIFIC_INFO,
  DESCR_TAG_PROFILE_LEVEL_INDICATION_INDEX_DESCRIPTOR,
  DESCR_TAG_SL_CONFIG_DESCRIPTOR,
  DESCR_TAG_ES_DESCRIPTOR
} from "./statics";
import {
  IDecoderConfigDescriptor,
  ISLConfigDescriptor,
  IDecoderSpecificInfo,
  IESDescriptor,
  IDescriptor
} from "./interface.descr";

const dict: {
  [tag: number]: { new (box: IDescriptor): DescriptorBuilder };
} = {};
function Tag(tag: number) {
  return function(constructor: any) {
    constructor.TAG = tag;
    dict[tag] = constructor;
    return constructor;
  };
}

export class DescriptorBuilderMixin extends BaseBuilder {
  writeDescriptor(descr: any) {
    var bytes: Uint8Array;
    if (descr instanceof Uint8Array) {
      bytes = descr;
    } else if (descr.bytes) {
      bytes = descr.bytes;
    } else {
      bytes = createDescriptorBuilder(descr).build();
    }
    this.writeBytes(bytes);
  }
}

export class DescriptorBuilder extends DescriptorBuilderMixin {
  constructor() {
    super();
    this.writeUint8((<any>this.constructor).TAG);
    this.writeBytes(new Uint8Array(4));
  }

  build(): Uint8Array {
    this.writeBodyLength();
    return super.build();
  }

  private writeBodyLength() {
    var bytes = [0x80, 0x80, 0x80, 0x00];
    var bodyLength = this.byteOffset - 5;
    var i = 3;
    while (bodyLength) {
      bytes[i--] |= bodyLength & 0x7f;
      bodyLength >>>= 7;
    }
    this.bytes.set(bytes, 1);
  }
}

@Tag(DESCR_TAG_DECODER_CONFIG_DESCRIPTOR)
export class DecoderConfigDescriptorBuilder extends DescriptorBuilder {
  constructor(descr: IDecoderConfigDescriptor) {
    super();
    this.writeUint8(descr.objectTypeIndication);
    this.writeBits(descr.streamType, 6);
    this.writeBits(descr.upStream, 1);
    this.writeBits(1, 1);
    this.writeUint24(descr.bufferSizeDB);
    this.writeUint32(descr.maxBitrate);
    this.writeUint32(descr.avgBitrate);
    descr.decSpecificInfo.tag = DESCR_TAG_DECODER_SPECIFIC_INFO;
    this.writeDescriptor(descr.decSpecificInfo);
    if (descr.profileLevelIndicationIndexDescrs) {
      descr.profileLevelIndicationIndexDescrs.forEach(d => {
        d.tag = DESCR_TAG_PROFILE_LEVEL_INDICATION_INDEX_DESCRIPTOR;
        this.writeDescriptor(d);
      });
    }
  }
}

@Tag(DESCR_TAG_SL_CONFIG_DESCRIPTOR)
export class SLConfigDescriptorBuilder extends DescriptorBuilder {
  constructor(descr: ISLConfigDescriptor) {
    super();
    this.writeUint8(descr.preDefined);
    if (descr.preDefined === 0) {
      this.writeBits(descr.useAccessUnitStartFlag, 1);
      this.writeBits(descr.useAccessUnitEndFlag, 1);
      this.writeBits(descr.useRandomAccessPointFlag, 1);
      this.writeBits(descr.hasRandomAccessUnitsOnlyFlag, 1);
      this.writeBits(descr.usePaddingFlag, 1);
      this.writeBits(descr.useTimeStampsFlag, 1);
      this.writeBits(descr.useTimeStampsFlag, 1);
      this.writeBits(descr.useIdleFlag, 1);
      this.writeBits(descr.durationFlag, 1);
      this.writeUint32(descr.timeStampResolution);
      this.writeUint32(descr.ocrResolution);
      this.writeUint8(descr.timeStampLength);
      this.writeUint8(descr.ocrLength);
      this.writeUint8(descr.auLength);
      this.writeUint8(descr.instantBitrateLength);
      this.writeBits(descr.degradationPriorityLength, 4);
      this.writeBits(descr.auSeqNumLength, 5);
      this.writeBits(descr.packetSeqNumLength, 5);
      this.writeBits(3, 2);
    }
    if (descr.durationFlag) {
      this.writeUint32(descr.timeScale);
      this.writeUint16(descr.accessUnitDuration);
      this.writeUint16(descr.compositionUnitDuration);
    }
    if (descr.useTimeStampsFlag === 0) {
      this.writeBits(descr.startDecodingTimeStamp, descr.timeStampLength);
      this.writeBits(descr.startCompositionTimeStamp, descr.timeStampLength);
    }
  }
}

@Tag(DESCR_TAG_DECODER_SPECIFIC_INFO)
export class DecoderSpecificInfoBuilder extends DescriptorBuilder {
  constructor(descr: IDecoderSpecificInfo) {
    super();
    this.writeBytes(descr.data);
  }
}

@Tag(DESCR_TAG_ES_DESCRIPTOR)
export class ESDescriptorBuilder extends DescriptorBuilder {
  constructor(descr: IESDescriptor) {
    super();
    this.writeUint16(descr.esID);
    this.writeBits(descr.streamDependenceFlag || 0, 1);
    this.writeBits(descr.urlFlag || 0, 1);
    this.writeBits(descr.ocrStreamFlag || 0, 1);
    this.writeBits(descr.streamPriority, 5);

    if (descr.urlFlag) {
      this.writeUint8(descr.urlLength);
      this.writeString(descr.urlString);
    }

    if (descr.ocrStreamFlag) {
      this.writeUint16(descr.ocrEsID);
    }

    descr.decConfigDescr.tag = DESCR_TAG_DECODER_CONFIG_DESCRIPTOR;
    this.writeDescriptor(descr.decConfigDescr);
    descr.slConfigDescr.tag = DESCR_TAG_SL_CONFIG_DESCRIPTOR;
    this.writeDescriptor(descr.slConfigDescr);
  }
}

export var createDescriptorBuilder = (
  descr: IDescriptor
): DescriptorBuilder => {
  return new (dict[descr.tag as number] || DescriptorBuilder)(descr);
};
