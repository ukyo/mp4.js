module mp4.parser {

  var handlerType: string;

  var getBoxInfo = (bytes: Uint8Array, offset: number = 0): IBox => {
    var view = new DataView2(bytes, offset);
    return {
      byteLength: view.getUint32(0),
      type: view.getString(4, 4)
    };
  };

  var getFullBoxInfo = (bytes: Uint8Array, offset: number = 0): IFullBox => {
    var view = new DataView2(bytes, offset);
    return {
      byteLength: view.getUint32(0),
      type: view.getString(4, 4),
      version: view.getUint8(8),
      flags: view.getUint24(9)
    };
  };


  export class RootParser extends BaseParser {
    constructor(bytes: Uint8Array) { super(bytes); }

    parse(): IBox[] {
      var info: IBox;
      var ret: IBox[] = [];
      while (!this.eof()) {
        info = getBoxInfo(this.readBytes(8));
        this.skipBytes(-8);
        ret.push(createBoxParser(this.readBytes(info.byteLength), info.type).parse());
      }
      return ret;
    }
  }


  export class BoxParser extends BaseParser {
    static type = '';
    byteLength: number;
    type: string;

    constructor(bytes: Uint8Array) {
      super(bytes);
      this.byteLength = this.bytes.length;
      this.skipBytes(4);
      this.type = this.readString(4);
    }

    parse(): IBox {
      return {
        byteLength: this.byteLength,
        type: this.type,
        bytes: this.bytes
      };
    }
  }


  export class FullBoxParser extends BoxParser {
    version: number;
    flags: number;

    constructor(bytes: Uint8Array) {
      super(bytes);
      this.version = this.readUint8();
      this.flags = this.readUint24();
    }

    parse(): IFullBox {
      var ret = <IFullBox>super.parse();
      ret.version = this.version;
      ret.flags = this.flags;
      return ret;
    }
  }


  export class FileTypeBoxParser extends BoxParser {
    static type = 'ftyp';

    parse(): IFileTypeBox {
      var ret = <IFileTypeBox>super.parse();
      ret.majorBrand = this.readString(4);
      ret.minorVersion = this.readUint32();
      ret.compatibleBrands = [];
      while (!this.eof()) ret.compatibleBrands.push(this.readString(4));
      return ret;
    }
  }


  export class BoxListParser extends BoxParser {
    parse(): IBoxList {
      var ret = <IBoxList>super.parse();
      var boxes: IBox[] = [];
      var info: IBox;
      while (!this.eof()) {
        info = getBoxInfo(this.readBytes(8));
        this.skipBytes(-8);
        boxes.push(createBoxParser(this.readBytes(info.byteLength), info.type).parse());
      }
      ret.boxes = boxes;
      return ret;
    }
  }


  export class MovieBoxParser extends BoxListParser {
    static type = 'moov';
  }


  export class MediaDataBoxParser extends BoxParser {
    static type = 'mdat';

    parse(): IMediaDataBox {
      var ret = <IMediaDataBox>super.parse();
      ret.data = this.bytes.subarray(8);
      return ret;
    }
  }


  export class MovieHeaderBoxParser extends FullBoxParser {
    static type = 'mvhd';

    parse(): IMovieHeaderBox {
      var ret = <IMovieHeaderBox>super.parse();
      ret.matrix = [];
      ret.creationTime = this.readUint32();
      ret.modificationTime = this.readUint32();
      ret.timescale = this.readUint32();
      ret.duration = this.readUint32();
      ret.rate = this.readUint32();
      ret.volume = this.readUint16();
      this.skipBytes(2);
      this.skipBytes(4 * 2);
      for (var i = 0; i < 9; ++i) ret.matrix.push(this.readInt32());
      this.skipBytes(4 * 6);
      ret.nextTrackID = this.readUint32();
      return ret;
    }
  }


  export class TrackBoxParser extends BoxListParser {
    static type = 'trak';
  }


  export class TrackHeaderBoxParser extends FullBoxParser {
    static type = 'tkhd';

    parse(): ITrackHeaderBox {
      var ret = <ITrackHeaderBox>super.parse();
      ret.matrix = [];
      ret.creationTime = this.readUint32();
      ret.modificationTime = this.readUint32();
      ret.trackID = this.readUint32();
      this.skipBytes(4);
      ret.duration = this.readUint32();
      this.skipBytes(4 * 2);
      ret.layer = this.readInt16();
      ret.alternateGroup = this.readInt16();
      ret.volume = this.readInt16() / 0x100;
      this.skipBytes(2);
      for (var i = 0; i < 9; ++i) ret.matrix.push(this.readInt32());
      ret.width = this.readUint32() / 0x10000;
      ret.height = this.readUint32() / 0x10000;
      return ret;
    }
  }


  export class TrackReferenceBox extends BoxListParser {
    static type = 'tref';
  }


  export class TrackReferenceTypeBox extends BoxParser {
    parse(): ITrackReferenceTypeBox {
      var ret = <ITrackReferenceTypeBox>super.parse();
      ret.trackIDs = [];
      while (!this.eof()) ret.trackIDs.push(this.readUint32());
      return ret;
    }
  }


  export class TrackReferenceTypeHintBox extends TrackReferenceTypeBox {
    static type = 'hint';
  }


  export class TrackReferenceTypeDiscribeBox extends TrackReferenceTypeBox {
    static type = 'cdsc';
  }


  export class MediaBoxParser extends BoxListParser {
    static type = 'mdia';
  }


  export class MediaHeaderBoxParser extends FullBoxParser {
    static type = 'mdhd';

    parse(): IMediaHeaderBox {
      var ret = <IMediaHeaderBox>super.parse();
      ret.creationTime = this.readUint32();
      ret.modificationTime = this.readUint32();
      ret.timescale = this.readUint32();
      ret.duration = this.readUint32();
      this.skipBits(1);
      ret.language = String.fromCharCode.apply(null, [this.readBits(5), this.readBits(5), this.readBits(5)].map(x => x + 0x60));
      return ret;
    }
  }


  export class HandlerBoxParser extends FullBoxParser {
    static type = 'hdlr';

    parse(): IHandlerBox {
      var ret = <IHandlerBox>super.parse();
      this.skipBytes(4);
      ret.handlerType = this.readString(4);
      this.skipBytes(4 * 3);
      ret.name = this.readUTF8StringNullTerminated();
      return ret;
    }
  }


  export class MediaInformationBoxParser extends BoxListParser {
    static type = 'minf';
  }


  export class VideoMediaHeaderBoxParser extends FullBoxParser {
    static type = 'vmhd';

    parse(): IVideoMediaHeaderBox {
      var ret = <IVideoMediaHeaderBox>super.parse();
      var view = new DataView2(this.bytes);
      ret.opcolor = [];
      ret.graphicsmode = this.readUint16();
      for (var i = 0; i < 3; ++i) ret.opcolor.push(this.readUint16());
      return ret;
    }
  }


  export class SoundMediaHeaderBoxParser extends FullBoxParser {
    static type = 'smhd';

    parse(): ISoundMediaHeaderBox {
      var ret = <ISoundMediaHeaderBox>super.parse();
      ret.balance = this.readInt16();
      return ret;
    }
  }


  export class HindMediaHeaderBoxParser extends FullBoxParser {
    static type = 'hmhd';

    parse(): IHintMediaHeaderBox {
      var ret = <IHintMediaHeaderBox>super.parse();
      ret.maxPDUsize = this.readUint16();
      ret.avgPDUsize = this.readUint16();
      ret.maxbitrate = this.readUint32();
      ret.avgbitrate = this.readUint32();
      return ret;
    }
  }


  export class NullMediaHeaderBoxParser extends FullBoxParser {
    static type = 'nmhd';
  }


  export class DataInformationBoxParser extends BoxListParser {
    static type = 'dinf';
  }


  export class DataReferenceBoxParser extends FullBoxParser {
    static type = 'dref';

    parse(): IDataReferenceBox {
      var ret = <IDataReferenceBox>super.parse();
      ret.entryCount = this.readUint32();
      ret.entries = [];
      while (!this.eof()) {
        var info = getBoxInfo(this.readBytes(8));
        this.skipBytes(-8);
        ret.entries.push(<IDataEntryBox>createBoxParser(this.readBytes(info.byteLength), info.type).parse());
      }
      return ret;
    }
  }


  export class DataEntryUrlBoxParser extends FullBoxParser {
    static type = 'url ';

    parse(): IDataEntryUrlBox {
      var ret = <IDataEntryUrlBox>super.parse();
      ret.location = this.readUTF8StringNullTerminated();
      return ret;
    }
  }


  export class DataEntryUrnBoxParser extends FullBoxParser {
    static type = 'urn ';

    parse(): IDataEntryUrnBox {
      var ret = <IDataEntryUrnBox>super.parse();
      ret.name = this.readUTF8StringNullTerminated();
      ret.location = this.readUTF8StringNullTerminated();
      return ret;
    }
  }


  export class SampleTableBoxParser extends BoxListParser {
    static type = 'stbl';
  }


  export class TimeToSampleBoxParser extends FullBoxParser {
    static type = 'stts';

    parse(): ITimeToSampleBox {
      var ret = <ITimeToSampleBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          sampleCount: this.readUint32(),
          sampleDelta: this.readUint32()
        });
      }
      return ret;
    }
  }


  export class CompositionOffsetBoxParser extends FullBoxParser {
    static type = 'ctts';

    parse(): ICompositionOffsetBox {
      var ret = <ICompositionOffsetBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          sampleCount: this.readUint32(),
          sampleOffset: this.readUint32()
        });
      }
      return ret;
    }
  }

  export class SampleEntryParser extends BoxParser {
    parse(): ISampleEntry {
      var ret = <ISampleEntry>super.parse();
      this.skipBytes(6);
      ret.dataReferenceIndex = this.readUint16();
      return ret;
    }
  }


  export class HintSampleEntryParser extends SampleEntryParser {
    parse(): IHintSampleEntry {
      var ret = <IHintSampleEntry>super.parse();
      ret.data = this.bytes.subarray(16);
      return ret;
    }
  }


  export class VisualSampleEntryParser extends SampleEntryParser {
    parse(): IVisualSampleEntry {
      var ret = <IVisualSampleEntry>super.parse();
      this.skipBytes(16);
      ret.width = this.readUint16();
      ret.height = this.readUint16();
      ret.horizresolution = this.readUint32();
      ret.vertresolution = this.readUint32();
      ret.compressorname = this.readString(32);
      ret.depth = this.readUint16();
      return ret;
    }
  }


  export class AudioSampleEntryParser extends SampleEntryParser {
    parse(): IAudioSampleEntry {
      var ret = <IAudioSampleEntry>super.parse();
      this.skipBytes(8);
      ret.channelcount = this.readUint16();
      ret.samplesize = this.readUint16();
      this.skipBytes(4);
      ret.samplerate = this.readUint32() >>> 16;
      return ret;
    }
  }


  export class ESDBoxParser extends FullBoxParser {
    static type = 'esds';

    parse(): IESDBox {
      var ret = <IESDBox>super.parse();
      var descrInfo = getDescrInfo(this.bytes, 12);
      ret.esDescr = new ESDescriptorParser(this.readBytes(descrInfo.byteLength)).parse();
      return ret;
    }
  }

  export class MP4VisualSampleEntryParser extends VisualSampleEntryParser {
    static type = 'mp4v';

    parse(): IMP4VisualSampleEntry {
      var ret = <IMP4VisualSampleEntry>super.parse();
      var info = getBoxInfo(this.readBytes(8));
      this.skipBytes(-8);
      ret.esBox = new ESDBoxParser(this.readBytes(info.byteLength)).parse();
      return ret;
    }
  }


  export class MP4AudioSampleEntryParser extends AudioSampleEntryParser {
    static type = 'mp4a';

    parse(): IMP4AudioSampleEntry {
      var ret = <IMP4AudioSampleEntry>super.parse();
      var info = getBoxInfo(this.readBytes(8));
      this.skipBytes(-8);
      ret.esBox = new ESDBoxParser(this.readBytes(info.byteLength)).parse();
      return ret;
    }
  }


  export class MpegSampleEntryParser extends SampleEntryParser {
    static type = 'mp4s';

    parse(): IMpegSampleEntry {
      var ret = <IMpegSampleEntry>super.parse();
      var info = getBoxInfo(this.readBytes(8));
      this.skipBytes(-8);
      ret.esBox = new ESDBoxParser(this.readBytes(info.byteLength)).parse();
      return ret;
    }
  }


  export class SampleDescriptionBoxParser extends FullBoxParser {
    static type = 'stsd';

    parse(): ISampleDescriptionBox {
      var ret = <ISampleDescriptionBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.boxes = [];
      for (var i = 0; i < entryCount; ++i) {
        var info = getBoxInfo(this.readBytes(8));
        this.skipBytes(-8);
        ret.boxes.push(createBoxParser(this.readBytes(info.byteLength), info.type).parse());
      }
      return ret;
    }
  }


  export class SampleSizeBoxParser extends FullBoxParser {
    static type = 'stsz';

    parse(): ISampleSizeBox {
      var ret = <ISampleSizeBox>super.parse();
      var sampleSize = this.readUint32();
      var sampleCount = this.readUint32();
      if (sampleSize === 0) {
        ret.sampleSizes = [];
        for (var i = 0; i < sampleCount; ++i)
          ret.sampleSizes.push(this.readUint32());
      }
      ret.sampleSize = sampleSize;
      ret.sampleCount = sampleCount;
      return ret;
    }
  }


  export class SampleToChunkBoxParser extends FullBoxParser {
    static type = 'stsc';

    parse(): ISampleToChunkBox {
      var ret = <ISampleToChunkBox>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 12;
      var entryCount = view.getUint32(offset);
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          firstChunk: view.getUint32(offset += 4),
          samplesPerChunk: view.getUint32(offset += 4),
          sampleDescriptionIndex: view.getUint32(offset += 4)
        });
      }
      return ret;
    }
  }


  export class ChunkOffsetBoxParser extends FullBoxParser {
    static type = 'stco';

    parse(): IChunkOffsetBox {
      var ret = <IChunkOffsetBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.chunkOffsets = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.chunkOffsets.push(this.readUint32());
      }
      return ret;
    }
  }


  export class SyncSampleBoxParser extends FullBoxParser {
    static type = 'stss';

    parse(): ISyncSampleBox {
      var ret = <ISyncSampleBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.sampleNumbers = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.sampleNumbers.push(this.readUint32());
      }
      return ret;
    }
  }


  export class ShadowSyncSampleBoxParser extends FullBoxParser {
    static type = 'stsh';

    parse(): IShadowSyncSampleBox {
      var ret = <IShadowSyncSampleBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          shadowedSampleNumber: this.readUint32(),
          syncSampleNumber: this.readUint32()
        });
      }
      return ret;
    }
  }


  export class DegradationPriorityBoxParser extends FullBoxParser {
    static type = 'stdp';

    parse(): IDegradationPriorityBox {
      var ret = <IDegradationPriorityBox>super.parse();
      ret.priorities = [];
      while (!this.eof()) {
        ret.priorities.push(this.readUint16());
      }
      return ret;
    }
  }


  export class PaddingBitsBoxParser extends FullBoxParser {
    static type = 'padb';

    parse(): IPaddingBitsBox {
      var ret = <IPaddingBitsBox>super.parse();
      var sampleCount = this.readUint32();
      var pad1: number;
      var pad2: number;
      ret.sampleCount = sampleCount;
      ret.samples = [];
      for (var i = 0; i < sampleCount; ++i) {
        this.skipBits(1);
        pad1 = this.readBits(3);
        this.skipBits(1);
        pad2 = this.readBits(3);
        ret.samples.push({
          pad1: pad1,
          pad2: pad2
        });
      }
      return ret;
    }
  }


  export class FreeSpaceBoxParser extends MediaBoxParser {
    static type = 'free';
  }


  export class SkipBoxParser extends MediaBoxParser {
    static type = 'skip';
  }


  export class EditBoxParser extends BoxListParser {
    static type = 'edts';
  }


  export class EditListBoxParser extends FullBoxParser {
    static type = 'elst';

    parse(): IEditListBox {
      var ret = <IEditListBox>super.parse();
      var entryCount = this.readUint32();
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          sagmentDuration: this.readUint32(),
          mediaTime: this.readUint32(),
          mediaRateInteger: this.readUint16()
        });
        this.skipBytes(2);
      }
      return ret;
    }
  }


  export class CopyrightBoxParser extends FullBoxParser {
    static type = 'cprt';

    parse(): ICopyrightBox {
      var ret = <ICopyrightBox>super.parse();
      this.skipBits(1);
      ret.language = String.fromCharCode(this.readBits(5), this.readBits(5), this.readBits(5));
      ret.notice = this.readUTF8StringNullTerminated();
      return ret;
    }
  }


  export class MovieExtendsBoxParser extends BoxListParser {
    static type = 'mvex';
  }


  export class MovieExtendsHeaderBoxParser extends FullBoxParser {
    static type = 'mehd';

    parse(): IMovieExtendsHeaderBox {
      var ret = <IMovieExtendsHeaderBox>super.parse();
      ret.fragmentDuration = this.readUint32();
      return ret;
    }
  }


  export class TrackExtendsBoxParser extends FullBoxParser {
    static type = 'trex';

    parse(): ITrackExtendsBox {
      var ret = <ITrackExtendsBox>super.parse();
      ret.trackID = this.readUint32();
      ret.defaultSampleDescriptionIndex = this.readUint32();
      ret.defaultSampleDuration = this.readUint32();
      ret.defaultSampleSize = this.readUint32();
      ret.defaultSampleFlags = this.readUint32();
      return ret;
    }
  }


  export class MovieFlagmentBoxParser extends BoxListParser {
    static type = 'moof';
  }


  export class MovieFragmentHeaderBoxParser extends FullBoxParser {
    static type = 'mfhd';

    parse(): IMovieFragmentHeaderBox {
      var ret = <IMovieFragmentHeaderBox>super.parse();
      ret.sequenceNumber = this.readUint32();
      return ret;
    }
  }


  export class TrackFragmentBoxParser extends BoxListParser {
    static type = 'traf';
  }


  export class TrackFragmentHeaderBoxParser extends FullBoxParser {
    static type = 'tfhd';

    parse(): ITrackFragmentHeaderBox {
      var ret = <ITrackFragmentHeaderBox>super.parse();
      ret.trackID = this.readUint32();
      if (ret.flags & 0x000001) ret.baseDataOffset = this.readBytes(8);
      if (ret.flags & 0x000002) ret.sampleDescriptionIndex = this.readUint32();
      if (ret.flags & 0x000008) ret.defaultSampleDuration = this.readUint32();
      if (ret.flags & 0x000010) ret.defaultSampleSize = this.readUint32();
      if (ret.flags & 0x000020) ret.defaultSampleFlags = this.readUint32();
      return ret;
    }
  }

  /**
   * Create a box parser by the box type.
   * @param bytes
   * @param type A box type.
   */
  export var createBoxParser = (() => {
    var Parsers = {};

    Object.keys(parser).forEach((key: string) => {
      var Parser = parser[key];
      if (Parser.type) Parsers[Parser.type] = Parser;
    });

    return (bytes: Uint8Array, type: string): BoxParser => {
      return new (Parsers[type] || BoxParser)(bytes);
    }
  })();

}