import { DescriptorBuilderMixin } from "./composer.descr";
import {
  IFullBox,
  IFileTypeBox,
  IMediaDataBox,
  IMovieHeaderBox,
  ITrackHeaderBox,
  ITrackReferenceTypeBox,
  IMediaHeaderBox,
  IHandlerBox,
  IVideoMediaHeaderBox,
  ISoundMediaHeaderBox,
  IHintMediaHeaderBox,
  IDataEntryUrlBox,
  IDataEntryUrnBox,
  IDataReferenceBox,
  ITimeToSampleBox,
  ICompositionOffsetBox,
  ISampleEntry,
  IHintSampleEntry,
  IVisualSampleEntry,
  IMP4VisualSampleEntry,
  IESDBox,
  IAudioSampleEntry,
  IMP4AudioSampleEntry,
  ISampleDescriptionBox,
  ISampleSizeBox,
  ISampleToChunkBox,
  IChunkOffsetBox,
  IBox
} from "./interface.box";
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
  BOX_TYPE_DATA_ENTRY_URL_BOX,
  BOX_TYPE_DATA_ENTRY_URN_BOX,
  BOX_TYPE_DATA_REFERENCE_BOX,
  BOX_TYPE_SAMPLE_TABLE_BOX,
  BOX_TYPE_TIME_TO_SAMPLE_BOX,
  BOX_TYPE_COMPOSITION_OFFSET_BOX,
  BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY,
  BOX_TYPE_ES_DESCRIPTOR_BOX,
  DESCR_TAG_ES_DESCRIPTOR,
  BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY,
  BOX_TYPE_SAMPLE_DESCRIPTION_BOX,
  BOX_TYPE_SAMPLE_SIZE_BOX,
  BOX_TYPE_SAMPLE_TO_CHUNK_BOX,
  BOX_TYPE_CHUNK_OFFSET_BOX
} from "./statics";

const dict: { [type: string]: { new (box: IBox): BoxBuilder } } = {};
function Type(type: string) {
  return function(constructor: any) {
    constructor.TYPE = type;
    dict[type] = constructor;
    return constructor;
  };
}

export class BoxBuilder extends DescriptorBuilderMixin {
  constructor() {
    super();
    this.skipBytes(4);
    this.writeString((<any>this.constructor).TYPE);
  }

  build(): Uint8Array {
    // write box size;
    this.view.setUint32(0, this.byteOffset);
    return super.build();
  }

  writeBox(box: any) {
    var bytes: Uint8Array;
    if (box instanceof Uint8Array) {
      bytes = box;
    } else if (box.bytes) {
      bytes = box.bytes;
    } else {
      bytes = createBoxBuilder(box).build();
    }
    this.writeBytes(bytes);
  }
}

export class FullBoxBuilder extends BoxBuilder {
  constructor(public box: IFullBox) {
    super();
    this.writeUint8(box.version || 0);
    this.writeUint24(box.flags || 0);
  }
}

export class BoxListBuilder extends BoxBuilder {
  constructor(boxes: any[]) {
    super();
    boxes.forEach(box => this.writeBox(box));
  }
}

@Type(BOX_TYPE_FILE_TYPE_BOX)
export class FileTypeBoxBuilder extends BoxBuilder {
  constructor(box: IFileTypeBox) {
    super();
    this.writeString(box.majorBrand);
    this.writeUint32(box.minorVersion);
    box.compatibleBrands.forEach(brand => this.writeString(brand));
  }
}

@Type(BOX_TYPE_MOVIE_BOX)
export class MovieBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_MEDIA_DATA_BOX)
export class MediaDataBoxBuilder extends BoxBuilder {
  constructor(box: IMediaDataBox) {
    super();
    this.writeBytes(box.data);
  }
}

@Type(BOX_TYPE_MOVIE_HEADER_BOX)
export class MovieHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: IMovieHeaderBox) {
    super(box);
    this.writeUint32(box.creationTime);
    this.writeUint32(box.modificationTime);
    this.writeUint32(box.timescale);
    this.writeUint32(box.duration);
    this.writeInt32(box.rate * 0x10000);
    this.writeInt16(box.volume * 0x100);
    this.skipBytes(2);
    this.skipBytes(8);
    box.matrix.forEach(x => this.writeInt32(x));
    this.skipBytes(4 * 6);
    this.writeUint32(box.nextTrackID);
  }
}

