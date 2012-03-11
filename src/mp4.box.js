/**
 * mp4.box.js Copyright 2012 - Syu Kato <ukyo.web@gmail.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function(window, utils){

var self = this,
	putUi16 = utils.putUi16,
	putUi24 = utils.putUi24,
	putUi32 = utils.putUi32,
	putStr = utils.putStr,
	concatByteArrays = utils.concatByteArrays,
	isType = utils.isType;


/**
 * Create a box.
 * @param {number} size
 * @param {string} type
 * @return {Uint8Array}
 */
this.createBox = function(size, type){
	var box = new Uint8Array(size);
	putUi32(box, size, 0);
	putStr(box, type, 4);
	return box;
};

/**
 * Create a full box.
 * @param {number} size
 * @param {string} type
 * @param {number} version
 * @param {number} flags
 * @return {Uint8Array}
 */
this.createFullBox = function(size, type, version, flags){
	var box = self.createBox(size, type);
	putUi16(box, version, 8);
	putUi16(box, flags, 10);
	return box;
};

/**
 * Create a MPEG4AudioSampleDescriptionBox (mp4a).
 * 
 * aligned(8) class AudioSampleEntry(format) extends Atom('mp4a') {
 * 	uint(8)[6]  reserved = 0;
 *  uint(16)    data-reference-index;
 *  uint(32)[2] reserved = 0;
 *  uint(16)    reserved = 2;
 *  uint(16)    reserved = 16;
 *  uint(32)    reserved = 0;
 *  uint(16)    time-scale; //copied from the track
 *  uint(16)    reserved = 0;
 *  ESDAtom     ES;
 * }
 * 
 * @param {number} dataReferenceIndex
 * @param {number} timeScale
 * @param {Uint8Array} esdsBox
 * @return {Uint8Array}
 */
this.createMp4aBox = function(dataReferenceIndex, timeScale, esdsBox){
	var size = 36 + esdsBox.length,
		box = self.createBox(size, "mp4a");
	putUi16(box, dataReferenceIndex, 14);
	putUi16(box, 2, 24);
	putUi16(box, 16, 26);
	putUi16(box, timeScale, 32);
	box.set(esdsBox, 36);
	return box;
};

/**
 * Create a ESDescriptorBox (esds).
 * 
 * aligned(8) class ESDAtom extends FullAtom('esds', version = 0, 0) {
 * 	ES_Descriptor ES;
 * }
 * 
 * @param {Uint8Array} esDescr
 * @return {Uint8Array}
 * TODO
 */
this.createEsdsBox = function(esDescr){
	var box = self.createFullBox(12 + esDescr.length, "esds", 0, 0);
	box.set(esDescr, 12);
	return box;
};

/**
 * Create a TrackHeaderBox (tkhd).
 * 
 * aligned(8) class TrackHeaderAtom extends FullAtom('tkhd', version, flags) {
 * 	if (version == 1) {
 * 	 uint(64) creation-time;
 *   uint(64) modification-time;
 *   uint(32) track-ID;
 *   uint(32) reserved = 0;
 *   uint(64) duration;
 *  } else {
 * 	 uint(32) creation-time;
 *   uint(32) modification-time;
 *   uint(32) track-ID;
 *   uint(32) reserved = 0;
 *   uint(32) duration;
 *  }
 *  uint(32)[3] reserved = 0;
 *  bit(16)     reserved = { if track_is_audio 0x0100 else 0};
 *  uint(16)    reserved = 0;
 *  bit(32)[9]  reserved = { 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 };
 *  bit(32)     reserved = { if track_is_visual 0x01400000 else 0 };
 *  bit(32)     reserved = { if track_is_visual 0x00F00000 else 0 };
 * }
 * 
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} trackId
 * @param {number} duration
 * @param {boolean} isVisual
 * @return {Uint8Array}
 */
this.createTkhdBox = function(creationTime, modificationTime, trackId, duration, isVisual){
	var box = self.createFullBox(92, "tkhd", 0, 1);
	putUi32(box, creationTime, 12);
	putUi32(box, modificationTime, 16);
	putUi32(box, trackId, 20);
	putUi32(box, duration, 28);
	putUi16(box, !isVisual ? 0x0100 : 0, 44);
	putUi32(box, 0x00010000, 48);
	putUi32(box, 0x00010000, 64);
	putUi32(box, 0x40000000, 80);
	putUi32(box, isVisual ? 0x01400000 : 0, 84);
	putUi32(box, isVisual ? 0x00F00000 : 0, 88);
	return box;
};

