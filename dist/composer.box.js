"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const composer_descr_1 = require("./composer.descr");
const statics_1 = require("./statics");
const dict = {};
function Type(type) {
    return function (constructor) {
        constructor.TYPE = type;
        dict[type] = constructor;
        return constructor;
    };
}
class BoxBuilder extends composer_descr_1.DescriptorBuilderMixin {
    constructor() {
        super();
        this.skipBytes(4);
        this.writeString(this.constructor.TYPE);
    }
    build() {
        // write box size;
        this.view.setUint32(0, this.byteOffset);
        return super.build();
    }
    writeBox(box) {
        var bytes;
        if (box instanceof Uint8Array) {
            bytes = box;
        }
        else if (box.bytes) {
            bytes = box.bytes;
        }
        else {
            bytes = createBoxBuilder(box).build();
        }
        this.writeBytes(bytes);
    }
}
exports.BoxBuilder = BoxBuilder;
class FullBoxBuilder extends BoxBuilder {
    constructor(box) {
        super();
        this.box = box;
        this.writeUint8(box.version || 0);
        this.writeUint24(box.flags || 0);
    }
}
exports.FullBoxBuilder = FullBoxBuilder;
class BoxListBuilder extends BoxBuilder {
    constructor(boxes) {
        super();
        boxes.forEach(box => this.writeBox(box));
    }
}
exports.BoxListBuilder = BoxListBuilder;
let FileTypeBoxBuilder = class FileTypeBoxBuilder extends BoxBuilder {
    constructor(box) {
        super();
        this.writeString(box.majorBrand);
        this.writeUint32(box.minorVersion);
        box.compatibleBrands.forEach(brand => this.writeString(brand));
    }
};
FileTypeBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_FILE_TYPE_BOX)
], FileTypeBoxBuilder);
exports.FileTypeBoxBuilder = FileTypeBoxBuilder;
let MovieBoxBuilder = class MovieBoxBuilder extends BoxListBuilder {
};
MovieBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_BOX)
], MovieBoxBuilder);
exports.MovieBoxBuilder = MovieBoxBuilder;
let MediaDataBoxBuilder = class MediaDataBoxBuilder extends BoxBuilder {
    constructor(box) {
        super();
        this.writeBytes(box.data);
    }
};
MediaDataBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_DATA_BOX)
], MediaDataBoxBuilder);
exports.MediaDataBoxBuilder = MediaDataBoxBuilder;
let MovieHeaderBoxBuilder = class MovieHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
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
};
MovieHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_HEADER_BOX)
], MovieHeaderBoxBuilder);
exports.MovieHeaderBoxBuilder = MovieHeaderBoxBuilder;
let TrackBoxBuilder = class TrackBoxBuilder extends BoxListBuilder {
};
TrackBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_BOX)
], TrackBoxBuilder);
exports.TrackBoxBuilder = TrackBoxBuilder;
let TrackHeaderBoxBuilder = class TrackHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
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
};
TrackHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_HEADER_BOX)
], TrackHeaderBoxBuilder);
exports.TrackHeaderBoxBuilder = TrackHeaderBoxBuilder;
let TrackReferenceBoxBuilder = class TrackReferenceBoxBuilder extends BoxListBuilder {
};
TrackReferenceBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_REFERENCE_BOX)
], TrackReferenceBoxBuilder);
exports.TrackReferenceBoxBuilder = TrackReferenceBoxBuilder;
class TrackReferenceTypeBoxBuilder extends BoxBuilder {
    constructor(box) {
        super();
        box.trackIDs.forEach(id => this.writeUint32(id));
    }
}
exports.TrackReferenceTypeBoxBuilder = TrackReferenceTypeBoxBuilder;
let HintTrackReferenceTypeBoxBuilder = class HintTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {
};
HintTrackReferenceTypeBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_HINT_TRACK_REFERENCE_TYPE_BOX)
], HintTrackReferenceTypeBoxBuilder);
exports.HintTrackReferenceTypeBoxBuilder = HintTrackReferenceTypeBoxBuilder;
let DescribeTrackReferenceTypeBoxBuilder = class DescribeTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {
};
DescribeTrackReferenceTypeBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_DISCRIBE_TRACK_REFERENCE_TYPE_BOX)
], DescribeTrackReferenceTypeBoxBuilder);
exports.DescribeTrackReferenceTypeBoxBuilder = DescribeTrackReferenceTypeBoxBuilder;
let MediaBoxBuilder = class MediaBoxBuilder extends BoxListBuilder {
};
MediaBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_BOX)
], MediaBoxBuilder);
exports.MediaBoxBuilder = MediaBoxBuilder;
let MediaHeaderBoxBuilder = class MediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.creationTime);
        this.writeUint32(box.modificationTime);
        this.writeUint32(box.timescale);
        this.writeUint32(box.duration);
        this.skipBits(1);
        [].forEach.call(box.language, (c, i) => {
            this.writeBits(box.language.charCodeAt(i) - 0x60, 5);
        });
        this.skipBytes(2);
    }
};
MediaHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_HEADER_BOX)
], MediaHeaderBoxBuilder);
exports.MediaHeaderBoxBuilder = MediaHeaderBoxBuilder;
let HandlerBoxBuilder = class HandlerBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.skipBytes(4);
        this.writeString(box.handlerType);
        this.skipBytes(4 * 3);
        this.writeUTF8StringNullTerminated(box.name);
    }
};
HandlerBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_HANDLER_BOX)
], HandlerBoxBuilder);
exports.HandlerBoxBuilder = HandlerBoxBuilder;
let MediaInformationBoxBuilder = class MediaInformationBoxBuilder extends BoxListBuilder {
};
MediaInformationBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_INFORMATION_BOX)
], MediaInformationBoxBuilder);
exports.MediaInformationBoxBuilder = MediaInformationBoxBuilder;
let VideoMediaHeaderBoxBuilder = class VideoMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint16(box.graphicsmode);
        box.opcolor.forEach(x => this.writeUint16(x));
    }
};
VideoMediaHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_VIDEO_MEDIA_HEADER_BOX)
], VideoMediaHeaderBoxBuilder);
exports.VideoMediaHeaderBoxBuilder = VideoMediaHeaderBoxBuilder;
let SoundMediaHeaderBoxBuilder = class SoundMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeInt16(box.balance);
        this.skipBytes(2);
    }
};
SoundMediaHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_SOUND_MEDIA_HEADER_BOX)
], SoundMediaHeaderBoxBuilder);
exports.SoundMediaHeaderBoxBuilder = SoundMediaHeaderBoxBuilder;
let HintMediaHeaderBoxBuilder = class HintMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint16(box.maxPDUsize);
        this.writeUint16(box.avgPDUsize);
        this.writeUint32(box.maxbitrate);
        this.writeUint32(box.avgbitrate);
        this.skipBytes(4);
    }
};
HintMediaHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_HINT_MEDIA_HEADER_BOX)
], HintMediaHeaderBoxBuilder);
exports.HintMediaHeaderBoxBuilder = HintMediaHeaderBoxBuilder;
let NullMediaHeaderBoxBuilder = class NullMediaHeaderBoxBuilder extends FullBoxBuilder {
};
NullMediaHeaderBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_NULL_MEDIA_HEADER_BOX)
], NullMediaHeaderBoxBuilder);
exports.NullMediaHeaderBoxBuilder = NullMediaHeaderBoxBuilder;
let DataInformationBoxBuilder = class DataInformationBoxBuilder extends BoxListBuilder {
};
DataInformationBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_DATA_INFORMATION_BOX)
], DataInformationBoxBuilder);
exports.DataInformationBoxBuilder = DataInformationBoxBuilder;
let DataEntryUrlBoxBuilder = class DataEntryUrlBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUTF8StringNullTerminated(box.location);
    }
};
DataEntryUrlBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_DATA_ENTRY_URL_BOX)
], DataEntryUrlBoxBuilder);
exports.DataEntryUrlBoxBuilder = DataEntryUrlBoxBuilder;
let DataEntryUrnBoxBuilder = class DataEntryUrnBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUTF8StringNullTerminated(box.name);
        this.writeUTF8StringNullTerminated(box.location);
    }
};
DataEntryUrnBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_DATA_ENTRY_URN_BOX)
], DataEntryUrnBoxBuilder);
exports.DataEntryUrnBoxBuilder = DataEntryUrnBoxBuilder;
let DataReferenceBoxBuilder = class DataReferenceBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.entries.forEach(entry => this.writeBox(entry));
    }
};
DataReferenceBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_DATA_REFERENCE_BOX)
], DataReferenceBoxBuilder);
exports.DataReferenceBoxBuilder = DataReferenceBoxBuilder;
let SampleTableBoxBuilder = class SampleTableBoxBuilder extends BoxListBuilder {
};
SampleTableBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_TABLE_BOX)
], SampleTableBoxBuilder);
exports.SampleTableBoxBuilder = SampleTableBoxBuilder;
let TimeToSampleBoxBuilder = class TimeToSampleBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.entries.forEach(entry => {
            this.writeUint32(entry.sampleCount);
            this.writeUint32(entry.sampleDelta);
        });
    }
};
TimeToSampleBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_TIME_TO_SAMPLE_BOX)
], TimeToSampleBoxBuilder);
exports.TimeToSampleBoxBuilder = TimeToSampleBoxBuilder;
let CompositionOffsetBoxBuilder = class CompositionOffsetBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.entries.forEach(entry => {
            this.writeUint32(entry.sampleCount);
            this.writeUint32(entry.sampleOffset);
        });
    }
};
CompositionOffsetBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_COMPOSITION_OFFSET_BOX)
], CompositionOffsetBoxBuilder);
exports.CompositionOffsetBoxBuilder = CompositionOffsetBoxBuilder;
class SampleEntryBuilder extends BoxBuilder {
    constructor(box) {
        super();
        this.skipBytes(6);
        this.writeUint16(box.dataReferenceIndex);
    }
}
exports.SampleEntryBuilder = SampleEntryBuilder;
class HintSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box) {
        super(box);
        this.writeBytes(box.data);
    }
}
exports.HintSampleEntryBuilder = HintSampleEntryBuilder;
class VisualSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box) {
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
exports.VisualSampleEntryBuilder = VisualSampleEntryBuilder;
let MP4VisualSampleEntryBuilder = class MP4VisualSampleEntryBuilder extends VisualSampleEntryBuilder {
    constructor(box) {
        super(box);
        box.esBox.type = statics_1.BOX_TYPE_ES_DESCRIPTOR_BOX;
        this.writeBox(box.esBox);
    }
};
MP4VisualSampleEntryBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY)
], MP4VisualSampleEntryBuilder);
exports.MP4VisualSampleEntryBuilder = MP4VisualSampleEntryBuilder;
let ESDBoxBuilder = class ESDBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        box.esDescr.tag = statics_1.DESCR_TAG_ES_DESCRIPTOR;
        this.writeDescriptor(box.esDescr);
    }
};
ESDBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_ES_DESCRIPTOR_BOX)
], ESDBoxBuilder);
exports.ESDBoxBuilder = ESDBoxBuilder;
class AudioSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box) {
        super(box);
        this.skipBytes(4 * 2);
        this.writeUint16(box.channelCount);
        this.writeUint16(box.sampleSize);
        this.skipBytes(2);
        this.skipBytes(2);
        this.writeUint32(box.sampleRate * 0x10000);
    }
}
exports.AudioSampleEntryBuilder = AudioSampleEntryBuilder;
let MP4AudioSampleEntryBuilder = class MP4AudioSampleEntryBuilder extends AudioSampleEntryBuilder {
    constructor(box) {
        super(box);
        box.esBox.type = statics_1.BOX_TYPE_ES_DESCRIPTOR_BOX;
        this.writeBox(box.esBox);
    }
};
MP4AudioSampleEntryBuilder = __decorate([
    Type(statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY)
], MP4AudioSampleEntryBuilder);
exports.MP4AudioSampleEntryBuilder = MP4AudioSampleEntryBuilder;
let SampleDescriptionBoxBuilder = class SampleDescriptionBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.boxes.forEach(b => this.writeBox(b));
    }
};
SampleDescriptionBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_DESCRIPTION_BOX)
], SampleDescriptionBoxBuilder);
exports.SampleDescriptionBoxBuilder = SampleDescriptionBoxBuilder;
let SampleSizeBoxBuilder = class SampleSizeBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.sampleSize);
        this.writeUint32(box.sampleCount);
        if (box.sampleSize === 0) {
            box.sampleSizes.forEach(size => this.writeUint32(size));
        }
    }
};
SampleSizeBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_SIZE_BOX)
], SampleSizeBoxBuilder);
exports.SampleSizeBoxBuilder = SampleSizeBoxBuilder;
let SampleToChunkBoxBuilder = class SampleToChunkBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.entries.forEach(entry => {
            this.writeUint32(entry.firstChunk);
            this.writeUint32(entry.samplesPerChunk);
            this.writeUint32(entry.sampleDescriptionIndex);
        });
    }
};
SampleToChunkBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_TO_CHUNK_BOX)
], SampleToChunkBoxBuilder);
exports.SampleToChunkBoxBuilder = SampleToChunkBoxBuilder;
let ChunkOffsetBoxBuilder = class ChunkOffsetBoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.chunkOffsets.forEach((offset, i) => this.writeUint32(offset));
    }
};
ChunkOffsetBoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_CHUNK_OFFSET_BOX)
], ChunkOffsetBoxBuilder);
exports.ChunkOffsetBoxBuilder = ChunkOffsetBoxBuilder;
let ChunkOffset64BoxBuilder = class ChunkOffset64BoxBuilder extends FullBoxBuilder {
    constructor(box) {
        super(box);
        this.writeUint32(box.entryCount);
        box.chunkOffsets.forEach((offset, i) => this.writeUint64(offset));
    }
};
ChunkOffset64BoxBuilder = __decorate([
    Type(statics_1.BOX_TYPE_CHUNK_OFFSET64_BOX)
], ChunkOffset64BoxBuilder);
exports.ChunkOffset64BoxBuilder = ChunkOffset64BoxBuilder;
var createBoxBuilder = (box) => {
    return new (dict[box.type] || BoxBuilder)(box);
};