@Type(BOX_TYPE_TRACK_BOX)
export class TrackBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_TRACK_HEADER_BOX)
export class TrackHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: ITrackHeaderBox) {
    super(box);
    this.writeUint32(box.creationTime);
    this.writeUint32(box.modificationTime);
    this.writeUint32(box.trackID);
    this.skipBytes(4);
    this.writeUint32(box.duration);
    this.skipBytes(4 * 2);
    this.writeInt16(box.layer);
    this.writeInt16(box.alternateGroup);
    this.writeInt16(box.volume * 0x100);
    this.skipBytes(2);
    box.matrix.forEach(x => this.writeInt32(x));
    this.writeUint32(box.width * 0x10000);
    this.writeUint32(box.height * 0x10000);
  }
}

@Type(BOX_TYPE_TRACK_REFERENCE_BOX)
export class TrackReferenceBoxBuilder extends BoxListBuilder {}

export class TrackReferenceTypeBoxBuilder extends BoxBuilder {
  constructor(box: ITrackReferenceTypeBox) {
    super();
    box.trackIDs.forEach(id => this.writeUint32(id));
  }
}

@Type(BOX_TYPE_HINT_TRACK_REFERENCE_TYPE_BOX)
export class HintTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {}

@Type(BOX_TYPE_DISCRIBE_TRACK_REFERENCE_TYPE_BOX)
export class DescribeTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {}

@Type(BOX_TYPE_MEDIA_BOX)
export class MediaBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_MEDIA_HEADER_BOX)
export class MediaHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: IMediaHeaderBox) {
    super(box);
    this.writeUint32(box.creationTime);
    this.writeUint32(box.modificationTime);
    this.writeUint32(box.timescale);
    this.writeUint32(box.duration);
    this.skipBits(1);
    [].forEach.call(box.language, (c: string, i: number) => {
      this.writeBits(box.language.charCodeAt(i) - 0x60, 5)
    });
    this.skipBytes(2);
  }
}

@Type(BOX_TYPE_HANDLER_BOX)
export class HandlerBoxBuilder extends FullBoxBuilder {
  constructor(box: IHandlerBox) {
    super(box);
    this.skipBytes(4);
    this.writeString(box.handlerType);
    this.skipBytes(4 * 3);
    this.writeUTF8StringNullTerminated(box.name);
  }
}

@Type(BOX_TYPE_MEDIA_INFORMATION_BOX)
export class MediaInformationBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_VIDEO_MEDIA_HEADER_BOX)
export class VideoMediaHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: IVideoMediaHeaderBox) {
    super(box);
    this.writeUint16(box.graphicsmode);
    box.opcolor.forEach(x => this.writeUint16(x));
  }
}

@Type(BOX_TYPE_SOUND_MEDIA_HEADER_BOX)
export class SoundMediaHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: ISoundMediaHeaderBox) {
    super(box);
    this.writeInt16(box.balance);
    this.skipBytes(2);
  }
}

@Type(BOX_TYPE_HINT_MEDIA_HEADER_BOX)
export class HintMediaHeaderBoxBuilder extends FullBoxBuilder {
  constructor(box: IHintMediaHeaderBox) {
    super(box);
    this.writeUint16(box.maxPDUsize);
    this.writeUint16(box.avgPDUsize);
    this.writeUint32(box.maxbitrate);
    this.writeUint32(box.avgbitrate);
    this.skipBytes(4);
  }
}

@Type(BOX_TYPE_NULL_MEDIA_HEADER_BOX)
export class NullMediaHeaderBoxBuilder extends FullBoxBuilder {}

@Type(BOX_TYPE_DATA_INFORMATION_BOX)
export class DataInformationBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_DATA_ENTRY_URL_BOX)
export class DataEntryUrlBoxBuilder extends FullBoxBuilder {
  constructor(box: IDataEntryUrlBox) {
    super(box);
    this.writeUTF8StringNullTerminated(box.location);
  }
}

@Type(BOX_TYPE_DATA_ENTRY_URN_BOX)
export class DataEntryUrnBoxBuilder extends FullBoxBuilder {
  constructor(box: IDataEntryUrnBox) {
    super(box);
    this.writeUTF8StringNullTerminated(box.name);
    this.writeUTF8StringNullTerminated(box.location);
  }
}

@Type(BOX_TYPE_DATA_REFERENCE_BOX)
export class DataReferenceBoxBuilder extends FullBoxBuilder {
  constructor(box: IDataReferenceBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.entries.forEach(entry => this.writeBox(entry));
  }
}

@Type(BOX_TYPE_SAMPLE_TABLE_BOX)
export class SampleTableBoxBuilder extends BoxListBuilder {}

