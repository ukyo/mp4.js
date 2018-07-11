import { DataView2 } from "./dataview";
import {
  IBox,
  IFullBox,
  IFileTypeBox,
  IBoxList,
  IMediaDataBox,
  IMovieHeaderBox,
  ITrackHeaderBox,
  ITrackReferenceTypeBox,
  IMediaHeaderBox,
  IHandlerBox,
  IVideoMediaHeaderBox,
  ISoundMediaHeaderBox,
  IHintMediaHeaderBox,
  IDataReferenceBox,
  IDataEntryBox,
  IDataEntryUrlBox,
  IDataEntryUrnBox,
  ITimeToSampleBox,
  ICompositionOffsetBox,
  ISampleEntry,
  IHintSampleEntry,
  IVisualSampleEntry,
  IAudioSampleEntry,
  IESDBox,
  IMP4VisualSampleEntry,
  IMP4AudioSampleEntry,
  IMpegSampleEntry,
  ISampleDescriptionBox,
  ISampleSizeBox,
  ISampleToChunkBox,
  IChunkOffsetBox,
  ISyncSampleBox,
  IShadowSyncSampleBox,
  IDegradationPriorityBox,
  IPaddingBitsBox,
  IEditListBox,
  ICopyrightBox,
  IMovieExtendsHeaderBox,
  ITrackExtendsBox,
  IMovieFragmentHeaderBox,
  ITrackFragmentHeaderBox,
  ITrackRunBox,
  ITrackFragmentRandomAccessBox,
  IMovieFragmentRandomAccessOffsetBox,
  ISampleDependencyTypeBox,
  ISampleToGroupBox,
  ISampleGroupDescriptionBox,
  ISampleGroupDescriptionEntry,
  IVisualRollRecoveryEntry,
  IAudioRollRecoveryEntry,
  ISampleScaleBox,
  ISubSampleInformationBox,
  IProgressiveDownloadInfoBox,
  IMetaBox,
  IPrimaryItemBox,
  IDataInformationBox,
  IItemLocationBox,
  IItemInfoBox,
  IItemProtectionBox,
  IIPMPControlBox,
  IXMLBox,
  IBinaryXMLBox,
  IProtectionSchemeInfoBox,
  IItemInfoEntry,
  IOriginalFormatBox,
  IIPMPInfoBox
} from "./interface.box";
import { DescriptorParserMixin } from "./parser.descr";
import {
  BOX_TYPE_FILE_TYPE_BOX,
  BOX_TYPE_MOVIE_BOX,
  BOX_TYPE_MEDIA_DATA_BOX,
  BOX_TYPE_MOVIE_HEADER_BOX,
  BOX_TYPE_TRACK_BOX,
  BOX_TYPE_TRACK_HEADER_BOX,
  BOX_TYPE_TRACK_REFERENCE_BOX,
  BOX_TYPE_HINT_TRACK_REFERENCE_TYPE_BOX,
  BOX_TYPE_DISCRIBE_TRACK_REFERENCE_TYPE_BOX,
  BOX_TYPE_MEDIA_BOX,
  BOX_TYPE_MEDIA_HEADER_BOX,
  BOX_TYPE_HANDLER_BOX,
  BOX_TYPE_MEDIA_INFORMATION_BOX,
  BOX_TYPE_VIDEO_MEDIA_HEADER_BOX,
  BOX_TYPE_SOUND_MEDIA_HEADER_BOX,
  BOX_TYPE_HINT_MEDIA_HEADER_BOX,
  BOX_TYPE_NULL_MEDIA_HEADER_BOX,
  BOX_TYPE_DATA_INFORMATION_BOX,
  BOX_TYPE_DATA_REFERENCE_BOX,
  BOX_TYPE_DATA_ENTRY_URL_BOX,
  BOX_TYPE_DATA_ENTRY_URN_BOX,
  BOX_TYPE_SAMPLE_TABLE_BOX,
  BOX_TYPE_TIME_TO_SAMPLE_BOX,
  BOX_TYPE_COMPOSITION_OFFSET_BOX,
  BOX_TYPE_ES_DESCRIPTOR_BOX,
  BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY,
  BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY,
  BOX_TYPE_MPEG_SAMPLE_ENTRY,
  BOX_TYPE_SAMPLE_DESCRIPTION_BOX,
  BOX_TYPE_SAMPLE_SIZE_BOX,
  BOX_TYPE_SAMPLE_TO_CHUNK_BOX,
  BOX_TYPE_CHUNK_OFFSET_BOX,
  BOX_TYPE_SYNC_SAMPLE_BOX,
  BOX_TYPE_SHADOW_SYNC_SAMPLE_BOX,
  BOX_TYPE_DEGRADATION_PRIORITY_BOX,
  BOX_TYPE_PADDING_BITS_BOX,
  BOX_TYPE_FREE_SPACE_BOX,
  BOX_TYPE_SKIP_BOX,
  BOX_TYPE_EDIT_BOX,
  BOX_TYPE_EDIT_LIST_BOX,
  BOX_TYPE_COPYRIGHT_BOX,
  BOX_TYPE_MOVIE_EXTENDS_BOX,
  BOX_TYPE_MOVIE_EXTENDS_HEADER_BOX,
  BOX_TYPE_TRACK_EXTENDS_BOX,
  BOX_TYPE_MOVIE_FLAGMENT_BOX,
  BOX_TYPE_MOVIE_FRAGMENT_HEADER_BOX,
  BOX_TYPE_TRACK_FRAGMENT_BOX,
  BOX_TYPE_TRACK_FRAGMENT_HEADER_BOX,
  BOX_TYPE_TRACK_RUN_BOX,
  BOX_TYPE_TRACK_FRAGMENT_RANDOM_ACCESS_BOX,
  BOX_TYPE_MOVIE_FRAGMENT_RANDOM_ACCESS_OFFSET_BOX,
  BOX_TYPE_SAMPLE_DEPENDENCY_TYPE_BOX,
  BOX_TYPE_SAMPLE_TO_GROUPE_BOX,
  BOX_TYPE_SAMPLE_GROUP_DESCRIPTION_BOX,
  BOX_TYPE_ROLL_RECOVERY_ENTRY,
  BOX_TYPE_SAMPLE_SCALE_BOX,
  BOX_TYPE_SUB_SAMPLE_INFORMATION_BOX,
  BOX_TYPE_PROGRESSIVE_DOWNLOAD_INFO_BOX,
  BOX_TYPE_META_BOX,
  BOX_TYPE_PRIMARY_ITEM_BOX,
  BOX_TYPE_ITEM_LOCATION_BOX,
  BOX_TYPE_ITEM_INFO_BOX,
  BOX_TYPE_ITEM_PROTECTION_BOX,
  BOX_TYPE_IPMP_CONTROL_BOX,
  BOX_TYPE_XML_BOX,
  BOX_TYPE_BINARY_XML_BOX,
  BOX_TYPE_ITEM_INFO_ENTRY,
  BOX_TYPE_PROTECTION_SCHEME_INFO_BOX,
  BOX_TYPE_IPMP_INFO_BOX,
  BOX_TYPE_ORIGINAL_FORMAT_BOX,
  BOX_TYPE_CHUNK_OFFSET64_BOX
} from "./statics";
import { IESDescriptor, IIPMPDescriptor } from "./interface.descr";

