module Mp4.Parser {

  export var getDescriptorInfo = (bytes: Uint8Array, offset: number = 0): IDescriptor => {
    var tag = bytes[offset++];
    var b = bytes[offset++];
    var bodyLength = b & 0x7F;
    var headerLength = 2;
    while (b & 0x80) {
      headerLength++;
      b = bytes[offset++];
      bodyLength <<= 7;
      bodyLength |= b & 0x7F;
    }
    return {
      tag: tag,
      byteLength: headerLength + bodyLength,
      headerLength: headerLength,
      bodyLength: bodyLength
    };
  };

  export class DescriptorParserMixin extends BaseParser {
    readDescriptor(): IDescriptor {
      var info = getDescriptorInfo(this.bytes, this.byteOffset);
      return createDescriptorParser(this.readBytes(info.byteLength), info.tag).parse();
    }
  }

  export class DescriptorParser extends DescriptorParserMixin {
    static tag: number;
    tag: number;

    parse(): IDescriptor {
      var info = getDescriptorInfo(this.bytes);
      this.skipBytes(info.headerLength);
      info.bytes = this.bytes;
      return info;
    }
  }


  export class DecoderSpecificInfoParser extends DescriptorParser {
    static tag = 0x05;
  }


  export class ProfileLevelINdicationIndexDescriptor extends DescriptorParser {
    static tag = 0x14;

    parse(): IProfileLevelIndicationIndexDescriptor {
      var ret = <IProfileLevelIndicationIndexDescriptor>super.parse();
      ret.profileLevelIndicationIndex = this.readUint8();
      return ret;
    }
  }


  export class DecoderConfigDescriptorParser extends DescriptorParser {
    static tag = 0x04;

    parse(): IDecoderConfigDescriptor {
      var ret = <IDecoderConfigDescriptor>super.parse();
      ret.objectTypeIndication = this.readUint8();
      ret.streamType = this.readBits(6);
      ret.upStream = this.readBits(1);
      this.skipBits(1);
      ret.bufferSizeDB = this.readUint24();
      ret.maxBitrate = this.readUint32();
      ret.avgBitrate = this.readUint32();

      var info: IDescriptor;
      var descrParser: DescriptorParser;
      var descr: IDescriptor;
      ret.profileLevelIndicationIndexDescrs = [];

      while (!this.eof()) {
        info = getDescriptorInfo(this.bytes.subarray(this.byteOffset));
        descrParser = createDescriptorParser(this.readBytes(info.byteLength), info.tag);
        descr = descrParser.parse();
        if (descrParser instanceof DecoderSpecificInfoParser) {
          ret.decSpecificInfo = <IDecoderSpecofocInfo>descr;
        } else if (descrParser instanceof ProfileLevelINdicationIndexDescriptor) {
          ret.profileLevelIndicationIndexDescrs.push(<IProfileLevelIndicationIndexDescriptor>descr);
        } else {
          throw new TypeError();
        }
      }
      return ret;
    }
  }


  export class SLConfigDescriptorParser extends DescriptorParser {
    static tag = 0x06;