@Type(BOX_TYPE_TIME_TO_SAMPLE_BOX)
export class TimeToSampleBoxBuilder extends FullBoxBuilder {
  constructor(box: ITimeToSampleBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.entries.forEach(entry => {
      this.writeUint32(entry.sampleCount);
      this.writeUint32(entry.sampleDelta);
    });
  }
}

@Type(BOX_TYPE_COMPOSITION_OFFSET_BOX)
export class CompositionOffsetBoxBuilder extends FullBoxBuilder {
  constructor(box: ICompositionOffsetBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.entries.forEach(entry => {
      this.writeUint32(entry.sampleCount);
      this.writeUint32(entry.sampleOffset);
    });
  }
}

export class SampleEntryBuilder extends BoxBuilder {
  constructor(box: ISampleEntry) {
    super();
    this.skipBytes(6);
    this.writeUint16(box.dataReferenceIndex);
  }
}

export class HintSampleEntryBuilder extends SampleEntryBuilder {
  constructor(box: IHintSampleEntry) {
    super(box);
    this.writeBytes(box.data);
  }
}

export class VisualSampleEntryBuilder extends SampleEntryBuilder {
  constructor(box: IVisualSampleEntry) {
    super(box);
    this.skipBytes(2);
    this.skipBytes(2);
    this.skipBytes(4 * 3);
    this.writeUint16(box.width);
    this.writeUint16(box.height);
    this.writeUint32(box.horizresolution);
    this.writeUint32(box.vertresolution);
    this.skipBytes(4);
    this.writeUint16(box.frameCount);
    this.writeString(box.compressorname);
    this.writeUint16(box.depth);
    this.writeInt16(-1);
  }
}

@Type(BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY)
export class MP4VisualSampleEntryBuilder extends VisualSampleEntryBuilder {
  constructor(box: IMP4VisualSampleEntry) {
    super(box);
    box.esBox.type = BOX_TYPE_ES_DESCRIPTOR_BOX;
    this.writeBox(box.esBox);
  }
}

@Type(BOX_TYPE_ES_DESCRIPTOR_BOX)
export class ESDBoxBuilder extends FullBoxBuilder {
  constructor(box: IESDBox) {
    super(box);
    box.esDescr.tag = DESCR_TAG_ES_DESCRIPTOR;
    this.writeDescriptor(box.esDescr);
  }
}

export class AudioSampleEntryBuilder extends SampleEntryBuilder {
  constructor(box: IAudioSampleEntry) {
    super(box);
    this.skipBytes(4 * 2);
    this.writeUint16(box.channelCount);
    this.writeUint16(box.sampleSize);
    this.skipBytes(2);
    this.skipBytes(2);
    this.writeUint32(box.sampleRate * 0x10000);
  }
}

@Type(BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY)
export class MP4AudioSampleEntryBuilder extends AudioSampleEntryBuilder {
  constructor(box: IMP4AudioSampleEntry) {
    super(box);
    box.esBox.type = BOX_TYPE_ES_DESCRIPTOR_BOX;
    this.writeBox(box.esBox);
  }
}

@Type(BOX_TYPE_SAMPLE_DESCRIPTION_BOX)
export class SampleDescriptionBoxBuilder extends FullBoxBuilder {
  constructor(box: ISampleDescriptionBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.boxes.forEach(b => this.writeBox(b));
  }
}

@Type(BOX_TYPE_SAMPLE_SIZE_BOX)
export class SampleSizeBoxBuilder extends FullBoxBuilder {
  constructor(box: ISampleSizeBox) {
    super(box);
    this.writeUint32(box.sampleSize);
    this.writeUint32(box.sampleCount);
    if (box.sampleSize === 0) {
      box.sampleSizes.forEach(size => this.writeUint32(size));
    }
  }
}

@Type(BOX_TYPE_SAMPLE_TO_CHUNK_BOX)
export class SampleToChunkBoxBuilder extends FullBoxBuilder {
  constructor(box: ISampleToChunkBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.entries.forEach(entry => {
      this.writeUint32(entry.firstChunk);
      this.writeUint32(entry.samplesPerChunk);
      this.writeUint32(entry.sampleDescriptionIndex);
    });
  }
}

@Type(BOX_TYPE_CHUNK_OFFSET_BOX)
export class ChunkOffsetBoxBuilder extends FullBoxBuilder {
  constructor(box: IChunkOffsetBox) {
    super(box);
    this.writeUint32(box.entryCount);
    box.chunkOffsets.forEach((offset, i) => this.writeUint32(offset));
  }
}

var createBoxBuilder = (box: IBox): BoxBuilder => {
  return new (dict[box.type as string] || BoxBuilder)(box);
};
