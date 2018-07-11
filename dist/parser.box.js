"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataview_1 = require("./dataview");
const parser_descr_1 = require("./parser.descr");
const statics_1 = require("./statics");
const dict = {};
function Type(type) {
    return function (constructor) {
        constructor.TYPE = type;
        dict[type] = constructor;
        return constructor;
    };
}
var getBoxInfo = (bytes, offset = 0) => {
    var view = new dataview_1.DataView2(bytes, offset);
    return {
        byteLength: view.getUint32(0),
        type: view.getString(4, 4)
    };
};
var getFullBoxInfo = (bytes, offset = 0) => {
    var view = new dataview_1.DataView2(bytes, offset);
    return {
        byteLength: view.getUint32(0),
        type: view.getString(4, 4),
        version: view.getUint8(8),
        flags: view.getUint24(9)
    };
};
class BoxParserMixin extends parser_descr_1.DescriptorParserMixin {
    readBox() {
        var info = getBoxInfo(this.bytes, this.byteOffset);
        return exports.createBoxParser(this.readBytes(info.byteLength), info.type).parse();
    }
}
exports.BoxParserMixin = BoxParserMixin;
class RootParser extends BoxParserMixin {
    parse() {
        var ret = [];
        while (!this.eof())
            ret.push(this.readBox());
        return ret;
    }
}
exports.RootParser = RootParser;
class BoxParser extends BoxParserMixin {
    constructor(bytes) {
        super(bytes);
        this.byteLength = this.bytes.length;
        this.skipBytes(4);
        this.type = this.readString(4);
    }
    parse() {
        return {
            byteLength: this.byteLength,
            type: this.type,
            bytes: this.bytes
        };
    }
}
exports.BoxParser = BoxParser;
class FullBoxParser extends BoxParser {
    constructor(bytes) {
        super(bytes);
        this.version = this.readUint8();
        this.flags = this.readUint24();
    }
    parse() {
        var ret = super.parse();
        ret.version = this.version;
        ret.flags = this.flags;
        return ret;
    }
}
exports.FullBoxParser = FullBoxParser;
let FileTypeBoxParser = class FileTypeBoxParser extends BoxParser {
    parse() {
        var ret = super.parse();
        ret.majorBrand = this.readString(4);
        ret.minorVersion = this.readUint32();
        ret.compatibleBrands = [];
        while (!this.eof())
            ret.compatibleBrands.push(this.readString(4));
        return ret;
    }
};
FileTypeBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_FILE_TYPE_BOX)
], FileTypeBoxParser);
exports.FileTypeBoxParser = FileTypeBoxParser;
class BoxListParser extends BoxParser {
    parse() {
        var ret = super.parse();
        var boxes = [];
        while (!this.eof())
            boxes.push(this.readBox());
        ret.boxes = boxes;
        return ret;
    }
}
exports.BoxListParser = BoxListParser;
let MovieBoxParser = class MovieBoxParser extends BoxListParser {
};
MovieBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_BOX)
], MovieBoxParser);
exports.MovieBoxParser = MovieBoxParser;
let MediaDataBoxParser = class MediaDataBoxParser extends BoxParser {
    parse() {
        var ret = super.parse();
        ret.data = this.bytes.subarray(8);
        return ret;
    }
};
MediaDataBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_DATA_BOX)
], MediaDataBoxParser);
exports.MediaDataBoxParser = MediaDataBoxParser;
let MovieHeaderBoxParser = class MovieHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.matrix = [];
        ret.creationTime = this.readUint32();
        ret.modificationTime = this.readUint32();
        ret.timescale = this.readUint32();
        ret.duration = this.readUint32();
        ret.rate = this.readUint32();
        ret.volume = this.readUint16();
        this.skipBytes(2);
        this.skipBytes(4 * 2);
        for (var i = 0; i < 9; ++i)
            ret.matrix.push(this.readInt32());
        this.skipBytes(4 * 6);
        ret.nextTrackID = this.readUint32();
        return ret;
    }
};
MovieHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_HEADER_BOX)
], MovieHeaderBoxParser);
exports.MovieHeaderBoxParser = MovieHeaderBoxParser;
let TrackBoxParser = class TrackBoxParser extends BoxListParser {
};
TrackBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_BOX)
], TrackBoxParser);
exports.TrackBoxParser = TrackBoxParser;
let TrackHeaderBoxParser = class TrackHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
        for (var i = 0; i < 9; ++i)
            ret.matrix.push(this.readInt32());
        ret.width = this.readUint32() / 0x10000;
        ret.height = this.readUint32() / 0x10000;
        return ret;
    }
};
TrackHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_HEADER_BOX)
], TrackHeaderBoxParser);
exports.TrackHeaderBoxParser = TrackHeaderBoxParser;
let TrackReferenceBox = class TrackReferenceBox extends BoxListParser {
};
TrackReferenceBox = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_REFERENCE_BOX)
], TrackReferenceBox);
exports.TrackReferenceBox = TrackReferenceBox;
class TrackReferenceTypeBox extends BoxParser {
    parse() {
        var ret = super.parse();
        ret.trackIDs = [];
        while (!this.eof())
            ret.trackIDs.push(this.readUint32());
        return ret;
    }
}
exports.TrackReferenceTypeBox = TrackReferenceTypeBox;
let HintTrackReferenceTypeBox = class HintTrackReferenceTypeBox extends TrackReferenceTypeBox {
};
HintTrackReferenceTypeBox = __decorate([
    Type(statics_1.BOX_TYPE_HINT_TRACK_REFERENCE_TYPE_BOX)
], HintTrackReferenceTypeBox);
exports.HintTrackReferenceTypeBox = HintTrackReferenceTypeBox;
let DescribeTrackReferenceTypeBox = class DescribeTrackReferenceTypeBox extends TrackReferenceTypeBox {
};
DescribeTrackReferenceTypeBox = __decorate([
    Type(statics_1.BOX_TYPE_DISCRIBE_TRACK_REFERENCE_TYPE_BOX)
], DescribeTrackReferenceTypeBox);
exports.DescribeTrackReferenceTypeBox = DescribeTrackReferenceTypeBox;
let MediaBoxParser = class MediaBoxParser extends BoxListParser {
};
MediaBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_BOX)
], MediaBoxParser);
exports.MediaBoxParser = MediaBoxParser;
let MediaHeaderBoxParser = class MediaHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.creationTime = this.readUint32();
        ret.modificationTime = this.readUint32();
        ret.timescale = this.readUint32();
        ret.duration = this.readUint32();
        this.skipBits(1);
        ret.language = String.fromCharCode.apply(null, [this.readBits(5), this.readBits(5), this.readBits(5)].map(x => x + 0x60));
        return ret;
    }
};
MediaHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_HEADER_BOX)
], MediaHeaderBoxParser);
exports.MediaHeaderBoxParser = MediaHeaderBoxParser;
let HandlerBoxParser = class HandlerBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        this.skipBytes(4);
        ret.handlerType = this.readString(4);
        this.skipBytes(4 * 3);
        ret.name = this.readUTF8StringNullTerminated();
        return ret;
    }
};
HandlerBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_HANDLER_BOX)
], HandlerBoxParser);
exports.HandlerBoxParser = HandlerBoxParser;
let MediaInformationBoxParser = class MediaInformationBoxParser extends BoxListParser {
};
MediaInformationBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MEDIA_INFORMATION_BOX)
], MediaInformationBoxParser);
exports.MediaInformationBoxParser = MediaInformationBoxParser;
let VideoMediaHeaderBoxParser = class VideoMediaHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var view = new dataview_1.DataView2(this.bytes);
        ret.opcolor = [];
        ret.graphicsmode = this.readUint16();
        for (var i = 0; i < 3; ++i)
            ret.opcolor.push(this.readUint16());
        return ret;
    }
};
VideoMediaHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_VIDEO_MEDIA_HEADER_BOX)
], VideoMediaHeaderBoxParser);
exports.VideoMediaHeaderBoxParser = VideoMediaHeaderBoxParser;
let SoundMediaHeaderBoxParser = class SoundMediaHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.balance = this.readInt16();
        return ret;
    }
};
SoundMediaHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SOUND_MEDIA_HEADER_BOX)
], SoundMediaHeaderBoxParser);
exports.SoundMediaHeaderBoxParser = SoundMediaHeaderBoxParser;
let HintMediaHeaderBoxParser = class HintMediaHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.maxPDUsize = this.readUint16();
        ret.avgPDUsize = this.readUint16();
        ret.maxbitrate = this.readUint32();
        ret.avgbitrate = this.readUint32();
        return ret;
    }
};
HintMediaHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_HINT_MEDIA_HEADER_BOX)
], HintMediaHeaderBoxParser);
exports.HintMediaHeaderBoxParser = HintMediaHeaderBoxParser;
let NullMediaHeaderBoxParser = class NullMediaHeaderBoxParser extends FullBoxParser {
};
NullMediaHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_NULL_MEDIA_HEADER_BOX)
], NullMediaHeaderBoxParser);
exports.NullMediaHeaderBoxParser = NullMediaHeaderBoxParser;
let DataInformationBoxParser = class DataInformationBoxParser extends BoxListParser {
};
DataInformationBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_DATA_INFORMATION_BOX)
], DataInformationBoxParser);
exports.DataInformationBoxParser = DataInformationBoxParser;
let DataReferenceBoxParser = class DataReferenceBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.entryCount = this.readUint32();
        ret.entries = [];
        while (!this.eof()) {
            ret.entries.push(this.readBox());
        }
        return ret;
    }
};
DataReferenceBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_DATA_REFERENCE_BOX)
], DataReferenceBoxParser);
exports.DataReferenceBoxParser = DataReferenceBoxParser;
let DataEntryUrlBoxParser = class DataEntryUrlBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.location = this.readUTF8StringNullTerminated();
        return ret;
    }
};
DataEntryUrlBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_DATA_ENTRY_URL_BOX)
], DataEntryUrlBoxParser);
exports.DataEntryUrlBoxParser = DataEntryUrlBoxParser;
let DataEntryUrnBoxParser = class DataEntryUrnBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.name = this.readUTF8StringNullTerminated();
        ret.location = this.readUTF8StringNullTerminated();
        return ret;
    }
};
DataEntryUrnBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_DATA_ENTRY_URN_BOX)
], DataEntryUrnBoxParser);
exports.DataEntryUrnBoxParser = DataEntryUrnBoxParser;
let SampleTableBoxParser = class SampleTableBoxParser extends BoxListParser {
};
SampleTableBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_TABLE_BOX)
], SampleTableBoxParser);
exports.SampleTableBoxParser = SampleTableBoxParser;
let TimeToSampleBoxParser = class TimeToSampleBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
TimeToSampleBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TIME_TO_SAMPLE_BOX)
], TimeToSampleBoxParser);
exports.TimeToSampleBoxParser = TimeToSampleBoxParser;
let CompositionOffsetBoxParser = class CompositionOffsetBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
CompositionOffsetBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_COMPOSITION_OFFSET_BOX)
], CompositionOffsetBoxParser);
exports.CompositionOffsetBoxParser = CompositionOffsetBoxParser;
class SampleEntryParser extends BoxParser {
    parse() {
        var ret = super.parse();
        this.skipBytes(6);
        ret.dataReferenceIndex = this.readUint16();
        return ret;
    }
}
exports.SampleEntryParser = SampleEntryParser;
class HintSampleEntryParser extends SampleEntryParser {
    parse() {
        var ret = super.parse();
        ret.data = this.bytes.subarray(16);
        return ret;
    }
}
exports.HintSampleEntryParser = HintSampleEntryParser;
class VisualSampleEntryParser extends SampleEntryParser {
    parse() {
        var ret = super.parse();
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
exports.VisualSampleEntryParser = VisualSampleEntryParser;
class AudioSampleEntryParser extends SampleEntryParser {
    parse() {
        var ret = super.parse();
        this.skipBytes(8);
        ret.channelCount = this.readUint16();
        ret.sampleSize = this.readUint16();
        this.skipBytes(4);
        ret.sampleRate = this.readUint32() / 0x10000;
        return ret;
    }
}
exports.AudioSampleEntryParser = AudioSampleEntryParser;
let ESDBoxParser = class ESDBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.esDescr = this.readDescriptor();
        return ret;
    }
};
ESDBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_ES_DESCRIPTOR_BOX)
], ESDBoxParser);
exports.ESDBoxParser = ESDBoxParser;
let MP4VisualSampleEntryParser = class MP4VisualSampleEntryParser extends VisualSampleEntryParser {
    parse() {
        var ret = super.parse();
        ret.esBox = this.readBox();
        return ret;
    }
};
MP4VisualSampleEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_MP4_VISUAL_SAMPLE_ENTRY)
], MP4VisualSampleEntryParser);
exports.MP4VisualSampleEntryParser = MP4VisualSampleEntryParser;
let MP4AudioSampleEntryParser = class MP4AudioSampleEntryParser extends AudioSampleEntryParser {
    parse() {
        var ret = super.parse();
        ret.esBox = this.readBox();
        return ret;
    }
};
MP4AudioSampleEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY)
], MP4AudioSampleEntryParser);
exports.MP4AudioSampleEntryParser = MP4AudioSampleEntryParser;
let MpegSampleEntryParser = class MpegSampleEntryParser extends SampleEntryParser {
    parse() {
        var ret = super.parse();
        ret.esBox = this.readBox();
        return ret;
    }
};
MpegSampleEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_MPEG_SAMPLE_ENTRY)
], MpegSampleEntryParser);
exports.MpegSampleEntryParser = MpegSampleEntryParser;
let SampleDescriptionBoxParser = class SampleDescriptionBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.boxes = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.boxes.push(this.readBox());
        }
        return ret;
    }
};
SampleDescriptionBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_DESCRIPTION_BOX)
], SampleDescriptionBoxParser);
exports.SampleDescriptionBoxParser = SampleDescriptionBoxParser;
let SampleSizeBoxParser = class SampleSizeBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
SampleSizeBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_SIZE_BOX)
], SampleSizeBoxParser);
exports.SampleSizeBoxParser = SampleSizeBoxParser;
let SampleToChunkBoxParser = class SampleToChunkBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
SampleToChunkBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_TO_CHUNK_BOX)
], SampleToChunkBoxParser);
exports.SampleToChunkBoxParser = SampleToChunkBoxParser;
let ChunkOffsetBoxParser = class ChunkOffsetBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.chunkOffsets = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.chunkOffsets.push(this.readUint32());
        }
        return ret;
    }
};
ChunkOffsetBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_CHUNK_OFFSET_BOX)
], ChunkOffsetBoxParser);
exports.ChunkOffsetBoxParser = ChunkOffsetBoxParser;
let ChunkOffset64BoxParser = class ChunkOffset64BoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.chunkOffsets = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.chunkOffsets.push(this.readUint64());
        }
        return ret;
    }
};
ChunkOffset64BoxParser = __decorate([
    Type(statics_1.BOX_TYPE_CHUNK_OFFSET64_BOX)
], ChunkOffset64BoxParser);
exports.ChunkOffset64BoxParser = ChunkOffset64BoxParser;
let SyncSampleBoxParser = class SyncSampleBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.sampleNumbers = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.sampleNumbers.push(this.readUint32());
        }
        return ret;
    }
};
SyncSampleBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SYNC_SAMPLE_BOX)
], SyncSampleBoxParser);
exports.SyncSampleBoxParser = SyncSampleBoxParser;
let ShadowSyncSampleBoxParser = class ShadowSyncSampleBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
ShadowSyncSampleBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SHADOW_SYNC_SAMPLE_BOX)
], ShadowSyncSampleBoxParser);
exports.ShadowSyncSampleBoxParser = ShadowSyncSampleBoxParser;
let DegradationPriorityBoxParser = class DegradationPriorityBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.priorities = [];
        while (!this.eof()) {
            ret.priorities.push(this.readUint16());
        }
        return ret;
    }
};
DegradationPriorityBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_DEGRADATION_PRIORITY_BOX)
], DegradationPriorityBoxParser);
exports.DegradationPriorityBoxParser = DegradationPriorityBoxParser;
let PaddingBitsBoxParser = class PaddingBitsBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var sampleCount = this.readUint32();
        var pad1;
        var pad2;
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
};
PaddingBitsBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_PADDING_BITS_BOX)
], PaddingBitsBoxParser);
exports.PaddingBitsBoxParser = PaddingBitsBoxParser;
let FreeSpaceBoxParser = class FreeSpaceBoxParser extends MediaBoxParser {
};
FreeSpaceBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_FREE_SPACE_BOX)
], FreeSpaceBoxParser);
exports.FreeSpaceBoxParser = FreeSpaceBoxParser;
let SkipBoxParser = class SkipBoxParser extends MediaBoxParser {
};
SkipBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SKIP_BOX)
], SkipBoxParser);
exports.SkipBoxParser = SkipBoxParser;
let EditBoxParser = class EditBoxParser extends BoxListParser {
};
EditBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_EDIT_BOX)
], EditBoxParser);
exports.EditBoxParser = EditBoxParser;
let EditListBoxParser = class EditListBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
EditListBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_EDIT_LIST_BOX)
], EditListBoxParser);
exports.EditListBoxParser = EditListBoxParser;
let CopyrightBoxParser = class CopyrightBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        this.skipBits(1);
        ret.language = String.fromCharCode(this.readBits(5), this.readBits(5), this.readBits(5));
        ret.notice = this.readUTF8StringNullTerminated();
        return ret;
    }
};
CopyrightBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_COPYRIGHT_BOX)
], CopyrightBoxParser);
exports.CopyrightBoxParser = CopyrightBoxParser;
let MovieExtendsBoxParser = class MovieExtendsBoxParser extends BoxListParser {
};
MovieExtendsBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_EXTENDS_BOX)
], MovieExtendsBoxParser);
exports.MovieExtendsBoxParser = MovieExtendsBoxParser;
let MovieExtendsHeaderBoxParser = class MovieExtendsHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.fragmentDuration = this.readUint32();
        return ret;
    }
};
MovieExtendsHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_EXTENDS_HEADER_BOX)
], MovieExtendsHeaderBoxParser);
exports.MovieExtendsHeaderBoxParser = MovieExtendsHeaderBoxParser;
let TrackExtendsBoxParser = class TrackExtendsBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.trackID = this.readUint32();
        ret.defaultSampleDescriptionIndex = this.readUint32();
        ret.defaultSampleDuration = this.readUint32();
        ret.defaultSampleSize = this.readUint32();
        ret.defaultSampleFlags = this.readUint32();
        return ret;
    }
};
TrackExtendsBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_EXTENDS_BOX)
], TrackExtendsBoxParser);
exports.TrackExtendsBoxParser = TrackExtendsBoxParser;
let MovieFlagmentBoxParser = class MovieFlagmentBoxParser extends BoxListParser {
};
MovieFlagmentBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_FLAGMENT_BOX)
], MovieFlagmentBoxParser);
exports.MovieFlagmentBoxParser = MovieFlagmentBoxParser;
let MovieFragmentHeaderBoxParser = class MovieFragmentHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.sequenceNumber = this.readUint32();
        return ret;
    }
};
MovieFragmentHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_FRAGMENT_HEADER_BOX)
], MovieFragmentHeaderBoxParser);
exports.MovieFragmentHeaderBoxParser = MovieFragmentHeaderBoxParser;
let TrackFragmentBoxParser = class TrackFragmentBoxParser extends BoxListParser {
};
TrackFragmentBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_FRAGMENT_BOX)
], TrackFragmentBoxParser);
exports.TrackFragmentBoxParser = TrackFragmentBoxParser;
let TrackFragmentHeaderBoxParser = class TrackFragmentHeaderBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.trackID = this.readUint32();
        if (ret.flags & 0x000001)
            ret.baseDataOffset = this.readBytes(8);
        if (ret.flags & 0x000002)
            ret.sampleDescriptionIndex = this.readUint32();
        if (ret.flags & 0x000008)
            ret.defaultSampleDuration = this.readUint32();
        if (ret.flags & 0x000010)
            ret.defaultSampleSize = this.readUint32();
        if (ret.flags & 0x000020)
            ret.defaultSampleFlags = this.readUint32();
        return ret;
    }
};
TrackFragmentHeaderBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_FRAGMENT_HEADER_BOX)
], TrackFragmentHeaderBoxParser);
exports.TrackFragmentHeaderBoxParser = TrackFragmentHeaderBoxParser;
let TrackRunBoxParser = class TrackRunBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var sampleCount = this.readUint32();
        ret.sampleCount = sampleCount;
        if (ret.flags & 0x000001)
            ret.dataOffset = this.readInt32();
        if (ret.flags & 0x000002)
            ret.firstSampleFlats = this.readUint32();
        ret.samples = [];
        for (var i = 0; i < sampleCount; ++i) {
            ret.samples.push({
                sampleDuration: ret.flags & 0x000100 ? this.readUint32() : undefined,
                sampleSize: ret.flags & 0x000200 ? this.readUint32() : undefined,
                sampleFlags: ret.flags & 0x000400 ? this.readUint32() : undefined,
                sampleCompositionTimeOffset: ret.flags & 0x000800 ? this.readUint32() : undefined
            });
        }
        return ret;
    }
};
TrackRunBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_RUN_BOX)
], TrackRunBoxParser);
exports.TrackRunBoxParser = TrackRunBoxParser;
let TrackFragmentRandomAccessBoxParser = class TrackFragmentRandomAccessBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
TrackFragmentRandomAccessBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_TRACK_FRAGMENT_RANDOM_ACCESS_BOX)
], TrackFragmentRandomAccessBoxParser);
exports.TrackFragmentRandomAccessBoxParser = TrackFragmentRandomAccessBoxParser;
let MovieFragmentRandomAccessOffsetBoxParser = class MovieFragmentRandomAccessOffsetBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.size = this.readUint32();
        return ret;
    }
};
MovieFragmentRandomAccessOffsetBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_MOVIE_FRAGMENT_RANDOM_ACCESS_OFFSET_BOX)
], MovieFragmentRandomAccessOffsetBoxParser);
exports.MovieFragmentRandomAccessOffsetBoxParser = MovieFragmentRandomAccessOffsetBoxParser;
let SampleDependencyTypeBoxParser = class SampleDependencyTypeBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
SampleDependencyTypeBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_DEPENDENCY_TYPE_BOX)
], SampleDependencyTypeBoxParser);
exports.SampleDependencyTypeBoxParser = SampleDependencyTypeBoxParser;
let SampleToGroupBoxParser = class SampleToGroupBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
SampleToGroupBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_TO_GROUPE_BOX)
], SampleToGroupBoxParser);
exports.SampleToGroupBoxParser = SampleToGroupBoxParser;
class SampleGroupDescriptionEntryParser extends BoxParser {
}
exports.SampleGroupDescriptionEntryParser = SampleGroupDescriptionEntryParser;
class VisualSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
exports.VisualSampleGroupEntryParser = VisualSampleGroupEntryParser;
class AudioSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
exports.AudioSampleGroupEntryParser = AudioSampleGroupEntryParser;
class HintSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
exports.HintSampleGroupEntryParser = HintSampleGroupEntryParser;
let SampleGroupDescriptionBoxParser = class SampleGroupDescriptionBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.groupingType = this.readUint32();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.entries = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.entries.push(this.readBox());
        }
        return ret;
    }
};
SampleGroupDescriptionBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_GROUP_DESCRIPTION_BOX)
], SampleGroupDescriptionBoxParser);
exports.SampleGroupDescriptionBoxParser = SampleGroupDescriptionBoxParser;
let VisualRollRecoveryEntryParser = class VisualRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
    parse() {
        var ret = super.parse();
        ret.rollDistance = this.readInt16();
        return ret;
    }
};
VisualRollRecoveryEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_ROLL_RECOVERY_ENTRY)
], VisualRollRecoveryEntryParser);
exports.VisualRollRecoveryEntryParser = VisualRollRecoveryEntryParser;
let AudioRollRecoveryEntryParser = class AudioRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
    parse() {
        var ret = super.parse();
        ret.rollDistance = this.readInt16();
        return ret;
    }
};
AudioRollRecoveryEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_ROLL_RECOVERY_ENTRY)
], AudioRollRecoveryEntryParser);
exports.AudioRollRecoveryEntryParser = AudioRollRecoveryEntryParser;
let SampleScaleBoxParser = class SampleScaleBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        this.skipBits(7);
        ret.constraintFlag = this.readBits(1);
        ret.scaleMethod = this.readUint8();
        ret.displayCenterX = this.readInt16();
        ret.displayCenterY = this.readInt16();
        return ret;
    }
};
SampleScaleBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SAMPLE_SCALE_BOX)
], SampleScaleBoxParser);
exports.SampleScaleBoxParser = SampleScaleBoxParser;
let SubSampleInformationBoxParser = class SubSampleInformationBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = this.readUint32();
        ret.entryCount = entryCount;
        ret.entries = [];
        for (var i = 0; i < entryCount; ++i) {
            var sampleDelta = this.readUint32();
            var subsampleCount = this.readUint16();
            var samples = [];
            for (var j = 0; j < subsampleCount; ++j) {
                samples.push({
                    subsampleSize: ret.version === 1 ? this.readUint32() : this.readUint16(),
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
};
SubSampleInformationBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_SUB_SAMPLE_INFORMATION_BOX)
], SubSampleInformationBoxParser);
exports.SubSampleInformationBoxParser = SubSampleInformationBoxParser;
let ProgressiveDownloadInfoBoxParser = class ProgressiveDownloadInfoBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.entries = [];
        while (!this.eof()) {
            ret.entries.push({
                rate: this.readUint32(),
                initialDelay: this.readUint32()
            });
        }
        return ret;
    }
};
ProgressiveDownloadInfoBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_PROGRESSIVE_DOWNLOAD_INFO_BOX)
], ProgressiveDownloadInfoBoxParser);
exports.ProgressiveDownloadInfoBoxParser = ProgressiveDownloadInfoBoxParser;
let MetaBoxParser = class MetaBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.theHandler = this.readBox();
        ret.otherBoxes = [];
        while (!this.eof()) {
            var box = this.readBox();
            switch (box.type) {
                case statics_1.BOX_TYPE_PRIMARY_ITEM_BOX:
                    ret.primaryResource = box;
                    break;
                case statics_1.BOX_TYPE_DATA_INFORMATION_BOX:
                    ret.fileLocations = box;
                    break;
                case statics_1.BOX_TYPE_ITEM_LOCATION_BOX:
                    ret.itemLocations = box;
                    break;
                case statics_1.BOX_TYPE_ITEM_INFO_BOX:
                    ret.itemInfos = box;
                    break;
                case statics_1.BOX_TYPE_ITEM_PROTECTION_BOX:
                    ret.protections = box;
                    break;
                case statics_1.BOX_TYPE_IPMP_CONTROL_BOX:
                    ret.IPMPControl = box;
                    break;
                default:
                    ret.otherBoxes.push(box);
            }
        }
        return ret;
    }
};
MetaBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_META_BOX)
], MetaBoxParser);
exports.MetaBoxParser = MetaBoxParser;
let XMLBoxParsr = class XMLBoxParsr extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var bytes = this.bytes.subarray(this.byteOffset);
        ret.xml = dataview_1.DataView2.UTF8BytesToString(bytes);
        return ret;
    }
};
XMLBoxParsr = __decorate([
    Type(statics_1.BOX_TYPE_XML_BOX)
], XMLBoxParsr);
exports.XMLBoxParsr = XMLBoxParsr;
let BinaryXMLBoxParser = class BinaryXMLBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.data = this.bytes.subarray(this.byteOffset);
        return ret;
    }
};
BinaryXMLBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_BINARY_XML_BOX)
], BinaryXMLBoxParser);
exports.BinaryXMLBoxParser = BinaryXMLBoxParser;
let ItemLocationBoxParser = class ItemLocationBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
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
};
ItemLocationBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_ITEM_LOCATION_BOX)
], ItemLocationBoxParser);
exports.ItemLocationBoxParser = ItemLocationBoxParser;
let PrimaryItemBoxParser = class PrimaryItemBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.itemID = this.readUint16();
        return ret;
    }
};
PrimaryItemBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_PRIMARY_ITEM_BOX)
], PrimaryItemBoxParser);
exports.PrimaryItemBoxParser = PrimaryItemBoxParser;
let ItemProtectionBoxParser = class ItemProtectionBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var protectionCount = (ret.protectionCount = this.readUint16());
        ret.protectionInformations = [];
        for (var i = 0; i < protectionCount; ++i) {
            ret.protectionInformations.push(this.readBox());
        }
        return ret;
    }
};
ItemProtectionBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_ITEM_PROTECTION_BOX)
], ItemProtectionBoxParser);
exports.ItemProtectionBoxParser = ItemProtectionBoxParser;
let ItemInfoEntryParser = class ItemInfoEntryParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.itemID = this.readUint16();
        ret.itemProtectionIndex = this.readUint16();
        ret.itemName = this.readUTF8StringNullTerminated();
        ret.contentType = this.readUTF8StringNullTerminated();
        ret.contentEncoding = this.readString();
        return ret;
    }
};
ItemInfoEntryParser = __decorate([
    Type(statics_1.BOX_TYPE_ITEM_INFO_ENTRY)
], ItemInfoEntryParser);
exports.ItemInfoEntryParser = ItemInfoEntryParser;
let ItemInfoBoxParser = class ItemInfoBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        var entryCount = (ret.entryCount = this.readUint16());
        ret.itemInfos = [];
        for (var i = 0; i < entryCount; ++i) {
            ret.itemInfos.push(this.readBox());
        }
        return ret;
    }
};
ItemInfoBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_ITEM_INFO_BOX)
], ItemInfoBoxParser);
exports.ItemInfoBoxParser = ItemInfoBoxParser;
let ProtectionSchemeInfoBoxParser = class ProtectionSchemeInfoBoxParser extends BoxParser {
    parse() {
        var ret = super.parse();
        ret.originalFormat = this.readBox();
        while (!this.eof()) {
            var box = this.readBox();
            switch (box.type) {
                case statics_1.BOX_TYPE_IPMP_INFO_BOX:
                    ret.IPMPDescriptors = box;
                    break;
            }
        }
        return ret;
    }
};
ProtectionSchemeInfoBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_PROTECTION_SCHEME_INFO_BOX)
], ProtectionSchemeInfoBoxParser);
exports.ProtectionSchemeInfoBoxParser = ProtectionSchemeInfoBoxParser;
let OriginalFormatBoxParser = class OriginalFormatBoxParser extends BoxParser {
    parse() {
        var ret = super.parse();
        ret.dataFormat = this.readString(4);
        return ret;
    }
};
OriginalFormatBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_ORIGINAL_FORMAT_BOX)
], OriginalFormatBoxParser);
exports.OriginalFormatBoxParser = OriginalFormatBoxParser;
let IPMPInfoBoxParser = class IPMPInfoBoxParser extends FullBoxParser {
    parse() {
        var ret = super.parse();
        ret.ipmpDescrs = [];
        while (!this.eof()) {
            ret.ipmpDescrs.push(this.readDescriptor());
        }
        return ret;
    }
};
IPMPInfoBoxParser = __decorate([
    Type(statics_1.BOX_TYPE_IPMP_INFO_BOX)
], IPMPInfoBoxParser);
exports.IPMPInfoBoxParser = IPMPInfoBoxParser;
/**
 * Create a box parser by the box type.
 * @param bytes
 * @param type A box type.
 */
exports.createBoxParser = (bytes, type) => {
    return new (dict[type] || BoxParser)(bytes);
};
