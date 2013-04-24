/// <reference path="dataview.ts" />
/// <reference path="bitreader.ts" />
/// <reference path="bitwriter.ts" />
/// <reference path="statics.ts" />
/// <reference path="interface.descr.ts" />
/// <reference path="interface.box.ts" />
/// <reference path="parser.ts" />
/// <reference path="parser.descr.ts" />
/// <reference path="parser.box.ts" />
/// <reference path="composer.ts" />
/// <reference path="composer.descr.ts" />
/// <reference path="composer.box.ts" />
/// <reference path="finder.ts" />

module Mp4 {

  var SAMPLERATE_TABLE = [
    96000, 88200, 64000, 48000,
    44100, 32000, 24000, 22050,
    16000, 12000, 11025, 8000
  ];

  export var parse = (bytes: Uint8Array): IBox[] => {
    return new Mp4.Parser.RootParser(bytes).parse();
  };

  var getChunks = (bytes: Uint8Array, trackBox: ITrackBox): Uint8Array[] => {
    var chunks: Uint8Array[] = [];
    var finder = new Finder(trackBox);

    var stsc = <ISampleToChunkBox>finder.findOne(BOX_TYPE.SampleToChunkBox);
    var stsz = <ISampleSizeBox>finder.findOne(BOX_TYPE.SampleSizeBox);
    var stco = <IChunkOffsetBox>finder.findOne(BOX_TYPE.ChunkOffsetBox);

    var i, j, k, idx, n, m, l, chunkStart, chunkEnd;

    for (i = 0, idx = 0, n = stsc.entryCount; i < n; ++i) {
      j = stsc.entries[i].firstChunk - 1;
      m = i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
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

  var getAudioTrack = (tree: any): ITrackBox => {
    var audioTrack: ITrackBox;
    var finder = new Finder(tree);
    finder.findAll(BOX_TYPE.TrackBox).some(box => {
      var hdlr = <IHandlerBox>new Finder(box).findOne(BOX_TYPE.HandlerBox);
      if (hdlr.handlerType === 'soun') return audioTrack = <ITrackBox>box;
    });
    return audioTrack;
  };

  var concatBytes = (bytess: Uint8Array[]): Uint8Array => {
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
  }

  // extract audio. it is stored to MP4 container.
  export var extractAudio = (bytes: Uint8Array): Uint8Array => {
    var tree = parse(bytes);
    var finder = new Finder(tree);
    var offset = 8 * 6;

    var ftyp: IFileTypeBox = {
      majorBrand: 'mp4a',
      minorVersion: 0,
      compatibleBrands: ['mp4a', 'mp42', 'isom', 'ndia']
    };

    ftyp.bytes = new Composer.FileTypeBoxComposer(ftyp).compose();
    offset += ftyp.bytes.length;

    var mvhd = finder.findOne(BOX_TYPE.MovieHeaderBox);
    offset += mvhd.bytes.length;

    var audioTrack = getAudioTrack(tree);

    finder = new Finder(audioTrack);
    var tkhd = finder.findOne(BOX_TYPE.TrackHeaderBox);
    offset += tkhd.bytes.length;

    finder = new Finder(finder.findOne(BOX_TYPE.MediaDataBox));
    var mdhd = finder.findOne(BOX_TYPE.MediaHeaderBox);
    var hdlr = finder.findOne(BOX_TYPE.HandlerBox);
    offset += mdhd.bytes.length + hdlr.bytes.length;

    finder = new Finder(finder.findOne(BOX_TYPE.MediaInformationBox));
    var smhd = finder.findOne(BOX_TYPE.SoundMediaHeaderBox);
    var dinf = finder.findOne(BOX_TYPE.DataInformationBox);
    offset += smhd.bytes.length + dinf.bytes.length;

    finder = new Finder(finder.findOne(BOX_TYPE.SampleTableBox));
    var stsd = finder.findOne(BOX_TYPE.SampleDescriptionBox);
    var stts = finder.findOne(BOX_TYPE.TimeToSampleBox);
    var stsc = finder.findOne(BOX_TYPE.SampleToChunkBox);
    var stsz = finder.findOne(BOX_TYPE.SampleSizeBox);
    var stco = <IChunkOffsetBox>finder.findOne(BOX_TYPE.ChunkOffsetBox);
    var stcoBytes = stco.bytes;
    offset += stsd.bytes.length + stts.bytes.length + stsc.bytes.length + stsz.bytes.length + stcoBytes.length;

    var chunks = getChunks(bytes, audioTrack);
    var chunkOffsets: number[] = [offset];
    for (var i = 1, n = chunks.length; i < n; ++i) {
      offset += chunks[i - 1].length;
      chunkOffsets[i] = offset;
    }
    stcoBytes = new Composer.ChunkOffsetBoxComposer({
      entryCount: stco.entryCount,
      chunkOffsets: chunkOffsets
    }).compose();
    var mdatBytes = new Composer.MediaDataBoxComposer({
      data: concatBytes(chunks)
    }).compose();

    var stblBytes = new Composer.SampleTableBoxComposer([stsd, stts, stsc, stsz, stcoBytes]).compose();
    var minfBytes = new Composer.MediaInformationBoxComposer([smhd, dinf, stblBytes]).compose();
    var mdiaBytes = new Composer.MediaBoxComposer([mdhd, hdlr, minfBytes]).compose();
    var trakBytes = new Composer.TrackBoxComposer([tkhd, mdiaBytes]).compose();
    var moovBytes = new Composer.MovieBoxComposer([mvhd, trakBytes]).compose();

    return concatBytes([ftyp.bytes, moovBytes, mdatBytes]);
  };

  var extractAudioAsAAC = (bytes: Uint8Array, audioTrack: any): Uint8Array => {
    var finder = new Finder(audioTrack);

    var mp4a = <IMP4AudioSampleEntry>finder.findOne(BOX_TYPE.MP4AudioSampleEntry);
    var stsc = <ISampleToChunkBox>finder.findOne(BOX_TYPE.SampleToChunkBox);
    var stsz = <ISampleSizeBox>finder.findOne(BOX_TYPE.SampleSizeBox);
    var stco = <IChunkOffsetBox>finder.findOne(BOX_TYPE.ChunkOffsetBox);

    var ret = new Uint8Array(stsz.sampleSizes.length * 7 + stsz.sampleSizes.reduce((a, b) => a + b));
    var offset = 0;

    var aacHeader = new Uint8Array(7);
    aacHeader[0] = 0xFF;
    aacHeader[1] = 0xF9;
    aacHeader[2] = 0x40 | (SAMPLERATE_TABLE.indexOf(mp4a.samplerate) << 2) | (mp4a.channelcount >> 2);
    aacHeader[6] = 0xFC;

    var i, j, k, idx, n, m, l, chunkOffset, sampleSize;

    for (i = 0, idx = 0, n = stsc.entryCount; i < n; ++i) {
      j = stsc.entries[i].firstChunk - 1;
      m = i + 1 < n ? stsc.entries[i + 1].firstChunk - 1 : stco.chunkOffsets.length;
      for (; j < m; ++j) {
        chunkOffset = stco.chunkOffsets[j];
        for (k = 0, l = stsc.entries[i].samplesPerChunk; k < l; ++k, ++idx) {
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

  var extractAudioAsMP3 = (bytes: Uint8Array, audioTrack: any): Uint8Array => {
    return concatBytes(getChunks(bytes, audioTrack));
  };

  export var extractRawAudio = (bytes: Uint8Array): { type: string; data: Uint8Array; } => {
    var tree = parse(bytes);
    var audioTrack = getAudioTrack(tree);
    var finder = new Finder(audioTrack);
    var mp4a = <IMP4AudioSampleEntry>finder.findOne(BOX_TYPE.MP4AudioSampleEntry);
    var OBJECT_TYPE_INDICATION = Parser.DecoderConfigDescriptorParser.OBJECT_TYPE_INDICATION;
    switch (mp4a.esBox.esDescr.decConfigDescr.objectTypeIndication) {
      case OBJECT_TYPE_INDICATION.AAC: return { type: 'aac', data: extractAudioAsAAC(bytes, audioTrack) };
      case OBJECT_TYPE_INDICATION.MP3: return { type: 'mp3', data: extractAudioAsMP3(bytes, audioTrack) };
      default: throw new TypeError('not supported object type indication.');
    }
  }
}