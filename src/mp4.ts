/// <reference path="dataview.ts" />
/// <reference path="interface.descr.ts" />
/// <reference path="interface.box.ts" />
/// <reference path="finder.ts" />
/// <reference path="parser.ts" />
/// <reference path="parser.descr.ts" />
/// <reference path="parser.box.ts" />
/// <reference path="composer.ts" />
/// <reference path="composer.descr.ts" />
/// <reference path="composer.box.ts" />

module mp4 {

  var SAMPLERATE_TABLE = [
    96000, 88200, 64000, 48000,
    44100, 32000, 24000, 22050,
    16000, 12000, 11025, 8000
  ];

  export var parse = (bytes: Uint8Array): IBox[] => {
    return new mp4.parser.RootParser(bytes).parse();
  };

  var getChunks = (bytes: Uint8Array, trackBox: ITrackBox): Uint8Array[] => {
    var chunks: Uint8Array[] = [];
    var finder = new Finder(trackBox);

    var stsc = <ISampleToChunkBox>finder.findOne('stsc');
    var stsz = <ISampleSizeBox>finder.findOne('stsz');
    var stco = <IChunkOffsetBox>finder.findOne('stco');

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
    finder.findAll('trak').some(box => {
      var hdlr = <IHandlerBox>new Finder(box).findOne('hdlr');
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

  export var extractAudioAsM4A = (bytes: Uint8Array): Uint8Array => {
    var tree = parse(bytes);
    var finder = new Finder(tree);
    var offset = 8 * 6;

    var ftypBytes = new composer.FileTypeBoxComposer({
      majorBrand: 'mp4a',
      minorVersion: 0,
      compatibleBrands: ['mp42', 'isom', 'ndia']
    }).compose();
    offset += ftypBytes.length;

    var mvhdBytes = finder.findOne('mvhd').bytes;
    offset += mvhdBytes.length;

    var audioTrack = getAudioTrack(tree);

    finder = new Finder(audioTrack);
    var tkhdBytes = finder.findOne('tkhd').bytes;
    offset += tkhdBytes.length;

    finder = new Finder(finder.findOne('mdia'));
    var mdhdBytes = finder.findOne('mdhd').bytes;
    var hdlrBytes = finder.findOne('hdlr').bytes;
    offset += mdhdBytes.length + hdlrBytes.length;

    finder = new Finder(finder.findOne('minf'));
    var smhdBytes = finder.findOne('smhd').bytes;
    var dinfBytes = finder.findOne('dinf').bytes;
    offset += smhdBytes.length + dinfBytes.length;

    finder = new Finder(finder.findOne('stbl'));
    var stsdBytes = finder.findOne('stsd').bytes;
    var sttsBytes = finder.findOne('stts').bytes;
    var stscBytes = finder.findOne('stsc').bytes;
    var stszBytes = finder.findOne('stsz').bytes;
    var stco = <IChunkOffsetBox>finder.findOne('stco');
    var stcoBytes = stco.bytes;
    offset += stsdBytes.length + sttsBytes.length + stscBytes.length + stszBytes.length + stcoBytes.length;

    var chunks = getChunks(bytes, audioTrack);
    var chunkOffsets: number[] = [offset];
    for (var i = 1, n = chunks.length; i < n; ++i) {
      offset += chunks[i].length;
      chunkOffsets[i] = offset;
    }
    stcoBytes = new composer.ChunkOffsetBoxComposer({
      entryCount: stco.entryCount,
      chunkOffsets: chunkOffsets
    }).compose();
    var mdatBytes = new composer.MediaDataBoxComposer({
      data: concatBytes(chunks)
    }).compose();
    
    var stblBytes = new composer.SampleTableBoxComposer([stsdBytes, sttsBytes, stszBytes, stcoBytes]).compose();
    var minfBytes = new composer.MediaInformationBoxComposer([smhdBytes, dinfBytes, stblBytes]).compose();
    var mdiaBytes = new composer.MediaBoxComposer([mdhdBytes, hdlrBytes, minfBytes]).compose();
    var trakBytes = new composer.TrackBoxComposer([tkhdBytes, mdiaBytes]).compose();
    var moovBytes = new composer.MovieBoxComposer([mvhdBytes, trakBytes]).compose();

    return concatBytes([ftypBytes, moovBytes, mdatBytes]);
  };

  export var extractAudioAsAAC = (bytes: Uint8Array): Uint8Array => {
    var finder = new Finder(getAudioTrack(parse(bytes)));

    var mp4a = <IMP4AudioSampleEntry>finder.findOne('mp4a');
    var stsc = <ISampleToChunkBox>finder.findOne('stsc');
    var stsz = <ISampleSizeBox>finder.findOne('stsz');
    var stco = <IChunkOffsetBox>finder.findOne('stco');

    var ret = new Uint8Array(stsz.sampleSizes.length * 7 + stsz.sampleSizes.reduce((a, b) => a + b));
    var offset = 0;

    var aacHeader = new Uint8Array(7);
    aacHeader[0] = 0xFF;
    aacHeader[1] = 0xF9;
    aacHeader[2] = 0x40 | SAMPLERATE_TABLE.indexOf(mp4a.samplerate << 2) | (mp4a.channelcount >> 2);
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
}