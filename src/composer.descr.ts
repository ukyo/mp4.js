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
    constructor(descr: IDescriptor) {
      super();
      this.writeUint8(typeof descr.tag !== 'undefined' ? descr.tag : this['constructor'].TAG);
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


  export class DecoderConfigDescriptorComposer {
    static TAG = DESCR_TAG_DECODER_CONFIG_DESCRIPTOR;
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