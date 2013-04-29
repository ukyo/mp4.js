/// <reference path="mp4.ts" />

module Mp4.Composer {

  export class DescriptorComposerMixin extends BaseComposer {
    writeDescriptor(descr: IDescriptor) {
      var bytes: Uint8Array;
      if (descr.bytes) {
        bytes = descr.bytes;
      } else {
        bytes = createDescriptorComposer(descr).compose();
      }
      this.writeBytes(bytes);
    }
  }


  export class DescriptorComposer extends DescriptorComposerMixin {
    constructor() {
      super();
      this.writeUint8(this['constructor'].TAG);
      this.skipBytes(4);
    }

    compose(): Uint8Array {
      this.writeBodyLength();
      return super.compose();
    }

    private writeBodyLength() {
      var bytes = [0x80, 0x80, 0x80, 0x00];
      var bodyLength = this.byteOffset - 5;
      var i = 3;
      while (bodyLength) {
        bytes[i--] |= bodyLength & 0x7F;
        bodyLength >>>= 7;
      }
      this.bytes.set(bytes, 1);
    }
  }


  export class DecoderConfigDescriptorComposer extends DescriptorComposer {
    static TAG = DESCR_TAG_DECODER_CONFIG_DESCRIPTOR;

    constructor(descr: IDecoderConfigDescriptor) {
      super();
      this.writeUint8(descr.objectTypeIndication);
      this.writeBits(descr.streamType, 6);
      this.writeBits(descr.upStream, 1);
      this.skipBits(1);
      this.writeUint24(descr.bufferSizeDB);
      this.writeUint32(descr.maxBitrate);
      this.writeUint32(descr.avgBitrate);
      descr.decSpecificInfo.tag = DESCR_TAG_DECODER_SPECIFIC_INFO;
      this.writeDescriptor(descr.decSpecificInfo);
      descr.profileLevelIndicationIndexDescrs.forEach(d => {
        d.tag = DESCR_TAG_PROFILE_LEVEL_INDICATION_INDEX_DESCRIPTOR;
        this.writeDescriptor(d);
      });
    }
  }


  export class SLConfigDescriptorComposer extends DescriptorComposer {
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
        this.skipBits(2);
      }
      if (descr.durationFlag) {
        this.writeUint32(descr.timeScale);
        this.writeUint16(descr.accessUnitDuration);
        this.writeUint16(descr.compositionUnitDuration)l
      }
      if (descr.useTimeStampsFlag === 0) {
        this.writeBits(descr.startDecodingTimeStamp, descr.timeStampLength);
        this.writeBits(descr.startCompositionTimeStamp, descr.descr.timeStampLength)
      }
    }
  }


  export var createDescriptorComposer = (descr: IDescriptor): DescriptorComposer => {
    var _Composer;
    Object.keys(Composer).some(key => {
      if (Composer[key].TAG === descr.tag) {
        _Composer = Composer[key];
        return true;
      }
    });
    return new (_Composer || DescriptorComposer)(descr);
  };

}