import {
  ITrackBox,
  ISampleToChunkBox,
  ISampleSizeBox,
  IChunkOffsetBox,
  IBox
} from "./interface.box";
import { Finder } from "./finder";
import {
  BOX_TYPE_SAMPLE_TO_CHUNK_BOX,
  BOX_TYPE_SAMPLE_SIZE_BOX,
  BOX_TYPE_CHUNK_OFFSET_BOX,
  BOX_TYPE_CHUNK_OFFSET64_BOX
} from "./statics";
import { RootParser } from "./parser.box";

export function getChunks(
  bytes: Uint8Array,
  trackBox: ITrackBox
): Uint8Array[] {
  var chunks: Uint8Array[] = [];
  var finder = new Finder(trackBox);

  var stsc = <ISampleToChunkBox>finder.findOne(BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
  var stsz = <ISampleSizeBox>finder.findOne(BOX_TYPE_SAMPLE_SIZE_BOX);
  var stco = <IChunkOffsetBox>finder.findOne(BOX_TYPE_CHUNK_OFFSET_BOX);
  if (!stco)
    stco = <IChunkOffsetBox>finder.findOne(BOX_TYPE_CHUNK_OFFSET64_BOX);

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
}

export function concatBytes(bytess: Uint8Array[]): Uint8Array {
  var i,
    n,
    byteLength = 0,
    offset = 0;
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

export function parse(bytes: Uint8Array): IBox[] {
  return new RootParser(bytes).parse();
}