    parse(): ISLConfigDescriptor {
      var ret = <ISLConfigDescriptor>super.parse();
      ret.preDefined = this.readUint8();
      if (ret.preDefined === 0) {
        ret.useAccessUnitStartFlag = this.readBits(1);
        ret.useAccessUnitEndFlag = this.readBits(1);
        ret.useRandomAccessPointFlag = this.readBits(1);
        ret.hasRandomAccessUnitsOnlyFlag = this.readBits(1);
        ret.usePaddingFlag = this.readBits(1);
        ret.useTimeStampsFlag = this.readBits(1);
        ret.useIdleFlag = this.readBits(1);
        ret.durationFlag = this.readBits(1);
        ret.timeStampResolution = this.readUint32();
        ret.ocrResolution = this.readUint32();
        ret.timeStampLength = this.readUint8();
        ret.ocrLength = this.readUint8();
        ret.auLength = this.readUint8();
        ret.instantBitrateLength = this.readUint8();
        ret.degradationPriorityLength = this.readBits(4);
        ret.auSeqNumLength = this.readBits(5);
        ret.packetSeqNumLength = this.readBits(5);
        this.skipBits(2);
      }
      if (ret.durationFlag) {
        ret.timeScale = this.readUint32();
        ret.accessUnitDuration = this.readUint16();
        ret.compositionUnitDuration = this.readUint16();
      }
      if (ret.useTimeStampsFlag === 0) {
        ret.startDecodingTimeStamp = this.readBits(ret.timeStampLength);
        ret.startCompositionTimeStamp = this.readBits(ret.timeStampLength);
      }
      return ret;
    }
  }


  export class IPIDescriptorPointerParser extends DescriptorParser {

  }


  export class IPIdentificationDataSetParser extends DescriptorParser { }


  export class IPMPDescriptorPointerParser extends DescriptorParser { }


  export class LanguageDescriptorParser extends DescriptorParser { }


  export class QosDescriptorParser extends DescriptorParser { }


  export class ExtensionDescriptorParser extends DescriptorParser { }


  export class ESDescriptorParser extends DescriptorParser {
    static tag = 0x03;

    parse(): IESDescriptor {
      var ret = <IESDescriptor>super.parse();
      var info: IDescriptor;
      var descrParser: DescriptorParser;
      var descr: IDescriptor;
      var tmp: number;

      ret.esID = this.readUint16();
      ret.streamDependenceFlag = this.readBits(1);
      ret.urlFlag = this.readBits(1);
      this.skipBits(1);
      ret.streamPriority = this.readBits(5);

      if (ret.streamDependenceFlag) {
        ret.dependsOnEsID = this.readUint16();
      }

      if (ret.urlFlag) {
        ret.urlLength = this.readUint8();
        ret.urlString = this.readString(ret.urlLength);
      }

      ret.ipIDSs = [];
      ret.ipmpDescrPtrs = [];
      ret.langDescrs = [];
      ret.extDescrs = [];

      while (!this.eof()) {
        info = getDescriptorInfo(this.bytes.subarray(this.byteOffset));
        descrParser = createDescriptorParser(this.readBytes(info.byteLength), info.tag);
        descr = descrParser.parse();
        if (descrParser instanceof DecoderConfigDescriptorParser) {
          ret.decConfigDescr = <IDecoderConfigDescriptor>descr;
        } else if (descrParser instanceof SLConfigDescriptorParser) {
          ret.slConfigDescr = <ISLConfigDescriptor>descr;
        } else if (descrParser instanceof IPIDescriptorPointerParser) {
          ret.ipiPtr = descr;
        } else if (descrParser instanceof IPIdentificationDataSetParser) {
          ret.ipIDSs.push(<IIPIdentificationDataSet>descr);
        } else if (descrParser instanceof LanguageDescriptorParser) {
          ret.langDescrs.push(<ILanguageDescriptor>descr);
        } else if (descrParser instanceof QosDescriptorParser) {
          ret.qosDescr = <IQosDescriptor>descr;
        } else if (descrParser instanceof ExtensionDescriptorParser) {
          ret.extDescrs.push(<IExtensionDescriptor>descr);
        } else {
          throw new TypeError();
        }
      }

      return ret;
    }
  }


  export var createDescriptorParser = (bytes: Uint8Array, tag: number): DescriptorParser => {
    var _Parser;
    Object.keys(Parser).some(key => {
      var __Parser = Parser[key];
      if (__Parser.tag === tag || Array.isArray(__Parser) && __Parser.some(tag => __Parser.tag === tag)) {
        _Parser = __Parser;
        return true;
      }
    });
    return new (_Parser || DescriptorParser)(bytes);
  };

}