/**
 * Create a MediaHeaderBox (mdhd).
 * 
 * aligned(8) class MediaHeaderAtom extends FullAtom('tkhd', version, 0) {
 * 	if (version == 1) {
 * 	 uint(64) creation-time;
 *   uint(64) modification-time;
 *   uint(32) timescale;
 *   uint(64) duration;
 *  } else {
 * 	 uint(32) creation-time;
 *   uint(32) modification-time;
 *   uint(32) timescale;
 *   uint(32) duration;
 *  }
 *  bit(1)      pad = 0;
 *  uint(5)[3]  language; // packed ISO-639-2/T language code
 *  uint(16)    reserved = 0;
 * }
 * 
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} timeScale
 * @param {number} duration
 * @return {Uint8Array}
 */
this.createMdhdBox = function(creationTime, modificationTime, timeScale, duration){
	var box = self.createFullBox(32, "mdhd", 0, 0);
	putUi32(box, creationTime, 12);
	putUi32(box, modificationTime, 16);
	putUi32(box, timeScale, 20);
	putUi32(box, duration, 24);
	putUi16(box, 0x55C4, 28);
	return box;
};

/**
 * Create a HandlerBox (hdlr).
 * 
 * aligned(8) class HandlerAtom extends FullAtom('hdlr', version, 0) {
 * 	uint(32)    reserved = 0;
 *  uint(32)    handler-type;
 *  uint(8)[12] reserved = 0;
 *  string      name;
 * }
 * 
 * @param {string} handlerType
 * @param {string} name
 * @return {Uint8Array}
 */
this.createHdlrBox = function(handlerType, name){
	var box = self.createFullBox(12 + 4 + 4 + 12 + name.length + 1, "hdlr", 0, 0);
	putStr(box, handlerType, 16);
	putStr(box, name, 32);
	return box;
};

/**
 * Concat boxes
 * @param {string} type
 * @param {...Uint8Array} boxes
 * @return {Uint8Array}
 */
this.concatBoxes = function(type, boxes){
	var boxes = Array.prototype.slice.call(arguments, 1),
		type = arguments[0],
		box, arr;
	
	arr = concatByteArrays(boxes);
	box = self.createBox(arr.length + 8, type);
	box.set(arr, 8);
	return box;
};

/**
 * Create a URLDataEntryBox (url ).
 * 
 * aligned(8) class DataEntryUrlAtom extends FullAtom('url ', version = 0, flags) {
 * 	string location;
 * }
 * 
 * @param {string} location
 * @param {number} flags
 * @return {Uint8Array}
 */
this.createUrlBox = function(location, flags){
	flags = typeof flags === "undefined" ? 1 : flags;
	var len = typeof location === "string" ? location.length + 1 : 0;
	var box = self.createFullBox(12 + len, "url ", 0, flags);
	len && putStr(box, location, 12);
	return box;
};

/**
 * Create a URNDataEntryBox (urn ).
 * 
 * aligned(8) class DataEntryUrnAtom extends FullAtom('urn ', version = 0, flags) {
 * 	string name;
 *  string location;
 * }
 * 
 * @param {string} name
 * @param {string} location
 * @param {number} flags
 * @return {Uint8Array}
 */
this.createUrnBox = function(name, location, flags){
	return createUrlBox(name + "\x00" + location, flags);
};

/**
 * Create a DataReferenceBox (dref).
 * 
 * aligned(8) class DataReferenceAtom extends FullAtom('dref', version = 0, 0) {
 * 	uint(32) entry-count;
 *  for (int i = 0; i < entry-countl i++) {
 * 	 DataEntryAtom(entry-version, entry-flags) data-entry;
 *  }
 * }
 * 
 * @param {...Uint8Array} dataEntries 
 * @return {Uint8Array}
 */
this.createDrefBox = function(dataEntries){
	var dataEntries = Array.prototype.slice.call(arguments, 0),
		box, arr;
	
	arr = concatByteArrays(dataEntries);
	box = self.createFullBox(arr.length + 16, "dref", 0, 0);
	putUi32(box, 12, dataEntries.length);
	box.set(arr, 16);
	return box;
};

