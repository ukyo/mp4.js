var Mp4;
(function (Mp4) {
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
    Mp4.parse = function (bytes) {
        return new Mp4.Parser.RootParser(bytes).parse();
    };
    var getChunks = function (bytes, trackBox) {
        var chunks = [];
        var finder = new Mp4.Finder(trackBox);
        var stsc = finder.findOne(Mp4.BOX_TYPE.SampleToChunkBox);
        var stsz = finder.findOne(Mp4.BOX_TYPE.SampleSizeBox);
        var stco = finder.findOne(Mp4.BOX_TYPE.ChunkOffsetBox);
        var i, j, k, idx, n, m, l, chunkStart, chunkEnd;
        for(i = 0 , idx = 0 , n = stsc.entryCount; i < n; ++i) {
            j = stsc.entries[i].firstChunk - 1;
            m = i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
            for(; j < m; ++j) {
                chunkStart = chunkEnd = stco.chunkOffsets[j];
                for(k = 0 , l = stsc.entries[i].samplesPerChunk; k < l; ++k , ++idx) {
                    chunkEnd += stsz.sampleSizes[idx];
                }
                chunks.push(bytes.subarray(chunkStart, chunkEnd));
            }
        }
        return chunks;
    };
    var getAudioTrack = function (tree) {
        var audioTrack;
        var finder = new Mp4.Finder(tree);
        finder.findAll(Mp4.BOX_TYPE.TrackBox).some(function (box) {
            var hdlr = new Mp4.Finder(box).findOne(Mp4.BOX_TYPE.HandlerBox);
            if(hdlr.handlerType === 'soun') {
                return audioTrack = box;
            }
        });
        return audioTrack;
    };
    var concatBytes = function (bytess) {
        var i, n, byteLength = 0, offset = 0;
        for(i = 0 , n = bytess.length; i < n; ++i) {
            byteLength += bytess[i].length;
        }
        var ret = new Uint8Array(byteLength);
        for(i = 0; i < n; ++i) {
            ret.set(bytess[i], offset);
            offset += bytess[i].length;
        }
        return ret;
    };
    Mp4.extractAudio = function (bytes) {
        var tree = Mp4.parse(bytes);
        var finder = new Mp4.Finder(tree);
        var offset = 8 * 6;
        var ftyp = {
            majorBrand: 'mp4a',
            minorVersion: 0,
            compatibleBrands: [
                'mp4a', 
                'mp42', 
                'isom', 
                'ndia'
            ]
        };
        ftyp.bytes = new Mp4.Composer.FileTypeBoxComposer(ftyp).compose();
        offset += ftyp.bytes.length;
        var mvhd = finder.findOne(Mp4.BOX_TYPE.MovieHeaderBox);
        offset += mvhd.bytes.length;
        var audioTrack = getAudioTrack(tree);
        finder = new Mp4.Finder(audioTrack);
        var tkhd = finder.findOne(Mp4.BOX_TYPE.TrackHeaderBox);
        offset += tkhd.bytes.length;
        finder = new Mp4.Finder(finder.findOne(Mp4.BOX_TYPE.MediaDataBox));
        var mdhd = finder.findOne(Mp4.BOX_TYPE.MediaHeaderBox);
        var hdlr = finder.findOne(Mp4.BOX_TYPE.HandlerBox);
        offset += mdhd.bytes.length + hdlr.bytes.length;
        finder = new Mp4.Finder(finder.findOne(Mp4.BOX_TYPE.MediaInformationBox));
        var smhd = finder.findOne(Mp4.BOX_TYPE.SoundMediaHeaderBox);
        var dinf = finder.findOne(Mp4.BOX_TYPE.DataInformationBox);
        offset += smhd.bytes.length + dinf.bytes.length;
        finder = new Mp4.Finder(finder.findOne(Mp4.BOX_TYPE.SampleTableBox));
        var stsd = finder.findOne(Mp4.BOX_TYPE.SampleDescriptionBox);
        var stts = finder.findOne(Mp4.BOX_TYPE.TimeToSampleBox);
        var stsc = finder.findOne(Mp4.BOX_TYPE.SampleToChunkBox);
        var stsz = finder.findOne(Mp4.BOX_TYPE.SampleSizeBox);
        var stco = finder.findOne(Mp4.BOX_TYPE.ChunkOffsetBox);
        var stcoBytes = stco.bytes;
        offset += stsd.bytes.length + stts.bytes.length + stsc.bytes.length + stsz.bytes.length + stcoBytes.length;
        var chunks = getChunks(bytes, audioTrack);
        var chunkOffsets = [
            offset
        ];
        for(var i = 1, n = chunks.length; i < n; ++i) {
            offset += chunks[i - 1].length;
            chunkOffsets[i] = offset;
        }
        stcoBytes = new Mp4.Composer.ChunkOffsetBoxComposer({
            entryCount: stco.entryCount,
            chunkOffsets: chunkOffsets
        }).compose();
        var mdatBytes = new Mp4.Composer.MediaDataBoxComposer({
            data: concatBytes(chunks)
        }).compose();
        var stblBytes = new Mp4.Composer.SampleTableBoxComposer([
            stsd, 
            stts, 
            stsc, 
            stsz, 
            stcoBytes
        ]).compose();
        var minfBytes = new Mp4.Composer.MediaInformationBoxComposer([
            smhd, 
            dinf, 
            stblBytes
        ]).compose();
        var mdiaBytes = new Mp4.Composer.MediaBoxComposer([
            mdhd, 
            hdlr, 
            minfBytes
        ]).compose();
        var trakBytes = new Mp4.Composer.TrackBoxComposer([
            tkhd, 
            mdiaBytes
        ]).compose();
        var moovBytes = new Mp4.Composer.MovieBoxComposer([
            mvhd, 
            trakBytes
        ]).compose();
        return concatBytes([
            ftyp.bytes, 
            moovBytes, 
            mdatBytes
        ]);
    };
    var extractAudioAsAAC = function (bytes, audioTrack) {
        var finder = new Mp4.Finder(audioTrack);
        var mp4a = finder.findOne(Mp4.BOX_TYPE.MP4AudioSampleEntry);
        var stsc = finder.findOne(Mp4.BOX_TYPE.SampleToChunkBox);
        var stsz = finder.findOne(Mp4.BOX_TYPE.SampleSizeBox);
        var stco = finder.findOne(Mp4.BOX_TYPE.ChunkOffsetBox);
        var ret = new Uint8Array(stsz.sampleSizes.length * 7 + stsz.sampleSizes.reduce(function (a, b) {
            return a + b;
        }));
        var offset = 0;
        var aacHeader = new Uint8Array(7);
        aacHeader[0] = 0xFF;
        aacHeader[1] = 0xF9;
        aacHeader[2] = 0x40 | (SAMPLERATE_TABLE.indexOf(mp4a.samplerate) << 2) | (mp4a.channelcount >> 2);
        aacHeader[6] = 0xFC;
        var i, j, k, idx, n, m, l, chunkOffset, sampleSize;
        for(i = 0 , idx = 0 , n = stsc.entryCount; i < n; ++i) {
            j = stsc.entries[i].firstChunk - 1;
            m = i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
            for(; j < m; ++j) {
                chunkOffset = stco.chunkOffsets[j];
                for(k = 0 , l = stsc.entries[i].samplesPerChunk; k < l; ++k , ++idx) {
                    sampleSize = stsz.sampleSizes[idx] + 7;
                    aacHeader[3] = (mp4a.channelcount << 6) | (sampleSize >> 11);
                    aacHeader[4] = sampleSize >> 3;
                    aacHeader[5] = (sampleSize << 5) | (0x7FF >> 6);
                    ret.set(aacHeader, offset);
                    offset += 7;
                    ret.set(bytes.subarray(chunkOffset, chunkOffset += stsz.sampleSizes[idx]), offset);
                    offset += stsz.sampleSizes[idx];
                }
            }
        }
        return ret;
    };
    var extractAudioAsMP3 = function (bytes, audioTrack) {
        return concatBytes(getChunks(bytes, audioTrack));
    };
    Mp4.extractRawAudio = function (bytes) {
        var tree = Mp4.parse(bytes);
        var audioTrack = getAudioTrack(tree);
        var finder = new Mp4.Finder(audioTrack);
        var mp4a = finder.findOne(Mp4.BOX_TYPE.MP4AudioSampleEntry);
        var OBJECT_TYPE_INDICATION = Mp4.Parser.DecoderConfigDescriptorParser.OBJECT_TYPE_INDICATION;
        switch(mp4a.esBox.esDescr.decConfigDescr.objectTypeIndication) {
            case OBJECT_TYPE_INDICATION.AAC:
                return {
                    type: 'aac',
                    data: extractAudioAsAAC(bytes, audioTrack)
                };
            case OBJECT_TYPE_INDICATION.MP3:
                return {
                    type: 'mp3',
                    data: extractAudioAsMP3(bytes, audioTrack)
                };
            default:
                throw new TypeError('not supported object type indication.');
        }
    };
})(Mp4 || (Mp4 = {}));
//@ sourceMappingURL=mp4.js.map