const dict: { [type: string]: { new (bytes: Uint8Array): BoxParser } } = {};
function Type(type: string) {
  return function(constructor: any) {
    constructor.TYPE = type;
    dict[type] = constructor;
    return constructor;
  };
}
var getBoxInfo = (bytes: Uint8Array, offset: number = 0): IBox => {
  var view = new DataView2(bytes, offset);
  return {
    byteLength: view.getUint32(0),
    type: view.getString(4, 4)
  } as IBox;
};

var getFullBoxInfo = (bytes: Uint8Array, offset: number = 0): IFullBox => {
  var view = new DataView2(bytes, offset);
  return {
    byteLength: view.getUint32(0),
    type: view.getString(4, 4),
    version: view.getUint8(8),
    flags: view.getUint24(9)
  } as IFullBox;
};

export class BoxParserMixin extends DescriptorParserMixin {
  readBox(): IBox {
    var info = getBoxInfo(this.bytes, this.byteOffset);
    return createBoxParser(this.readBytes(info.byteLength), info.type).parse();
  }
}

export class RootParser extends BoxParserMixin {
  parse(): IBox[] {
    var ret: IBox[] = [];
    while (!this.eof()) ret.push(this.readBox());
    return ret;
  }
}

export class BoxParser extends BoxParserMixin {
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

@Type(BOX_TYPE_FILE_TYPE_BOX)
export class FileTypeBoxParser extends BoxParser {
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
    while (!this.eof()) boxes.push(this.readBox());
    ret.boxes = boxes;
    return ret;
  }
}

