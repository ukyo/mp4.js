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
	var box = new Uint8Array(size),
		view = DataView.create(box);
	view.setUint32(0, size);
	view.setString(4, type);
	return box;
};

/**
 * Get a BoxInfo.
 * @param {Uint8Array}
 * @return {Object}
 */
this.getBoxInfo = function(bytes){
	var view = DataView.create(bytes);
	return {
		size: view.getUint32(0),
		type: view.getString(4, 4)
	};
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
	var box = self.createBox(size, type),
		view = DataView.create(box);
	view.setUint16(8, version);
	view.setUint16(10, flags);
	return box;
};

/**
 * Get a FullBoxInfo.
 * @param {Uint8Array}
 * @return {Object}
 */
this.getFullBoxInfo = function(bytes){
	var view = DataView.create(bytes);
	return {
		size: view.getUint32(0),
		type: view.getString(4, 4),
		version: view.getUint16(8),
		flags: vies.getUint16(10)
	};
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
		box = self.createBox(size, "mp4a"),
		view = DataView.create(box);
	view.setUint16(14, dataReferenceIndex);
	view.setUint16(24, 2);
	view.setUint16(26, 16);
	view.setUint16(32, timeScale);
	box.set(esdsBox, 36);
	return box;
};

/**
 * Parse a MPEG4AudioSampleDescriptionBox.
 * @param {Uint8Array}
 * @return {Object}
 */
