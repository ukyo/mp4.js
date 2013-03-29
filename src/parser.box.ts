module mp4.parser.box {

  var handlerType: string;

  var getBoxInfo = (bytes: Uint8Array, offset: number): IBox => {
    var view = new DataView2(bytes, offset);
    return {
      byteLength: view.getUint32(0),
      type: view.getString(4, 4)
    };
  };

  var getFullBoxInfo = (bytes: Uint8Array, offset: number): IFullBox => {
    var view = new DataView2(bytes, offset);
    return {
      byteLength: view.getUint32(0),
      type: view.getString(4, 4),
      version: view.getUint8(8),
      flags: view.getUint24(9)
    };
  };


  export class RootParser extends Parser {
    constructor(bytes: Uint8Array) { super(bytes); }

    parse(): IBox[] {
      var offset = 0;
      var n = this.bytes.length;
      var info: IBox;
      var ret: IBox[] = [];

      while (offset < n) {
        info = getBoxInfo(this.bytes, offset);
        ret.push(<IBox>createBoxParser(this.bytes.subarray(offset, offset + info.byteLength), info.type).parse());
        offset += info.byteLength;
      }

      return ret;
    }
  }


  export class BoxParser extends Parser {
    static type = '';

    constructor(bytes: Uint8Array) {
      super(bytes);
    }

    parse(): IBox {
      return {
        byteLength: this.bytes.length,
        type: getBoxInfo(this.bytes, 0).type,
        bytes: this.bytes
      };
    }
  }


  export class FullBoxParser extends BoxParser {
    version: number;
    flags: number;

    constructor(bytes: Uint8Array) {
      super(bytes);
      this.version = this.getVersion();
      this.flags = this.getFlags();
    }

    parse(): IFullBox {
      var ret = <IFullBox>super.parse();
      ret.version = this.version;
      ret.flags = this.flags;
      return ret;
    }

    private getVersion(): number {
      return this.bytes[8];
    }

    private getFlags(): number {
      var view = new DataView2(this.bytes);
      return view.getUint24(9);
    }
  }


  export class FileTypeBoxParser extends BoxParser {
    static type = 'ftyp';
    
    parse(): IFileTypeBox {
      var view = new DataView2(this.bytes);
      var ret = <IFileTypeBox>super.parse();
      var offset = 16;
      var n = this.bytes.length;

      ret.majorBrand = view.getString(8, 4);
      ret.minorVersion = view.getUint32(12);
      ret.compatibleBrands = <string[]>[];

      while (offset < n) {
        ret.compatibleBrands.push(view.getString(offset, 4));
        offset += 4;
      }

      return ret;
    }
  }


  export class BoxListParser extends BoxParser {
    parse(): IBoxList {
      var offset = 8;
      var ret = <IBoxList>super.parse();
      var boxes: IBox[] = [];
      var info: IBox;
      var n = this.bytes.length;

      while (offset < n) {
        info = getBoxInfo(this.bytes, offset);
        boxes.push(<IBox>createBoxParser(this.bytes.subarray(offset, offset + info.byteLength), info.type).parse());
        offset += info.byteLength;
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
      var view = new DataView2(this.bytes);
      var offset = 12;
      var ret = <IMovieHeaderBox>super.parse();
      var matrix: number[] = [];
      ret.creationTime = view.getUint32(offset);
      ret.modificationTime = view.getUint32(offset += 4);
      ret.timescale = view.getUint32(offset += 4);
      ret.duration = view.getUint32(offset += 4);
      ret.rate = view.getInt32(offset += 4);
      ret.volume = view.getInt16(offset += 4);
      offset += 12;
      for (var i = 0; i < 9; ++i, offset += 4) matrix.push(view.getInt32(offset));
      ret.matrix = matrix;
      ret.nextTrackID = view.getUint32(offset += 24);
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
      var view = new DataView2(this.bytes);
      var offset = 12;
      var matrix: number[] = [];
      ret.creationTime = view.getUint32(offset);
      ret.modificationTime = view.getUint32(offset += 4);
      ret.trackID = view.getUint32(offset += 4);
      ret.duration = view.getUint32(offset += 8);
      ret.layer = view.getInt16(offset += 12);
      ret.alternateGroup = view.getInt16(offset += 2);
      ret.volume = view.getInt16(offset += 2);
      offset += 4;
      for (var i = 0; i < 9; ++i, offset += 4) matrix.push(view.getInt32(offset));
      ret.matrix = matrix;
      ret.width = view.getUint32(offset);
      ret.height = view.getUint32(offset += 4);
      return ret;
    }
  }
  

  export class TrackReferenceBox extends BoxListParser {
    static type = 'tref';
  }


  export class TrackReferenceTypeBox extends BoxParser {
    parse(): ITrackReferenceTypeBox {
      var ret = <ITrackReferenceTypeBox>super.parse();
      var view = new DataView2(this.bytes);
      var trackIDs: number[] = [];
      var offset = 8;
      var n = this.bytes.length;
      for (; offset < n; offset += 4) trackIDs.push(view.getUint32(offset));
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
      var view = new DataView2(this.bytes);
      var offset = 12;
      var tmp: number;
      ret.creationTime = view.getUint32(offset);
      ret.modificationTime = view.getUint32(offset += 4);
      ret.timescale = view.getUint32(offset += 4);
      ret.duration = view.getUint32(offset += 4);
      tmp = view.getUint16(offset += 4);
      ret.language = String.fromCharCode.apply([tmp >> 10, (tmp >> 5) & 0x3F, tmp & 0x07]);
      return ret;
    }
  }


  export class HandlerBoxParser extends FullBoxParser {
    static type = 'hdlr';

    parse(): IHandlerBox {
      var ret = <IHandlerBox>super.parse();
      var view = new DataView2(this.bytes);
      handlerType = ret.handlerType = view.getString(16, 4);
      ret.name = view.getString(32, this.bytes.length - 32);
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
      var offset = 12;
      var opcolor: number[] = [];
      ret.graphicsmode = view.getUint16(offset);
      offset += 2;
      for (var i = 0; i < 3; ++i, offset += 2) opcolor.push(view.getUint16(offset));
      ret.opcolor = opcolor;
      return ret;
    }
  }


  export class SoundMediaHeaderBoxParser extends FullBoxParser {
    static type = 'smhd';

    parse(): ISoundMediaHeaderBox {
      var ret = <ISoundMediaHeaderBox>super.parse();
      ret.balance = new DataView2(this.bytes).getInt16(12);
      return ret;
    }
  }


  export class HindMediaHeaderBoxParser extends FullBoxParser {
    static type = 'hmhd';

    parse(): IHintMediaHeaderBox {
      var ret = <IHintMediaHeaderBox>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 12;
      ret.maxPDUsize = view.getUint16(offset);
      ret.avgPDUsize = view.getUint16(offset += 4);
      ret.maxbitrate = view.getUint16(offset += 4);
      ret.avgbitrate = view.getUint16(offset += 4);
      return ret;
    }
  }


  export class NullMediaHeaderBoxParser extends FullBoxParser {
    static type = 'nmhd';
  }


  export class DataReferenceBoxParser extends BoxListParser {
    static type = 'dinf';
  }


  export class DataEntryUrlBoxParser extends FullBoxParser {
    static type = 'url ';

    parse(): IDataEntryUrlBox {
      var ret = <IDataEntryUrlBox>super.parse();
      ret.location = new DataView2(this.bytes).getUTF8String(12, this.bytes.length - 12);
      return ret;
    }
  }


  export class DataEntryUrnBoxParser extends FullBoxParser {
    static type = 'urn ';

    parse(): IDataEntryUrnBox {
      var ret = <IDataEntryUrnBox>super.parse();
      var s = new DataView2(this.bytes).getUTF8String(12, this.bytes.length - 12);
      ret.name = s.split('\0')[0];
      ret.location = s.split('\0')[1];
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
      var view = new DataView2(this.bytes);
      var offset = 12;
      var entryCount = view.getUint32(offset);
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          sampleCount: view.getUint32(offset += 4),
          sampleDelta: view.getUint32(offset += 4)
        });
      }
      return ret;
    }
  }


  export class CompositionOffsetBoxParser extends FullBoxParser {
    static type = 'ctts';

    parse(): ICompositionOffsetBox {
      var ret = <ICompositionOffsetBox>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 12;
      var entryCount = view.getUint32(offset);
      ret.entryCount = entryCount;
      ret.entries = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.entries.push({
          sampleCount: view.getUint32(offset += 4),
          sampleOffset: view.getUint32(offset += 4)
        });
      }
      return ret;
    }
  }

  export class SampleEntryParser extends Parser {
    parse(): ISampleEntry {
      return {
        dataReferenceIndex: new DataView2(this.bytes).getUint16(6),
        byteLength: this.bytes.byteLength,
        bytes: this.bytes
      };
    }
  }

  
  export class HintSampleEntryParser extends SampleEntryParser {
    parse(): IHintSampleEntry {
      var ret = <IHintSampleEntry>super.parse();
      ret.data = this.bytes.subarray(8);
      return ret;
    }
  }


  export class VisualSampleEntryParser extends SampleEntryParser {
    parse(): IVisualSampleEntry {
      var ret = <IVisualSampleEntry>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 24;
      ret.width = view.getUint16(offset);
      ret.height = view.getUint16(offset += 2);
      ret.horizresolution = view.getUint32(offset += 2);
      ret.vertresolution = view.getUint32(offset += 4);
      ret.compressorname = view.getString(offset += 4, 32);
      ret.depth = view.getUint16(offset += 32);
      return ret;
    }
  }


  export class AudioSampleEntryParser extends SampleEntryParser {
    parse(): IAudioSampleEntry {
      var ret = <IAudioSampleEntry>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 16;
      ret.channelcount = view.getUint16(offset);
      ret.samplesize = view.getUint16(offset += 2);
      ret.samplerate = view.getUint32(offset += 6);
      return ret;
    }
  }


  export class SampleDescriptionBoxParser extends FullBoxParser {
    static type = 'stsd';

    parse(): ISampleDescriptionBox {
      var ret = <ISampleDescriptionBox>super.parse();
      var offset = 12;
      var entryCount = new DataView2(this.bytes).getUint32(offset);
      ret.entryCount = entryCount;
      offset += 4;
      ret.boxes = [];
      for (var i = 0; i < entryCount; ++i) {
        var info = getBoxInfo(this.bytes, offset);
        ret.boxes.push(createBoxParser(this.bytes.subarray(offset, offset + info.byteLength), info.type).parse())
        offset += info.byteLength;
      }
      return ret;
    }
  }


  export class SampleSizeBoxParser extends FullBoxParser {
    static type = 'stsz';

    parse(): ISampleSizeBox {
      var ret = <ISampleSizeBox>super.parse();
      var view = new DataView2(this.bytes);
      var offset = 12;
      var sampleSize = view.getUint32(offset);
      var sampleCount = view.getUint32(offset += 4);
      if (sampleSize === 0) {
        ret.entrySizes = [];
        for (var i = 0; i < sampleCount; ++i) ret.entrySizes.push(view.getUint32(offset += 4));
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
      var view = new DataView2(this.bytes);
      var offset = 12;
      var entryCount = view.getUint32(offset);
      ret.entryCount = entryCount;
      ret.chunkOffsets = [];
      for (var i = 0; i < entryCount; ++i) {
        ret.chunkOffsets.push(view.getUint32(offset += 4));
      }
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

    Object.getOwnPropertyNames(box).forEach((name: string) => {
      var Parser = box[name];
      if (Parser.type) Parsers[Parser.type] = Parser;
    });

    return (bytes: Uint8Array, type: string): BoxParser => {
      return new (Parsers[type] || BoxParser)(bytes);
    }
  })();

}