@Type(BOX_TYPE_MOVIE_BOX)
export class MovieBoxParser extends BoxListParser {}

@Type(BOX_TYPE_MEDIA_DATA_BOX)
export class MediaDataBoxParser extends BoxParser {
  parse(): IMediaDataBox {
    var ret = <IMediaDataBox>super.parse();
    ret.data = this.bytes.subarray(8);
    return ret;
  }
}

@Type(BOX_TYPE_MOVIE_HEADER_BOX)
export class MovieHeaderBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_TRACK_BOX)
export class TrackBoxParser extends BoxListParser {}

@Type(BOX_TYPE_TRACK_HEADER_BOX)
export class TrackHeaderBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_TRACK_REFERENCE_BOX)
export class TrackReferenceBox extends BoxListParser {}

export class TrackReferenceTypeBox extends BoxParser {
  parse(): ITrackReferenceTypeBox {
    var ret = <ITrackReferenceTypeBox>super.parse();
    ret.trackIDs = [];
    while (!this.eof()) ret.trackIDs.push(this.readUint32());
    return ret;
  }
}

@Type(BOX_TYPE_HINT_TRACK_REFERENCE_TYPE_BOX)
export class HintTrackReferenceTypeBox extends TrackReferenceTypeBox {}

@Type(BOX_TYPE_DISCRIBE_TRACK_REFERENCE_TYPE_BOX)
export class DescribeTrackReferenceTypeBox extends TrackReferenceTypeBox {}

@Type(BOX_TYPE_MEDIA_BOX)
export class MediaBoxParser extends BoxListParser {}

@Type(BOX_TYPE_MEDIA_HEADER_BOX)
export class MediaHeaderBoxParser extends FullBoxParser {
  parse(): IMediaHeaderBox {
    var ret = <IMediaHeaderBox>super.parse();
    ret.creationTime = this.readUint32();
    ret.modificationTime = this.readUint32();
    ret.timescale = this.readUint32();
    ret.duration = this.readUint32();
    this.skipBits(1);
    ret.language = String.fromCharCode.apply(
      null,
      [this.readBits(5), this.readBits(5), this.readBits(5)].map(x => x + 0x60)
    );
    return ret;
  }
}

@Type(BOX_TYPE_HANDLER_BOX)
export class HandlerBoxParser extends FullBoxParser {
  parse(): IHandlerBox {
    var ret = <IHandlerBox>super.parse();
    this.skipBytes(4);
    ret.handlerType = this.readString(4);
    this.skipBytes(4 * 3);
    ret.name = this.readUTF8StringNullTerminated();
    return ret;
  }
}

@Type(BOX_TYPE_MEDIA_INFORMATION_BOX)
export class MediaInformationBoxParser extends BoxListParser {}

@Type(BOX_TYPE_VIDEO_MEDIA_HEADER_BOX)
export class VideoMediaHeaderBoxParser extends FullBoxParser {
  parse(): IVideoMediaHeaderBox {
    var ret = <IVideoMediaHeaderBox>super.parse();
    var view = new DataView2(this.bytes);
    ret.opcolor = [];
    ret.graphicsmode = this.readUint16();
    for (var i = 0; i < 3; ++i) ret.opcolor.push(this.readUint16());
    return ret;
  }
}

@Type(BOX_TYPE_SOUND_MEDIA_HEADER_BOX)
export class SoundMediaHeaderBoxParser extends FullBoxParser {
  parse(): ISoundMediaHeaderBox {
    var ret = <ISoundMediaHeaderBox>super.parse();
    ret.balance = this.readInt16();
    return ret;
  }
}