this.parseMp4aBox = function(){
	
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
 * Parse a ESDescriptorBox.
 * @param {Uint8Array}
 * @return {Object}
 */
this.parseEsdsBox = function(){
	
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
	var box = self.createFullBox(92, "tkhd", 0, 1),
		view = DataView.create(box);
	view.setUint32(12, creationTime);
	view.setUint32(16, modificationTime);
	view.setUint32(20, trackId);
	view.setUint32(28, duration);
	view.setUint16(44, !isVisual ? 0x0100 : 0);
	view.setUint32(48, 0x00010000);
	view.setUint32(64, 0x00010000);
	view.setUint32(80, 0x40000000);
	view.setUint32(84, isVisual ? 0x01400000 : 0);
	view.setUint32(88, isVisual ? 0x00F00000 : 0);
	return box;
};

/**
 * Parse a TrackHeaderBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseTkhdBox = function(bytes){
	var view = DataView.create(bytes),
		fullBoxInfo = self.getFullBoxInfo(bytes);
	return {
		fullBoxInfo: fullBoxInfo,
		creattionTime: 0,
		modificationTime: 0,
		trackId: 0,
		duration: 0,
		isVisual: 0
	};
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
	var box = self.createFullBox(32, "mdhd", 0, 0),
		view = DataView.create(box);
	view.setUint32(12, creationTime);
	view.setUint32(16, modificationTime);
	view.setUint32(20, timeScale);
	view.setUint32(24, duration);
	view.setUint16(28, 0x55C4);
	return box;
};

/**
 * Parse a MediaHeaderBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseMdhdBox = function(bytes){
	var view = DataView.create(bytes),
		fullBoxInfo = self.getFullBoxInfo(bytes);
	return {
		fullBoxInfo: fullBoxInfo,
		creationTime: 0,
		modificationTime: 0,
		timeScale: 0,
		duration: 0
	};
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
	var box = self.createFullBox(12 + 4 + 4 + 12 + name.length + 1, "hdlr", 0, 0),
		view = DataView.create(box);
	view.setString(16, handlerType);
	view.setString(32, name);
	return box;
};

/**
 * Parse a HandlerBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseHdlrBox = function(bytes){
	var view = DataView.create(bytes),
		fullBoxInfo = self.getFullBoxInfo(bytes);
	return {
		fullBoxInfo: fullBoxInfo,
		handlerType: view.getString(16, 4),
		name: view.getString(32, bytes.length - 32)
	};
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
	var len = typeof location === "string" ? location.length + 1 : 0,
		box = self.createFullBox(12 + len, "url ", 0, flags),
		view = DataView.create(box);
	len && view.setString(12, location);
	return box;
};

/**
 * Parse a URLDataEntryBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseUrlBox = function(bytes){
	var view = DataView.create(bytes);
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		location: view.getString(12, bytes.length - 13)
	};
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
 * Parse a URNDataEntryBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseUrnBox = function(bytes){
	var view = DataView.create(bytes),
		props = view.getString(12, bytes.length -13).split("\00");
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		name: props[0],
		location: props[1]
	};
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
		box, arr, view;
	
	arr = concatByteArrays(dataEntries);
	box = self.createFullBox(arr.length + 16, "dref", 0, 0);
	view = DataView.create(box);
	view.setUint32(12, dataEntries.length);
	// putUi32(box, 12, dataEntries.length);
	box.set(arr, 16);
	return box;
};

/**
 * Parse a DataReferenceBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseDrefBox = function(bytes){
	
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
		view = DataView.create(box),
		i, n;
	
	view.setUint32(12, sampleSize);
	view.setUint32(16, sampleSizeArr.length);
	if(sampleSize === 0) {
		for(i = 0, n = sampleSizeArr.length; i < n; ++i) {
			view.setUint32(i * 4 + 20, sampleSizeArr[i]);
		}
	}
	return box;
};

/**
 * Parse a SampleSizeBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseStszBox = function(bytes){
	var view = DataView.create(bytes),
		sampleSize = view.getUint32(12),
		sampleCount = view.getUint32(16),
		body = [],
		offset = 20,
		i;
	if(sampleSize === 0) {
		for(i = 0; i < sampleCount; ++i) {
			body[i] = view.getUint32(i * 4 + offset);
		}
	}
	return {
		fullBoxInfo: self.getFullBox(bytes),
		sampleSize: sampleSize,
		sampleCount: sampleCount,
		body: body
	};
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
	var box = self.createFullBox(108, "mvhd", 0, 0),
		view = DataView.create(box);
	view.setUint32(12, creationTime);
	view.setUint32(16, modificationTime);
	view.setUint32(20, timeScale);
	view.setUint32(24, duration);
	view.setUint32(28, 0x00010000);
	view.setUint16(32, 0x0100);
	view.setUint32(44, 0x00010000);
	view.setUint32(60, 0x00010000);
	view.setUint32(76, 0x40000000);
	view.setUint32(104, nextTrackId);
	return box;
};

/**
 * Parse a MovieHeaderBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseMvhdBox = function(bytes){
	var view = DataView.create(bytes);
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		creationTime: view.getUint32(12),
		modificationTime: view.getUint32(16),
		timeScale: view.getUint32(20),
		duration: view.getUint32(24),
		nextTrackId: view.getUint32(104)
	};
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
 * Parse a ObjectDescriptorBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseIodsBox = function(bytes){
	
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
 * Parse a data infomation box.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseDinfBox = function(bytes){
	
};

/**
 * Create a SampleDescriptionBox (stsd).
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
		box, arr, view;
	
	arr = concatByteArrays(sampleEntries);
	box = self.createFullBox(arr.length + 16, "stsd", 0, 0);
	view = DataView.create(box);
	view.setUint32(12, sampleEntries.length);
	box.set(arr, 16);
	return box;
};

/**
 * Parse a SampleDescriptionBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseStsdBox = function(bytes){
	
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
		view = DataView.create(box),
		offset = 16,
		i, n;
	
	view.setUint32(12, entries.length);
	for(i = 0, n = entries.length; i < n; ++i) {
		view.setUint32(offset, entries[i].count);
		view.setUint32(offset + 4, entries[i].duration);
		offset += 8;
	}
	return box;
};

/**
 * Parse a TimeToSampleBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseSttsBox = function(bytes){
	var view = DataView.create(bytes),
		offset = 16,
		entryCount = view.getUint32(12),
		body = [],
		i;
	for(i = 0; i < entryCount; ++i) {
		body[i] = {
			sampleCount: view.getUint32(offset),
			sampleDuration: view.getUint32(offset + 4)
		};
		offset += 8;
	}
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		entryCount: entryCount,
		body: body
	};
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
		view = DataView.create(box),
		i, offset = 16;
	
	view.setUint32(12, n);
	for(i = 0; i < n; ++i) {
		view.setUint32(offset, chunks[i].firstChunk); offset += 4;
		view.setUint32(offset, chunks[i].samplesPerChunk); offset += 4;
		view.setUint32(offset, chunks[i].samplesDescriptionIndex); offset += 4;
	}
	return box;
};

/**
 * Parse a SampleToChunkBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseStscBox = function(bytes){
	var view = DataView.create(bytes),
		offset = 16,
		entryCount = view.getUint32(12),
		body = [],
		i;
	for(i = 0; i < entryCount; ++i) {
		body[i] = {
			firstChunk: view.getUint32(offset),
			samplesPerChunk: view.getUint32(offset + 4),
			samplesDescriptionIndex: view.getUint32(offset + 8)
		};
		offset += 12;
	}
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		entryCount: entryCount,
		body: body
	};
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
		view = DataView.create(box),
		i, j;
	
	view.setUint32(12, n);
	for(i = 0; i < n; ++i) view.setUint32(i * 4 + 16, chunkOffsets[i]);
	return box;
};

/**
 * Parse a ChunkOffsetBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseStcoBox = function(bytes){
	var view = DataView.create(bytes),
		entryCount = view.getUint32(12),
		offset = 16,
		body = [],
		i;
	for(i = 0; i < entryCount; ++i) {
		body[i] = view.getUint32(offset);
		offset += 4;
	}
	return {
		fullBoxInfo: self.getFullBoxInfo(bytes),
		entryCount: entryCount,
		body: body
	};
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
	var box = self.createBox(8 + str.length + 1, "free"),
		view = DataView.create(box);
	view.setString(8, str);
	return box;
};

/**
 * Parse a FreeSpaceBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseFreeBox = function(bytes){
	var view = DataView.create(bytes);
	return {
		boxInfo: self.getBoxInfo(bytes),
		text: view.getString(8, bytes.length - 9)
	};
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
		view = DataView.create(box),
		offset = 16,
		i, n;
	
	view.setString(8, main);
	// putStr(box, main, 8);
	for(i = 0, n = args.length; i < n; ++i) {
		view.setString(offset, args[i]);
		offset += 4;
	}
	return box;
};

/**
 * Parse a FreeSpaceBox.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseFreeBox = function(bytes){
	var view = DataView.create(bytes),
		alternateBrands = [],
		offset = 16,
		i, n;
	for(i = 0, n = (bytes.length - offset) / 4; i < n; ++i) {
		alternateBrands[i] = view.getString(offset, 4);
		offset += 4;
	}
	return {
		boxInfo: self.getBoxInfo(bytes),
		majerBrand: view.getString(8, 4),
		alternateBrands: alternateBrands
	};
};

}).call((function(mp4js){
	mp4js = mp4js || {};
	mp4js.box = mp4js.box || {};
	return mp4js.box;
})(this.mp4js), this, this.mp4js.utils);