/**
 * Create a SampleSizeBox (stsz).
 * 
 * aligned(8) class SampleSizeAtom extends FullAtom('stsz', version = 0, 0) {
 * 	uint(32) sample-size;
 *  uint(32) sample-count;
 *  for (int i = 0; i < sample-count; i++) {
 * 	 uint(32) entry-size;
 *  }
 * }
 * 
 * @param {number} sampleSize
 * @param {Array} sampleSizeArr
 * @return {Uint8Array}
 */
this.createStszBox = function(sampleSize, sampleSizeArr){
	var box = self.createFullBox(12 + 8 + (sampleSizeArr.length * 4), "stsz", 0, 0),
		i, n;
	
	putUi32(box, sampleSize, 12);
	putUi32(box, sampleSizeArr.length, 16);
	if(sampleSize === 0) {
		for(i = 0, n = sampleSizeArr.length; i < n; ++i) {
			putUi32(box, sampleSizeArr[i], i * 4 + 20);
		}
	}
	return box;
};

/**
 * Create a MovieHeaderBox (mvhd).
 * 
 * aligned(8) class MovieHeaderAtom extends FullAtom('mvhd', version, 0) {
 * 	if (version == 1) {
 * 	 uint(64) creation-time;
 *   uint(64) modification-time;
 *   uint(32) timescale;
 *   uint(64) duration;
 *  } else {
 * 	 uint(32) creation-time;
 *   uint(32) modification-time;
 *   uint(32) timescale;
 *   uint(32) duration;
 *  }
 *  bit(32)     reserved = 0x00010000;
 *  bit(16)     reserved = 0x0100;
 *  bit(16)     reserved = 0;
 *  uint(32)[2] reserved = 0;
 *  bit(32)[9]  reserved = { 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 };
 *  bit(32)[6]  reserved = 0;
 *  uint(32)    next-track-ID;
 * }
 * 
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} timeScale
 * @param {number} duration
 * @param {number} nextTrackId
 * @return {Uint8Array}
 */
this.createMvhdBox = function(creationTime, modificationTime, timeScale, duration, nextTrackId){
	var box = self.createFullBox(108, "mvhd", 0, 0);
	putUi32(box, creationTime, 12);
	putUi32(box, modificationTime, 16);
	putUi32(box, timeScale, 20);
	putUi32(box, duration, 24);
	putUi32(box, 0x00010000, 28);
	putUi16(box, 0x0100, 32);
	putUi32(box, 0x00010000, 44);
	putUi32(box, 0x00010000, 60);
	putUi32(box, 0x40000000, 76);
	putUi32(box, nextTrackId, 104);
	return box;
};

/**
 * Create a ObjectDescriptorBox (iods).
 * 
 * aligned(8) class ObjectDescriptorAtom extends FullAtom('iods', version = 0, 0) {
 * 	InitialObjectDescriptor OD;
 * }
 * 
 * @param {Uint8Array} initalObjectDescr
 * @return {Uint8Array}
 */
this.createIodsBox = function(initalObjectDescr){
	var box = self.createFullBox(initalObjectDescr.length + 12, "iods", 0, 0);
	box.set(initalObjectDescr, 12);
	return box;
};

/**
 * Create a data infomation box (dinf).
 * @param {...Uint8Array} args
 * @return {Uint8Array}
 */
this.createDinfBox = function(args){
	var args = Array.prototype.slice.call(arguments, 0),
		size = 16,
		offset = 16,
		i, n, dref, dinf;
	
	for(i = 0, n = args.length; i < n; ++i) size += args[i].length;
	dref = self.createFullBox(size, "dref", 0, 0);
	putUi32(dref, n, 12);
	for(i = 0; i < n; ++i) {
		dref.set(args[i], offset);
		offset += args[i].length;
	}
	dinf = self.createBox(size + 8, "dinf");
	dinf.set(dref, 8);
	return dinf;
};

/**
 * Create a sample description box (stsd).
 * 
 * aligned(8) class SampleDescriptionAtom extends FullAtom('stsd', version = 0, 0) {
 * 	uint(32) entry-count;
 *  for (int i = 0; i < entry-count; i++) {
 * 	 SampleEntry(entry-format) entry;
 *  }
 * }
 * 
 * @param {...Uint8Array} sampleEntries
 * @return {Uint8Array}
 */