@Type(BOX_TYPE_HINT_MEDIA_HEADER_BOX)
export class HintMediaHeaderBoxParser extends FullBoxParser {
  parse(): IHintMediaHeaderBox {
    var ret = <IHintMediaHeaderBox>super.parse();
    ret.maxPDUsize = this.readUint16();
    ret.avgPDUsize = this.readUint16();
    ret.maxbitrate = this.readUint32();
    ret.avgbitrate = this.readUint32();
    return ret;
  }
}

@Type(BOX_TYPE_NULL_MEDIA_HEADER_BOX)
export class NullMediaHeaderBoxParser extends FullBoxParser {}

@Type(BOX_TYPE_DATA_INFORMATION_BOX)
export class DataInformationBoxParser extends BoxListParser {}

@Type(BOX_TYPE_DATA_REFERENCE_BOX)
export class DataReferenceBoxParser extends FullBoxParser {
  parse(): IDataReferenceBox {
    var ret = <IDataReferenceBox>super.parse();
    ret.entryCount = this.readUint32();
    ret.entries = [];
    while (!this.eof()) {
      ret.entries.push(<IDataEntryBox>this.readBox());
    }
    return ret;
  }
}

@Type(BOX_TYPE_DATA_ENTRY_URL_BOX)
export class DataEntryUrlBoxParser extends FullBoxParser {
  parse(): IDataEntryUrlBox {
    var ret = <IDataEntryUrlBox>super.parse();
    ret.location = this.readUTF8StringNullTerminated();
    return ret;
  }
}

@Type(BOX_TYPE_DATA_ENTRY_URN_BOX)
export class DataEntryUrnBoxParser extends FullBoxParser {
  parse(): IDataEntryUrnBox {
    var ret = <IDataEntryUrnBox>super.parse();
    ret.name = this.readUTF8StringNullTerminated();
    ret.location = this.readUTF8StringNullTerminated();
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_TABLE_BOX)
export class SampleTableBoxParser extends BoxListParser {}

@Type(BOX_TYPE_TIME_TO_SAMPLE_BOX)
export class TimeToSampleBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_COMPOSITION_OFFSET_BOX)
export class CompositionOffsetBoxParser extends FullBoxParser {
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
    ret.channelCount = this.readUint16();
    ret.sampleSize = this.readUint16();
    this.skipBytes(4);
    ret.sampleRate = this.readUint32() / 0x10000;
    return ret;
  }
}

@Type(BOX_TYPE_ES_DESCRIPTOR_BOX)
export class ESDBoxParser extends FullBoxParser {
  parse(): IESDBox {
    var ret = <IESDBox>super.parse();
    ret.esDescr = <IESDescriptor>this.readDescriptor();
    return ret;
  }
}

@Type(BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY)
export class MP4VisualSampleEntryParser extends VisualSampleEntryParser {
  parse(): IMP4VisualSampleEntry {
    var ret = <IMP4VisualSampleEntry>super.parse();
    ret.esBox = <IESDBox>this.readBox();
    return ret;
  }
}

@Type(BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY)
export class MP4AudioSampleEntryParser extends AudioSampleEntryParser {
  parse(): IMP4AudioSampleEntry {
    var ret = <IMP4AudioSampleEntry>super.parse();
    ret.esBox = <IESDBox>this.readBox();
    return ret;
  }
}

