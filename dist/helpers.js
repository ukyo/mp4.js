"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const finder_1 = require("./finder");
const statics_1 = require("./statics");
const parser_box_1 = require("./parser.box");
function getChunks(bytes, trackBox) {
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
}
exports.getChunks = getChunks;
function concatBytes(bytess) {
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
exports.concatBytes = concatBytes;
function parse(bytes) {
    return new parser_box_1.RootParser(bytes).parse();
}
exports.parse = parse;