this.createStsdBox = function(sampleEntries){
	var sampleEntries = Array.prototype.slice.call(arguments, 0),
		box, arr;
	
	arr = concatByteArrays(sampleEntries);
	box = self.createFullBox(arr.length + 16, "stsd", 0, 0);
	putUi32(box, sampleEntries.length, 12);
	box.set(arr, 16);
	return box;
};

/**
 * Create a TimeToSampleBox (stts).
 * 
 * aligned(8) class TimeToSampleBox extends FullAtom('stts', version = 0, 0) {
 * 	uint(32) entry-count;
 *  for (int i = 0; i < entry-count; i++) {
 * 	 uint(32) sample-count;
 *   int(32) sample-duration;
 *  }
 * }
 * 
 * @param {Array} entries
 * @return {Uint8Array}
 */
this.createSttsBox = function(entries){
	var size = 16 + entries.length * 8,
		box = self.createFullBox(size, "stts", 0, 0),
		offset = 16,
		i, n;
	
	putUi32(box, entries.length, 12);
	for(i = 0, n = entries.length; i < n; ++i) {
		putUi32(box, entries[i].count, offset);
		putUi32(box, entries[i].duration, offset + 4);
		offset += 8;
	}
	return box;
};

/**
 * Create a SampleToChunkBox (stsc).
 * 
 * aligned(8) class SampleToChunkAtom extends FullAtom('stsc', version = 0, 0) {
 * 	uint(32) entry-count;
 *  for (int i = 0; i < entry-count; i++) {
 * 	 uint(32) first-chunk;
 *   uint(32) samples-per-chunk;
 *   uint(32) samples-description-index;
 *  }
 * }
 * 
 * @param {Array.<Object>} chunks
 * @return {Uint8Array}
 */
this.createStscBox = function(chunks){
	chunks = isType(chunks, Array) ? chunks : [chunks];
	var n = chunks.length,
		box = self.createFullBox(12 + 4 + n * 12, "stsc", 0, 0),
		i, offset = 16;
	
	putUi32(box, n, 12);
	for(i = 0; i < n; ++i) {
		putUi32(box, chunks[i].firstChunk, offset); offset += 4;
		putUi32(box, chunks[i].samplesPerChunk, offset); offset += 4;
		putUi32(box, chunks[i].samplesDescriptionIndex, offset); offset += 4;
	}
	return box;
};

/**
 * Create a ChunkOffsetBox (stco).
 * 
 * aligned(8) class ChunkOffsetAtom extends FullAtom('stco', version = 0, 0) {
 * 	uint(32) entry-count;
 *  for (int i = 0; i < entry-count; i++) {
 * 	 uint(32) chunk-offset;
 *  }
 * }
 * 
 * @param {Array} chunkOffsets
 * @return {Uint8Array}
 */
this.createStcoBox = function(chunkOffsets){
	var n = chunkOffsets.length,
		box = self.createFullBox(16 + n * 4, "stco", 0, 0),
		i, j;
	
	putUi32(box, n, 12);
	for(i = 0; i < n; ++i) putUi32(box, chunkOffsets[i], i * 4 + 16);
	return box;
};

/**
 * Create a FreeSpaceBox (free).
 * 
 * aligned(8) class FreeSpaceAtom extends Atom(free-type) {
 * 	uint(8) data[];
 * }
 * 
 * @param {string} str
 * @return {Uint8Array}
 */
this.createFreeBox = function(str){
	var box = self.createBox(8 + str.length + 1, "free");
	putStr(box, str, 8);
	return box;
};

/**
 * Create a file type box (ftyp).
 * @param {string} main
 * @param {...string} other 
 * @return {Uint8Array}
 */
this.createFtypBox = function(main, other){
	var args = Array.prototype.slice.call(arguments, 0),
		box = self.createBox(args.length * 4 + 16, "ftyp"),
		offset = 16,
		i, n;
	
	putStr(box, main, 8);
	for(i = 0, n = args.length; i < n; ++i) {
		putStr(box, args[i], offset);
		offset += 4;
	}
	return box;
};

}).call((function(mp4js){
	mp4js = mp4js || {};
	mp4js.box = mp4js.box || {};
	return mp4js.box;
})(this.mp4js), this, this.mp4js.utils);