@Type(BOX_TYPE_MPEG_SAMPLE_ENTRY)
export class MpegSampleEntryParser extends SampleEntryParser {
  parse(): IMpegSampleEntry {
    var ret = <IMpegSampleEntry>super.parse();
    ret.esBox = <IESDBox>this.readBox();
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_DESCRIPTION_BOX)
export class SampleDescriptionBoxParser extends FullBoxParser {
  parse(): ISampleDescriptionBox {
    var ret = <ISampleDescriptionBox>super.parse();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.boxes = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.boxes.push(this.readBox());
    }
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_SIZE_BOX)
export class SampleSizeBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_SAMPLE_TO_CHUNK_BOX)
export class SampleToChunkBoxParser extends FullBoxParser {
  parse(): ISampleToChunkBox {
    var ret = <ISampleToChunkBox>super.parse();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.entries = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.entries.push({
        firstChunk: this.readUint32(),
        samplesPerChunk: this.readUint32(),
        sampleDescriptionIndex: this.readUint32()
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_CHUNK_OFFSET_BOX)
export class ChunkOffsetBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_CHUNK_OFFSET64_BOX)
export class ChunkOffset64BoxParser extends FullBoxParser {
  parse(): IChunkOffsetBox {
    var ret = <IChunkOffsetBox>super.parse();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.chunkOffsets = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.chunkOffsets.push(this.readUint64());
    }
    return ret;
  }
}

@Type(BOX_TYPE_SYNC_SAMPLE_BOX)
export class SyncSampleBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_SHADOW_SYNC_SAMPLE_BOX)
export class ShadowSyncSampleBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_DEGRADATION_PRIORITY_BOX)
export class DegradationPriorityBoxParser extends FullBoxParser {
  parse(): IDegradationPriorityBox {
    var ret = <IDegradationPriorityBox>super.parse();
    ret.priorities = [];
    while (!this.eof()) {
      ret.priorities.push(this.readUint16());
    }
    return ret;
  }
}

@Type(BOX_TYPE_PADDING_BITS_BOX)
export class PaddingBitsBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_FREE_SPACE_BOX)
export class FreeSpaceBoxParser extends MediaBoxParser {}

@Type(BOX_TYPE_SKIP_BOX)
export class SkipBoxParser extends MediaBoxParser {}

@Type(BOX_TYPE_EDIT_BOX)
export class EditBoxParser extends BoxListParser {}

@Type(BOX_TYPE_EDIT_LIST_BOX)
export class EditListBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_COPYRIGHT_BOX)
export class CopyrightBoxParser extends FullBoxParser {
  parse(): ICopyrightBox {
    var ret = <ICopyrightBox>super.parse();
    this.skipBits(1);
    ret.language = String.fromCharCode(
      this.readBits(5),
      this.readBits(5),
      this.readBits(5)
    );
    ret.notice = this.readUTF8StringNullTerminated();
    return ret;
  }
}

@Type(BOX_TYPE_MOVIE_EXTENDS_BOX)
export class MovieExtendsBoxParser extends BoxListParser {}

@Type(BOX_TYPE_MOVIE_EXTENDS_HEADER_BOX)
export class MovieExtendsHeaderBoxParser extends FullBoxParser {
  parse(): IMovieExtendsHeaderBox {
    var ret = <IMovieExtendsHeaderBox>super.parse();
    ret.fragmentDuration = this.readUint32();
    return ret;
  }
}

@Type(BOX_TYPE_TRACK_EXTENDS_BOX)
export class TrackExtendsBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_MOVIE_FLAGMENT_BOX)
export class MovieFlagmentBoxParser extends BoxListParser {}

@Type(BOX_TYPE_MOVIE_FRAGMENT_HEADER_BOX)
export class MovieFragmentHeaderBoxParser extends FullBoxParser {
  parse(): IMovieFragmentHeaderBox {
    var ret = <IMovieFragmentHeaderBox>super.parse();
    ret.sequenceNumber = this.readUint32();
    return ret;
  }
}

@Type(BOX_TYPE_TRACK_FRAGMENT_BOX)
export class TrackFragmentBoxParser extends BoxListParser {}

