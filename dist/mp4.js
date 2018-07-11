"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_box_1 = require("./parser.box");
const finder_1 = require("./finder");
const statics_1 = require("./statics");
const composer_box_1 = require("./composer.box");
const parser_descr_1 = require("./parser.descr");
const bitreader_1 = require("./bitreader");
var SAMPLERATE_TABLE = [
    96000,
    88200,
    64000,
    48000,
    44100,
    32000,
    24000,
    22050,
    16000,
    12000,
    11025,
    8000
];
exports.parse = (bytes) => {
    return new parser_box_1.RootParser(bytes).parse();
};
var getChunks = (bytes, trackBox) => {
    var chunks = [];
    var finder = new finder_1.Finder(trackBox);
    var stsc = finder.findOne(statics_1.BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
    var stsz = finder.findOne(statics_1.BOX_TYPE_SAMPLE_SIZE_BOX);
    var stco = finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET_BOX);
    if (!stco)
        stco = finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET64_BOX);
    var i, j, k, idx, n, m, l, chunkStart, chunkEnd;
    for (i = 0, idx = 0, n = stsc.entryCount; i < n; ++i) {
        j = stsc.entries[i].firstChunk - 1;
        m =
            i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
        for (; j < m; ++j) {
            chunkStart = chunkEnd = stco.chunkOffsets[j];
            for (k = 0, l = stsc.entries[i].samplesPerChunk; k < l; ++k, ++idx) {
                chunkEnd += stsz.sampleSizes[idx];
            }
            chunks.push(bytes.subarray(chunkStart, chunkEnd));
        }
    }
    return chunks;
};
var getAudioTrack = (tree) => {
    var audioTrack;
    var finder = new finder_1.Finder(tree);
    finder.findAll(statics_1.BOX_TYPE_TRACK_BOX).some(box => {
        var hdlr = new finder_1.Finder(box).findOne(statics_1.BOX_TYPE_HANDLER_BOX);
        if (hdlr.handlerType === "soun") {
            audioTrack = box;
            return true;
        }
        return false;
    });
    return audioTrack;
};
var concatBytes = (bytess) => {
    var i, n, byteLength = 0, offset = 0;
    for (i = 0, n = bytess.length; i < n; ++i) {
        byteLength += bytess[i].length;
    }
    var ret = new Uint8Array(byteLength);
    for (i = 0; i < n; ++i) {
        ret.set(bytess[i], offset);
        offset += bytess[i].length;
    }
    return ret;
};
// extract audio. it is stored to MP4 container.
exports.extractAudio = (bytes) => {
    var tree = exports.parse(bytes);
    var finder = new finder_1.Finder(tree);
    var offset = 8 * 6;
    var ftyp = {
        majorBrand: "M4A ",
        minorVersion: 1,
        compatibleBrands: ["isom", "M4A ", "mp42"]
    };
    ftyp.bytes = new composer_box_1.FileTypeBoxBuilder(ftyp).build();
    offset += ftyp.bytes.length;
    var mvhd = finder.findOne(statics_1.BOX_TYPE_MOVIE_HEADER_BOX);
    offset += mvhd.bytes.length;
    var audioTrack = getAudioTrack(tree);
    finder = new finder_1.Finder(audioTrack);
    var tkhd = finder.findOne(statics_1.BOX_TYPE_TRACK_HEADER_BOX);
    offset += tkhd.bytes.length;
    finder = new finder_1.Finder(finder.findOne(statics_1.BOX_TYPE_MEDIA_BOX));
    var mdhd = finder.findOne(statics_1.BOX_TYPE_MEDIA_HEADER_BOX);
    var hdlr = finder.findOne(statics_1.BOX_TYPE_HANDLER_BOX);
    offset += mdhd.bytes.length + hdlr.bytes.length;
    finder = new finder_1.Finder(finder.findOne(statics_1.BOX_TYPE_MEDIA_INFORMATION_BOX));
    var smhd = finder.findOne(statics_1.BOX_TYPE_SOUND_MEDIA_HEADER_BOX);
    var dinf = finder.findOne(statics_1.BOX_TYPE_DATA_INFORMATION_BOX);
    offset += smhd.bytes.length + dinf.bytes.length;
    finder = new finder_1.Finder(finder.findOne(statics_1.BOX_TYPE_SAMPLE_TABLE_BOX));
    var stsd = finder.findOne(statics_1.BOX_TYPE_SAMPLE_DESCRIPTION_BOX);
    var stts = finder.findOne(statics_1.BOX_TYPE_TIME_TO_SAMPLE_BOX);
    var stsc = finder.findOne(statics_1.BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
    var stsz = finder.findOne(statics_1.BOX_TYPE_SAMPLE_SIZE_BOX);
    var stco = finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET_BOX);
    if (!stco)
        finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET64_BOX);
    var stcoBytes = stco.bytes;
    offset +=
        stsd.bytes.length +
            stts.bytes.length +
            stsc.bytes.length +
            stsz.bytes.length +
            stcoBytes.length;
    var chunks = getChunks(bytes, audioTrack);
    var chunkOffsets = [offset];
    for (var i = 1, n = chunks.length; i < n; ++i) {
        offset += chunks[i - 1].length;
        chunkOffsets[i] = offset;
    }
    stcoBytes = new composer_box_1.ChunkOffsetBoxBuilder({
        entryCount: stco.entryCount,
        chunkOffsets: chunkOffsets
    }).build();
    var mdatBytes = new composer_box_1.MediaDataBoxBuilder({
        data: concatBytes(chunks)
    }).build();
    var stblBytes = new composer_box_1.SampleTableBoxBuilder([
        stsd,
        stts,
        stsc,
        stsz,
        stcoBytes
    ]).build();
    var minfBytes = new composer_box_1.MediaInformationBoxBuilder([
        smhd,
        dinf,
        stblBytes
    ]).build();
    var mdiaBytes = new composer_box_1.MediaBoxBuilder([mdhd, hdlr, minfBytes]).build();
    var trakBytes = new composer_box_1.TrackBoxBuilder([tkhd, mdiaBytes]).build();
    var moovBytes = new composer_box_1.MovieBoxBuilder([mvhd, trakBytes]).build();
    return concatBytes([ftyp.bytes, moovBytes, mdatBytes]);
};
var extractAudioAsAAC = (bytes, audioTrack) => {
    var finder = new finder_1.Finder(audioTrack);
    var mp4a = (finder.findOne(statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY));
    var stsc = finder.findOne(statics_1.BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
    var stsz = finder.findOne(statics_1.BOX_TYPE_SAMPLE_SIZE_BOX);
    var stco = finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET_BOX);
    if (!stco)
        stco = finder.findOne(statics_1.BOX_TYPE_CHUNK_OFFSET64_BOX);
    var ret = new Uint8Array(stsz.sampleSizes.length * 7 + stsz.sampleSizes.reduce((a, b) => a + b));
    var offset = 0;
    var aacHeader = new Uint8Array(7);
    aacHeader[0] = 0xff;
    aacHeader[1] = 0xf9;
    aacHeader[2] =
        0x40 |
            (SAMPLERATE_TABLE.indexOf(mp4a.sampleRate) << 2) |
            (mp4a.channelCount >> 2);
    aacHeader[6] = 0xfc;
    var i, j, k, idx, n, m, l, chunkOffset, sampleSize;
    for (i = 0, idx = 0, n = stsc.entryCount; i < n; ++i) {
        j = stsc.entries[i].firstChunk - 1;
        m =
            i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
        for (; j < m; ++j) {
            chunkOffset = stco.chunkOffsets[j];
            for (k = 0, l = stsc.entries[i].samplesPerChunk; k < l; ++k, ++idx) {
                sampleSize = stsz.sampleSizes[idx] + 7;
                aacHeader[3] = (mp4a.channelCount << 6) | (sampleSize >> 11);
                aacHeader[4] = sampleSize >> 3;
                aacHeader[5] = (sampleSize << 5) | (0x7ff >> 6);
                ret.set(aacHeader, offset);
                offset += 7;
                ret.set(bytes.subarray(chunkOffset, (chunkOffset += stsz.sampleSizes[idx])), offset);
                offset += stsz.sampleSizes[idx];
            }
        }
    }
    return ret;
};
var extractAudioAsMP3 = (bytes, audioTrack) => {
    return concatBytes(getChunks(bytes, audioTrack));
};
exports.extractRawAudio = (bytes) => {
    var tree = exports.parse(bytes);
    var audioTrack = getAudioTrack(tree);
    var finder = new finder_1.Finder(audioTrack);
    var mp4a = (finder.findOne(statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY));
    var OBJECT_TYPE_INDICATION = parser_descr_1.DecoderConfigDescriptorParser.OBJECT_TYPE_INDICATION;
    switch (mp4a.esBox.esDescr.decConfigDescr.objectTypeIndication) {
        case OBJECT_TYPE_INDICATION.AAC:
            return { type: "aac", data: extractAudioAsAAC(bytes, audioTrack) };
        case OBJECT_TYPE_INDICATION.MP3:
            return { type: "mp3", data: extractAudioAsMP3(bytes, audioTrack) };
        default:
            throw new TypeError("not supported object type indication.");
    }
};
exports.aacToM4a = (bytes) => {
    var bitReader = new bitreader_1.BitReader(bytes);
    var offset = 8 * 6;
    bitReader.skipBits(12);
    var aacInfo = {
        id: bitReader.readBits(1),
        layer: bitReader.readBits(2),
        protectionAbsent: bitReader.readBits(1),
        profile: bitReader.readBits(2),
        sampleingFrequencyIndex: bitReader.readBits(4),
        privateBit: bitReader.readBits(1),
        channelConfiguration: bitReader.readBits(3),
        original: bitReader.readBits(1),
        home: bitReader.readBits(1),
        copyrightIndentificationBit: bitReader.readBits(1),
        copyrightIndentificationStart: bitReader.readBits(1),
        aacFrameLength: bitReader.readBits(13),
        atdsBufferFullness: bitReader.readBits(11),
        noRawDataBlocksInFrames: bitReader.readBits(2)
    };
    bitReader.bitOffset = 0;
    var samples = [];
    var frameLength;
    var bufferSizeDB = 0;
    while (!bitReader.eof()) {
        bitReader.skipBits(30);
        frameLength = bitReader.readBits(13);
        bitReader.skipBits(13);
        samples.push(bitReader.readBytes(frameLength - 7));
        bufferSizeDB = Math.max(bufferSizeDB, frameLength - 7);
    }
    var ftypBytes = new composer_box_1.FileTypeBoxBuilder({
        majorBrand: "M4A ",
        minorVersion: 1,
        compatibleBrands: ["isom", "M4A ", "mp42"]
    }).build();
    offset += ftypBytes.length;
    var creationTime = Date.now();
    var timescale = 600;
    var sampleRate = SAMPLERATE_TABLE[aacInfo.sampleingFrequencyIndex];
    var duration = ((samples.length * 1024 * timescale) / sampleRate) | 0;
    var matrix = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000];
    var mvhdBytes = new composer_box_1.MovieHeaderBoxBuilder({
        creationTime: creationTime,
        modificationTime: creationTime,
        timescale: timescale,
        duration: duration,
        rate: 1.0,
        volume: 1.0,
        matrix: matrix,
        nextTrackID: 2
    }).build();
    offset += mvhdBytes.length;
    var tkhdBytes = new composer_box_1.TrackHeaderBoxBuilder({
        flags: 0x000001,
        creationTime: creationTime,
        modificationTime: creationTime,
        trackID: 1,
        duration: duration,
        layer: 0,
        alternateGroup: 0,
        volume: 1.0,
        matrix: matrix,
        width: 0,
        height: 0
    }).build();
    offset += tkhdBytes.length;
    var mdhdBytes = new composer_box_1.MediaHeaderBoxBuilder({
        creationTime: creationTime,
        modificationTime: creationTime,
        timescale: timescale,
        duration: duration,
        language: "und"
    }).build();
    offset += mdhdBytes.length;
    var hdlrBytes = new composer_box_1.HandlerBoxBuilder({
        handlerType: "soun",
        name: "mp4.js sound media handler"
    }).build();
    offset += hdlrBytes.length;
    var smhdBytes = new composer_box_1.SoundMediaHeaderBoxBuilder({
        balance: 0
    }).build();
    offset += smhdBytes.length;
    var urlBytes = new composer_box_1.DataEntryUrlBoxBuilder({
        flags: 0x000001,
        location: ""
    }).build();
    var drefBytes = new composer_box_1.DataReferenceBoxBuilder({
        entryCount: 1,
        entries: [urlBytes]
    }).build();
    var dinfBytes = new composer_box_1.DataInformationBoxBuilder([drefBytes]).build();
    offset += dinfBytes.length;
    var OBJECT_TYPE_INDICATION = parser_descr_1.DecoderConfigDescriptorParser.OBJECT_TYPE_INDICATION;
    var decConfigDescr = {
        objectTypeIndication: OBJECT_TYPE_INDICATION.AAC,
        streamType: 0x05,
        upStream: 0,
        bufferSizeDB: bufferSizeDB,
        maxBitrate: 0,
        avgBitrate: 0,
        decSpecificInfo: {
            data: new Uint8Array([0x12, 0x10])
        }
    };
    var slConfigDescr = {
        preDefined: 2
    };
    var esDescr = {
        esID: 0,
        streamDependenceFlag: 0,
        urlFlag: 0,
        ocrStreamFlag: 0,
        streamPriority: 0,
        decConfigDescr: decConfigDescr,
        slConfigDescr: slConfigDescr
    };
    var esBox = {
        esDescr: esDescr
    };
    var audioSampleEntry = {
        type: statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY,
        dataReferenceIndex: 1,
        channelCount: aacInfo.channelConfiguration,
        sampleSize: 16,
        sampleRate: sampleRate,
        esBox: esBox
    };
    var mp4aBytes = new composer_box_1.MP4AudioSampleEntryBuilder({
        type: statics_1.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY,
        dataReferenceIndex: 1,
        channelCount: aacInfo.channelConfiguration,
        sampleSize: 16,
        sampleRate: sampleRate,
        esBox: esBox
    }).build();
    var stsdBytes = new composer_box_1.SampleDescriptionBoxBuilder({
        entryCount: 1,
        boxes: [audioSampleEntry]
    }).build();
    offset += stsdBytes.length;
    var sttsBytes = new composer_box_1.TimeToSampleBoxBuilder({
        entryCount: 1,
        entries: [{ sampleCount: samples.length, sampleDelta: 1024 }]
    }).build();
    offset += sttsBytes.length;
    var stszBytes = new composer_box_1.SampleSizeBoxBuilder({
        sampleSize: 0,
        sampleCount: samples.length,
        sampleSizes: samples.map(sample => sample.byteLength)
    }).build();
    offset += stszBytes.length;
    var mod16 = samples.length % 16;
    var stscEntryCount = mod16 ? 2 : 1;
    var stscEntries = [
        {
            firstChunk: 1,
            samplesPerChunk: 16,
            sampleDescriptionIndex: 1
        }
    ];
    if (stscEntryCount === 2) {
        stscEntries.push({
            firstChunk: Math.floor(samples.length / 16) + 1,
            samplesPerChunk: mod16,
            sampleDescriptionIndex: 1
        });
    }
    var stscBytes = new composer_box_1.SampleToChunkBoxBuilder({
        entryCount: stscEntryCount,
        entries: stscEntries
    }).build();
    offset += stscBytes.length;
    var stcoEntryCount = Math.ceil(samples.length / 16);
    offset += 4 + stcoEntryCount * 4 + /* header length */ 12;
    var chunkOffset = offset;
    var chunkOffsets = [];
    for (var i = 0, n = samples.length; i < n; ++i) {
        if (i % 16 === 0)
            chunkOffsets.push(chunkOffset);
        chunkOffset += samples[i].byteLength;
    }
    var stcoBytes = new composer_box_1.ChunkOffsetBoxBuilder({
        entryCount: stcoEntryCount,
        chunkOffsets: chunkOffsets
    }).build();
    var stblBytes = new composer_box_1.SampleTableBoxBuilder([
        stsdBytes,
        sttsBytes,
        stszBytes,
        stscBytes,
        stcoBytes
    ]).build();
    var minfBytes = new composer_box_1.MediaInformationBoxBuilder([
        smhdBytes,
        dinfBytes,
        stblBytes
    ]).build();
    var mdiaBytes = new composer_box_1.MediaBoxBuilder([
        mdhdBytes,
        hdlrBytes,
        minfBytes
    ]).build();
    var trakBytes = new composer_box_1.TrackBoxBuilder([tkhdBytes, mdiaBytes]).build();
    var moovBytes = new composer_box_1.MovieBoxBuilder([mvhdBytes, trakBytes]).build();
    var mdatBytes = new composer_box_1.MediaDataBoxBuilder({
        data: concatBytes(samples)
    }).build();
    return concatBytes([ftypBytes, moovBytes, mdatBytes]);
};