@Type(BOX_TYPE_TRACK_FRAGMENT_HEADER_BOX)
export class TrackFragmentHeaderBoxParser extends FullBoxParser {
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

@Type(BOX_TYPE_TRACK_RUN_BOX)
export class TrackRunBoxParser extends FullBoxParser {
  parse(): ITrackRunBox {
    var ret = <ITrackRunBox>super.parse();
    var sampleCount = this.readUint32();
    ret.sampleCount = sampleCount;
    if (ret.flags & 0x000001) ret.dataOffset = this.readInt32();
    if (ret.flags & 0x000002) ret.firstSampleFlats = this.readUint32();
    ret.samples = [];
    for (var i = 0; i < sampleCount; ++i) {
      ret.samples.push({
        sampleDuration: ret.flags & 0x000100 ? this.readUint32() : undefined,
        sampleSize: ret.flags & 0x000200 ? this.readUint32() : undefined,
        sampleFlags: ret.flags & 0x000400 ? this.readUint32() : undefined,
        sampleCompositionTimeOffset:
          ret.flags & 0x000800 ? this.readUint32() : undefined
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_TRACK_FRAGMENT_RANDOM_ACCESS_BOX)
export class TrackFragmentRandomAccessBoxParser extends FullBoxParser {
  parse(): ITrackFragmentRandomAccessBox {
    var ret = <ITrackFragmentRandomAccessBox>super.parse();
    ret.trackID = this.readUint32();
    this.skipBits(26);
    ret.lengthSizeOfTrafNum = this.readBits(2);
    ret.lengthSizeOfTrunNum = this.readBits(2);
    ret.lengthSizeOfSampleNum = this.readBits(2);
    var numberOfEntry = this.readUint32();
    ret.numberOfEntry = numberOfEntry;
    ret.entries = [];
    for (var i = 0; i < numberOfEntry; ++i) {
      ret.entries.push({
        time: this.readUint32(),
        moofOffset: this.readUint32(),
        trafNumber: this.readBits((ret.lengthSizeOfTrafNum + 1) * 8),
        trunNumber: this.readBits((ret.lengthSizeOfTrunNum + 1) * 8),
        sampleNumber: this.readBits((ret.lengthSizeOfSampleNum + 1) * 8)
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_MOVIE_FRAGMENT_RANDOM_ACCESS_OFFSET_BOX)
export class MovieFragmentRandomAccessOffsetBoxParser extends FullBoxParser {
  parse(): IMovieFragmentRandomAccessOffsetBox {
    var ret = <IMovieFragmentRandomAccessOffsetBox>super.parse();
    ret.size = this.readUint32();
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_DEPENDENCY_TYPE_BOX)
export class SampleDependencyTypeBoxParser extends FullBoxParser {
  parse(): ISampleDependencyTypeBox {
    var ret = <ISampleDependencyTypeBox>super.parse();
    ret.samples = [];
    while (!this.eof()) {
      this.skipBits(2);
      ret.samples.push({
        sampleDependsOn: this.readBits(2),
        sampleIsDependedOn: this.readBits(2),
        sampleHasRedundancy: this.readBits(2)
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_TO_GROUPE_BOX)
export class SampleToGroupBoxParser extends FullBoxParser {
  parse(): ISampleToGroupBox {
    var ret = <ISampleToGroupBox>super.parse();
    ret.groupintType = this.readUint32();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.entries = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.entries.push({
        sampleCount: this.readUint32(),
        groupDescriptionIndex: this.readUint32()
      });
    }
    return ret;
  }
}

export class SampleGroupDescriptionEntryParser extends BoxParser {}

export class VisualSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {}

export class AudioSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {}

export class HintSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {}

@Type(BOX_TYPE_SAMPLE_GROUP_DESCRIPTION_BOX)
export class SampleGroupDescriptionBoxParser extends FullBoxParser {
  parse(): ISampleGroupDescriptionBox {
    var ret = <ISampleGroupDescriptionBox>super.parse();
    ret.groupingType = this.readUint32();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.entries = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.entries.push(<ISampleGroupDescriptionEntry>this.readBox());
    }
    return ret;
  }
}

@Type(BOX_TYPE_ROLL_RECOVERY_ENTRY)
export class VisualRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
  parse(): IVisualRollRecoveryEntry {
    var ret = <IVisualRollRecoveryEntry>super.parse();
    ret.rollDistance = this.readInt16();
    return ret;
  }
}

@Type(BOX_TYPE_ROLL_RECOVERY_ENTRY)
export class AudioRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
  parse(): IAudioRollRecoveryEntry {
    var ret = <IAudioRollRecoveryEntry>super.parse();
    ret.rollDistance = this.readInt16();
    return ret;
  }
}

@Type(BOX_TYPE_SAMPLE_SCALE_BOX)
export class SampleScaleBoxParser extends FullBoxParser {
  parse(): ISampleScaleBox {
    var ret = <ISampleScaleBox>super.parse();
    this.skipBits(7);
    ret.constraintFlag = this.readBits(1);
    ret.scaleMethod = this.readUint8();
    ret.displayCenterX = this.readInt16();
    ret.displayCenterY = this.readInt16();
    return ret;
  }
}

@Type(BOX_TYPE_SUB_SAMPLE_INFORMATION_BOX)
export class SubSampleInformationBoxParser extends FullBoxParser {
  parse(): ISubSampleInformationBox {
    var ret = <ISubSampleInformationBox>super.parse();
    var entryCount = this.readUint32();
    ret.entryCount = entryCount;
    ret.entries = [];
    for (var i = 0; i < entryCount; ++i) {
      var sampleDelta = this.readUint32();
      var subsampleCount = this.readUint16();
      var samples = [];
      for (var j = 0; j < subsampleCount; ++j) {
        samples.push({
          subsampleSize:
            ret.version === 1 ? this.readUint32() : this.readUint16(),
          subsamplePriority: this.readUint8(),
          discardable: this.readUint8()
        });
        this.skipBytes(4);
      }
      ret.entries.push({
        sampleDelta: sampleDelta,
        subsampleCount: subsampleCount,
        samples: samples
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_PROGRESSIVE_DOWNLOAD_INFO_BOX)
export class ProgressiveDownloadInfoBoxParser extends FullBoxParser {
  parse(): IProgressiveDownloadInfoBox {
    var ret = <IProgressiveDownloadInfoBox>super.parse();
    ret.entries = [];
    while (!this.eof()) {
      ret.entries.push({
        rate: this.readUint32(),
        initialDelay: this.readUint32()
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_META_BOX)
export class MetaBoxParser extends FullBoxParser {
  parse(): IMetaBox {
    var ret = <IMetaBox>super.parse();
    ret.theHandler = <IHandlerBox>this.readBox();
    ret.otherBoxes = [];
    while (!this.eof()) {
      var box = this.readBox();
      switch (box.type) {
        case BOX_TYPE_PRIMARY_ITEM_BOX:
          ret.primaryResource = <IPrimaryItemBox>box;
          break;
        case BOX_TYPE_DATA_INFORMATION_BOX:
          ret.fileLocations = <IDataInformationBox>box;
          break;
        case BOX_TYPE_ITEM_LOCATION_BOX:
          ret.itemLocations = <IItemLocationBox>box;
          break;
        case BOX_TYPE_ITEM_INFO_BOX:
          ret.itemInfos = <IItemInfoBox>box;
          break;
        case BOX_TYPE_ITEM_PROTECTION_BOX:
          ret.protections = <IItemProtectionBox>box;
          break;
        case BOX_TYPE_IPMP_CONTROL_BOX:
          ret.IPMPControl = <IIPMPControlBox>box;
          break;
        default:
          ret.otherBoxes.push(box);
      }
    }
    return ret;
  }
}

@Type(BOX_TYPE_XML_BOX)
export class XMLBoxParsr extends FullBoxParser {
  parse(): IXMLBox {
    var ret = <IXMLBox>super.parse();
    var bytes = this.bytes.subarray(this.byteOffset);
    ret.xml = DataView2.UTF8BytesToString(bytes);
    return ret;
  }
}

@Type(BOX_TYPE_BINARY_XML_BOX)
export class BinaryXMLBoxParser extends FullBoxParser {
  parse(): IBinaryXMLBox {
    var ret = <IBinaryXMLBox>super.parse();
    ret.data = this.bytes.subarray(this.byteOffset);
    return ret;
  }
}

@Type(BOX_TYPE_ITEM_LOCATION_BOX)
export class ItemLocationBoxParser extends FullBoxParser {
  parse(): IItemLocationBox {
    var ret = <IItemLocationBox>super.parse();
    ret.offsetSize = this.readBits(4);
    ret.lengthSize = this.readBits(4);
    ret.baseOffsetSize = this.readBits(4);
    this.skipBits(4);
    var itemCount = (ret.itemCount = this.readUint16());
    ret.items = [];
    for (var i = 0; i < itemCount; ++i) {
      var itemID = this.readUint16();
      var dataReferenceIndex = this.readUint16();
      var baseOffset = this.readBits(ret.baseOffsetSize * 8);
      var extentCount = this.readUint16();
      var extents = [];
      for (var j = 0; j < extentCount; ++j) {
        extents.push({
          extentOffset: this.readBits(ret.offsetSize * 8),
          extentLength: this.readBits(ret.lengthSize * 8)
        });
      }
      ret.items.push({
        itemID: itemID,
        dataReferenceIndex: dataReferenceIndex,
        baseOffset: baseOffset,
        extentCount: extentCount,
        extents: extents
      });
    }
    return ret;
  }
}

@Type(BOX_TYPE_PRIMARY_ITEM_BOX)
export class PrimaryItemBoxParser extends FullBoxParser {
  parse(): IPrimaryItemBox {
    var ret = <IPrimaryItemBox>super.parse();
    ret.itemID = this.readUint16();
    return ret;
  }
}

@Type(BOX_TYPE_ITEM_PROTECTION_BOX)
export class ItemProtectionBoxParser extends FullBoxParser {
  parse(): IItemProtectionBox {
    var ret = <IItemProtectionBox>super.parse();
    var protectionCount = (ret.protectionCount = this.readUint16());
    ret.protectionInformations = [];
    for (var i = 0; i < protectionCount; ++i) {
      ret.protectionInformations.push(<IProtectionSchemeInfoBox>this.readBox());
    }
    return ret;
  }
}

@Type(BOX_TYPE_ITEM_INFO_ENTRY)
export class ItemInfoEntryParser extends FullBoxParser {
  parse(): IItemInfoEntry {
    var ret = <IItemInfoEntry>super.parse();
    ret.itemID = this.readUint16();
    ret.itemProtectionIndex = this.readUint16();
    ret.itemName = this.readUTF8StringNullTerminated();
    ret.contentType = this.readUTF8StringNullTerminated();
    ret.contentEncoding = this.readString();
    return ret;
  }
}

@Type(BOX_TYPE_ITEM_INFO_BOX)
export class ItemInfoBoxParser extends FullBoxParser {
  parse(): IItemInfoBox {
    var ret = <IItemInfoBox>super.parse();
    var entryCount = (ret.entryCount = this.readUint16());
    ret.itemInfos = [];
    for (var i = 0; i < entryCount; ++i) {
      ret.itemInfos.push(<IItemInfoEntry>this.readBox());
    }
    return ret;
  }
}

@Type(BOX_TYPE_PROTECTION_SCHEME_INFO_BOX)
export class ProtectionSchemeInfoBoxParser extends BoxParser {
  parse(): IProtectionSchemeInfoBox {
    var ret = <IProtectionSchemeInfoBox>super.parse();
    ret.originalFormat = <IOriginalFormatBox>this.readBox();
    while (!this.eof()) {
      var box = this.readBox();
      switch (box.type) {
        case BOX_TYPE_IPMP_INFO_BOX:
          ret.IPMPDescriptors = <IIPMPInfoBox>box;
          break;
      }
    }
    return ret;
  }
}

@Type(BOX_TYPE_ORIGINAL_FORMAT_BOX)
export class OriginalFormatBoxParser extends BoxParser {
  parse(): IOriginalFormatBox {
    var ret = <IOriginalFormatBox>super.parse();
    ret.dataFormat = this.readString(4);
    return ret;
  }
}

@Type(BOX_TYPE_IPMP_INFO_BOX)
export class IPMPInfoBoxParser extends FullBoxParser {
  parse(): IIPMPInfoBox {
    var ret = <IIPMPInfoBox>super.parse();
    ret.ipmpDescrs = [];
    while (!this.eof()) {
      ret.ipmpDescrs.push(<IIPMPDescriptor>this.readDescriptor());
    }
    return ret;
  }
}

/**
 * Create a box parser by the box type.
 * @param bytes
 * @param type A box type.
 */
export var createBoxParser = (bytes: Uint8Array, type: string): BoxParser => {
  return new (dict[type] || BoxParser)(bytes);
};
