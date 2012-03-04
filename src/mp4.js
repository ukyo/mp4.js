/*
Copyright 2012 - Syu Kato (ukyo.web@gmail.com) @ukyo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var Mp4 = (function(){

var fromCharCode = String.fromCharCode,
	BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder,
	//see: http://www.mp4ra.org/atoms.html
	boxes = {
		ID32: getBox,
		albm: function(bytes, offset, size){},
		auth: function(bytes, offset, size){},
		bpcc: function(bytes, offset, size){},
		buff: function(bytes, offset, size){},
		bxml: getBox,
		ccid: function(bytes, offset, size){},
		cdef: function(bytes, offset, size){},
		clsf: function(bytes, offset, size){},
		cmap: function(bytes, offset, size){},
		co64: function(bytes, offset, size){},
		colr: function(bytes, offset, size){},
		cprt: function(bytes, offset, size){},
		crhd: function(bytes, offset, size){},
		cslg: function(bytes, offset, size){},
		ctts: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getIntBE(bytes, offset += 12);
				
			for(i = 0; i < n; ++i){
				ret.body.push({
					compositionOffset: getIntBE(bytes, offset += 4),
					sampleCount: getIntBE(bytes, offset += 4)
				})
			}
			return ret;
		},
		cvru: function(bytes, offset, size){},
		dcfD: function(bytes, offset, size){},
		dinf: getBox,
		dref: getBox,
		dscp: function(bytes, offset, size){},
		dsgd: getBox,
		dstg: getBox,
		edts: getBox,
		elst: function(bytes, offset, size){},
		feci: function(bytes, offset, size){},
		fecr: function(bytes, offset, size){},
		fiin: function(bytes, offset, size){},
		fire: function(bytes, offset, size){},
		fpar: function(bytes, offset, size){},
		free: function(bytes, offset, size){},
		frma: getBox,
		ftyp: function(bytes, offset, size){},
		gitn: function(bytes, offset, size){},
		gnre: function(bytes, offset, size){},
		grpi: function(bytes, offset, size){},
		hdlr: function(bytes, offset, size){
			return {
				size: size,
				type: getType(bytes, offset + 16)
			}
		},
		hmhd: function(bytes, offset, size){},
		hpix: function(bytes, offset, size){},
		icnu: function(bytes, offset, size){},
		idat: function(bytes, offset, size){},
		ihdr: function(bytes, offset, size){},
		iinf: function(bytes, offset, size){},
		iloc: function(bytes, offset, size){},
		imif: getBox,
		infu: function(bytes, offset, size){},
		iods: getBox,
		iphd: function(bytes, offset, size){},
		ipmc: getBox,
		ipro: function(bytes, offset, size){},
		iref: function(bytes, offset, size){},
		'jp  ': function(bytes, offset, size){},
		jp2c: function(bytes, offset, size){},
		jp2h: function(bytes, offset, size){},
		jp2i: function(bytes, offset, size){},
		kywd: function(bytes, offset, size){},
		loci: function(bytes, offset, size){},
		lrcu: function(bytes, offset, size){},
		m7hd: function(bytes, offset, size){},
		mdat: function(bytes, offset, size){
			return {offset: offset, size: size, dataSize: size - 8};
		},
		mdhd: function(bytes, offset, size){
			return {
				size: size,
				creationTime: getIntBE(bytes, offset + 12),
				modificationTime: getIntBE(bytes, offset + 16),
				timeScale: getIntBE(bytes, offset + 20),
				duration: getIntBE(bytes, offset + 24),
				languageCode: getIntBE(bytes, offset + 28)
			}
		},
		mdia: getBox,
		mdri: function(bytes, offset, size){},
		meco: getBox,
		mehd: getBox,
		mere: function(bytes, offset, size){},
		meta: getBox,
		mfhd: function(bytes, offset, size){},
		mfra: function(bytes, offset, size){},
		mfro: function(bytes, offset, size){},
		minf: getBox,
		mjhd: function(bytes, offset, size){},
		moof: function(bytes, offset, size){},
		moov: getBox,
		mvcg: function(bytes, offset, size){},
		mvci: function(bytes, offset, size){},
		mvex: getBox,
		mvhd: function(bytes, offset, size){
			
		},
		mvra: function(bytes, offset, size){},
		nmhd: function(bytes, offset, size){},
		ochd: function(bytes, offset, size){},
		odaf: function(bytes, offset, size){},
		odda: function(bytes, offset, size){},
		odhd: function(bytes, offset, size){},
		odhe: function(bytes, offset, size){},
		odrb: function(bytes, offset, size){},
		odrm: getBox,
		odtt: function(bytes, offset, size){},
		ohdr: function(bytes, offset, size){},
		padb: function(bytes, offset, size){},
		paen: function(bytes, offset, size){},
		pclr: function(bytes, offset, size){},
		pdin: function(bytes, offset, size){},
		perf: function(bytes, offset, size){},
		pitm: function(bytes, offset, size){},
		'res ': function(bytes, offset, size){},
		resc: function(bytes, offset, size){},
		resd: function(bytes, offset, size){},
		rtng: function(bytes, offset, size){},
		sbgp: getBox,
		schi: getBox,
		schm: getBox,
		sdep: function(bytes, offset, size){},
		sdhd: function(bytes, offset, size){},
		sdtp: getBox,
		sdvp: getBox,
		segr: function(bytes, offset, size){},
		sgpd: getBox,
		sidx: getBox,
		sinf: getBox,
		skip: function(bytes, offset, size){},
		smhd: function(bytes, offset, size){},
		srmb: function(bytes, offset, size){},
		srmc: getBox,
		srpp: function(bytes, offset, size){},
		stbl: getBox,
		stco: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getIntBE(bytes, offset += 12);
			
			for(i = 0; i < n; ++i){
				ret.body.push(getIntBE(bytes, offset += 4));
			}
			return ret;
		},
		stdp: function(bytes, offset, size){},
		stsc: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getIntBE(bytes, offset += 12);
			
			for(i = 0; i < n; ++i){
				ret.body.push({
					firstChunk: getIntBE(bytes, offset += 4),
					samplesPerChunk: getIntBE(bytes, offset += 4),
					sampleDescriptionIndex: getIntBE(bytes, offset += 4)
				})
			}
			return ret;
		},
		stsd: function(bytes, offset, size){
			return getBox(bytes, offset + 8, size - 8);
		},
		stsh: function(bytes, offset, size){},
		stss: function(bytes, offset, size){},
		stts: function(bytes, offset, size){
			return {
				size: size,
				entryCount: getIntBE(bytes, offset + 12),
				sampleCount: getIntBE(bytes, offset + 16),
				sampleDelta: getIntBE(bytes, offset + 20)
			}
		},
		styp: getBox,
		stsz: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getIntBE(bytes, offset += 16);
			
			for(i = 0; i < n; ++i){
				ret.body.push(getIntBE(bytes, offset += 4));
			}
			return ret;
		},
		stz2: function(bytes, offset, size){},
		subs: function(bytes, offset, size){},
		swtc: function(bytes, offset, size){},
		tfad: getBox,
		tfhd: function(bytes, offset, size){},
		tfma: getBox,
		tfra: function(bytes, offset, size){},
		tibr: function(bytes, offset, size){},
		tiri: function(bytes, offset, size){},
		titl: function(bytes, offset, size){},
		tkhd: function(bytes, offset, size){},
		traf: function(bytes, offset, size){},
		trak: getBox,
		tref: getBox,
		trex: function(bytes, offset, size){},
		trgr: function(bytes, offset, size){},
		trun: function(bytes, offset, size){},
		tsel: function(bytes, offset, size){},
		udta: getBox,
		uinf: function(bytes, offset, size){},
		UITS: function(bytes, offset, size){},
		ulst: function(bytes, offset, size){},
		'url ': function(bytes, offset, size){},
		vmhd: function(bytes, offset, size){},
		vwdi: function(bytes, offset, size){},
		'xml ': function(bytes, offset, size){},
		yrrc: function(bytes, offset, size){},
		
		//codecs
		mp4a: function(bytes, offset, size){
			return {
				dataReferenceIndex: getIntBE(bytes, offset += 12),
				channels: getShortBE(bytes, offset += 12),
				bitPerSample: getShortBE(bytes, offset += 2),
				sampleRate: getIntBE(bytes, offset += 4),
				esds: {
					objectTypeIndication: bytes[offset += 25],
					bufferSizeDB: getShortBE(bytes, offset += 3),
					maxBitrate: getIntBE(bytes, offset += 2),
					avgBitrate: getIntBE(bytes, offset += 4)
				}
			}
		}
	},
	sampleRateTable = {
		96000: 0,
		88200: 1,
		64000: 2,
		48000: 3,
		44100: 4,
		32000: 5,
		24000: 6,
		22050: 7,
		16000: 8,
		12000: 9,
		11025: 10,
		8000: 11
	},
	sampleRateTableReverse = [
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

Blob.prototype.slice = Blob.prototype.webkitSlice || Blob.prototype.mozSlice || Blob.prototype.slice;

function Mp4(data){
	var self = this;
	
	this.complete = false;
	this.cache = {};
	
	if(isType(data, ArrayBuffer)){
		this.data = data;
		this.cache.parse = this.parse();
	} else if(isType(data, String)){
		loadFileBuffer(data, function(bytes, offset, size){
			self.data = bytes;
			self.cache.parse = self.parse();
			self.complete = true;
		});
	}
};

Mp4.prototype = {
	//only AAC-LC
	extractAAC: function(){
		var tree = this.parse(),
			tracks = tree.moov.trak,
			audioTrack, mp4a, sampleToChunkEntries, sampleSizeEntries, chunkEntries,
			i, j, k, n, m, l, fileSize, idx,　result,
			resultOffset = 0,
			offset = 0,
			bb = new BlobBuilder(),
			aacHeader = new Uint8Array(new ArrayBuffer(7));
		
		if(isType(tracks, Array)){
			tracks.forEach(function(track){
				if(track.mdia.hdlr.type === 'soun'){
					audioTrack = track;
				}
			});
		} else {
			if(tracks.mdia.hdlr.type === 'soun'){
				audioTrack = tracks;
			} else {
				throw 'This file does not have audio files.';
			}
		}
		
		mp4a = audioTrack.mdia.minf.stbl.stsd.mp4a;
		sampleToChunkEntries = audioTrack.mdia.minf.stbl.stsc.body;
		sampleSizeEntries = audioTrack.mdia.minf.stbl.stsz.body;
		chunkEntries = audioTrack.mdia.minf.stbl.stco.body;
		
		result = new Uint8Array(sampleSizeEntries.length * 4 + sampleSizeEntries.reduce(function(a, b){return a + b}));
		aacHeader[0] = 0xFF;
		aacHeader[1] = 0xF9;
		aacHeader[2] = 0x40 | (sampleRateTable[mp4a.sampleRate] << 2) | (mp4a.channels >> 2);
		aacHeader[6] = 0xFC;
		
		for(i = 0, idx = 0, n = sampleToChunkEntries.length; i < n; ++i){
			j = sampleToChunkEntries[i].firstChunk - 1;
			m = i + 1 < n ? sampleToChunkEntries[i + 1].firstChunk - 1 : chunkEntries.length;
			for(;j < m; ++j){
				offset = chunkEntries[j];
				for(k = 0, l = sampleToChunkEntries[i].samplesPerChunk; k < l; ++k, ++idx){
					//AAC header.
					fileSize = sampleSizeEntries[idx] + 7;
					aacHeader[3] = (mp4a.channels << 6) | (fileSize >> 11);
					aacHeader[4] = fileSize >> 3;
					aacHeader[5] = (fileSize << 5) | (0x7ff >> 6);
					
					result.set(aacHeader, resultOffset);
					resultOffset += 7;
					result.set(data.subarray(offset, offset += sampleSizeEntries[idx]), resultOffset);
					resultOffset += sampleSizeEntries[idx];
					//bb.append(aacHeader.buffer);
					
					//AAC body.
					//bb.append(this.blob.slice(offset, offset += sampleSizeEntries[idx]));
				}
			}
		}
		return result.buffer;
	},
	
	extractAACAsBlob: function(){
		var bb = new BlobBuilder();
		bb.append(this.extractAAC());
		return bb.getBlob("audio/aac");
	},
	
	parse: function(){
		if(this.cache.parse) return this.cache.parse;
		return getBox(new Uint8Array(this.data), -8, this.data.byteLength);
	}
};

function getBox(bytes, offset, size){
	var ret = {size: size},
		last = offset + size,
		boxInfo, box;
	
	offset += 8;
	while(offset < last){
		boxInfo = getBoxInfo(bytes, offset);
		box = boxes[boxInfo.type];
		if(box) {
			if(ret[boxInfo.type] && !isType(ret[boxInfo.type], Array)){
				ret[boxInfo.type] = [ret[boxInfo.type]];
				ret[boxInfo.type].push(box(bytes, offset, boxInfo.size));
			} else if(isType(ret[boxInfo.type], Array)){
				ret[boxInfo.type].push(box(bytes, offset, boxInfo.size));
			} else {
				ret[boxInfo.type] = box(bytes, offset, boxInfo.size);
			}
		} else {
			break;
		}
		offset += boxInfo.size;
	}
	
	return ret;
}

function getIntBE(bytes, offset){
	return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
}

function getShortBE(bytes, offset){
	return (bytes[offset] << 8) | (bytes[offset + 1]);
}

function getType(bytes, offset){
	return fromCharCode.apply(null, [bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]]);
}

function getBoxInfo(bytes, offset){
	return {
		size: getIntBE(bytes, offset),
		type: getType(bytes, offset + 4)
	}
}

function isType(obj, type){
	return obj != null ? obj.constructor == type : false;
}

function loadFileBuffer(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(){
		callback(xhr.response);
	};
	xhr.send();
}

/**
 * @param {ArrayBuffer} data
 * @return {ArrayBuffer}
 * 
 * mp4 box structure:
 *   ftyp
 *   moov
 *     iods
 *     mvhd
 *     trak
 *       tkhd
 *       mdia
 *         mdhd
 *         hdlr
 *         minf
 *           smhd
 *           dinf
 *           stbl
 *             stsd
 *             stts
 *             stsc
 *             stsz
 *             stco
 *   mdat
 *   free
 */
function aacToM4a(data){
	var ui8a = new Uint8Array(data),
		offset = 0,
		count = 0,
		samplesPerChunk = 1318,
		sampleSizes = [],
		sampleOffsets = [],
		result,
		currentTime = Date.now(),
		dataSize, chunkIndex,
		dataOffset, mdatOffset, stcoOffset,
		mp4a, slConfigDescr, decConfigDescr, esDescr, decSpecificInfo,
		esds,
		dataBuilder = new BlobBuilder(),
		i, j,
		
		ftyp, stts, stsc, stsz, stco, stsd, stbl, dinf,
		smhd, minf, mdhd, hdlr, mdia, tkhd, iods, mdat,
		free, mvhd, trak,
		
		//aac header
		adts = {};
	
	function getFrameLength(offset) {
		return ((ui8a[offset + 3] & 0x3) << 11) | (ui8a[offset + 4] << 3) | (ui8a[offset + 5] >> 5);
	}
	
	//aac header
	adts.id = (ui8a[1] & 0x8) >> 3;
	adts.profile = ui8a[2] >> 6;
	adts.sampleRate = sampleRateTableReverse[(ui8a[2] & 0x3C) >> 2];
	adts.channelConf = ((ui8a[2] & 1) << 2) | (ui8a[3] >> 6);
	adts.original = ui8a[3] & 0x20;
	adts.bufferFullness = ((ui8a[5] & 0x1F) << 6) | (ui8a[6] >> 2);
	
	//count aac samples
	while(offset < ui8a.length) {
		sampleOffsets[count] = offset;
		sampleSizes[count++] = getFrameLength(offset) - 7;//last number is aac header size.
		offset += getFrameLength(offset);
	}
	
	decSpecificInfo = createDecoderSpecificInfo("\x12\x10");
	decConfigDescr = createDecodeConfigDescriptor(0x67, 0x05, 0, 0, 0, 0, [decSpecificInfo]);
	slConfigDescr = createSLConfigDescriptor(2);
	esDescr = createESDescriptor(0, 0, null, null, decConfigDescr, slConfigDescr, []);
	esds = createEsdsBox(esDescr);
	mp4a = createMp4aBox(1, adts.sampleRate, esds);
	
	ftyp = createFtypBox("M4A ", "isom", "mp42");
	stts = createSttsBox([{count: count, duration: 1024}]);
	stsc = createStscBox(count, samplesPerChunk);
	stsz = createStszBox(0, sampleSizes);
	stsd = createStsdBox(mp4a);
	dinf = createDinfBox(createUrlBox(null, 1));
	smhd = createBox(16, "smhd");
	mdhd = createMdhdBox(currentTime, currentTime, adts.sampleRate, count * 1024);
	hdlr = createHdlrBox("soun", "GPAC ISO Audio Handler");
	tkhd = createTkhdBox(currentTime, currentTime, 1, ~~(count * 1024 * 600 / adts.sampleRate));
	iods = createIodsBox(0xFF, 0xFF, 0x29, 0xFF, 0xFF);
	mvhd = createMvhdBox(currentTime, currentTime, 600, ~~(count * 1024 * 600 / adts.sampleRate), 2);
	
	dataStart =
		ftyp.length +
		stts.length +
		stsc.length +
		stsz.length +
		stsd.length +
		dinf.length +
		smhd.length +
		mdhd.length +
		hdlr.length +
		tkhd.length +
		iods.length +
		mvhd.length;
	dataStart += 8 * 6;
	dataStart += (~~(sampleSizes.length / samplesPerChunk) + 1) * 4 + 16;
	stco = createStcoBox(samplesPerChunk, sampleSizes, dataStart);
	
	stbl = concatBoxes("stbl", stsd, stts, stsc, stsz, stco);
	minf = concatBoxes("minf", smhd, dinf, stbl);
	mdia = concatBoxes("mdia", mdhd, hdlr, minf);
	trak = concatBoxes("trak", tkhd, mdia);
	moov = concatBoxes("moov", mvhd, iods, trak);
	
	//build media data box(mdat)
	dataSize = 0;
	for(i = 0; i < count; ++i) {
		dataSize += sampleSizes[i];
	}
	mdat = createBox(dataSize + 8, "mdat");
	dataOffset = 0;
	mdatOffset = 8;
	for(i = 0; i < count; ++i) {
		dataOffset = sampleOffsets[i];
		mdat.set(ui8a.subarray(dataOffset + 7, dataOffset + 7 + sampleSizes[i]), mdatOffset);
		mdatOffset += sampleSizes[i];
	}
	console.log("mdat");
	
	free = createFreeBox("IsoMedia File Produced with GPAC 0.4.4");
	
	result = new Uint8Array(
		ftyp.length +
		moov.length +
		mdat.length +
		free.length
	);
	result.set(ftyp, 0);
	result.set(moov, ftyp.length);
	result.set(mdat, ftyp.length + moov.length);
	result.set(free, ftyp.length + moov.length + mdat.length);
	console.log("done!");
	
	return result.buffer;
}

/**
 * @param {Uint8Array} arr
 * @param {number} x
 * @param {number} offset
 */
function putUi16(arr, x, offset){
	arr[offset + 1] = x & 0xFF;
	arr[offset] = x >> 8;
}

/**
 * @param {Uint8Array} arr
 * @param {number} x
 * @param {number} offset
 */
function putUi24(arr, x, offset){
	arr[offset + 2] = x & 0xFF;
	arr[offset + 1] = (x >> 8) & 0xFF;
	arr[offset] = x >> 16;
}

/**
 * @param {Uint8Array} arr
 * @param {number} x
 * @param {number} offset
 */
function putUi32(arr, x, offset){
	arr[offset + 3] = x & 0xFF;
	arr[offset + 2] = (x >> 8) & 0xFF;
	arr[offset + 1] = (x >> 16) & 0xFF;
	arr[offset] = x >> 24;
}

/**
 * @param {Uint8Array} arr
 * @param {string} str
 * @param {number} offset
 */
function putStr(arr, str, offset){
	for(var i = 0, n = str.length; i < n; ++i) {
		arr[i + offset] = str.charCodeAt(i);
	}
}

/**
 * Create a box.
 * @param {number} size
 * @param {string} type
 * @return {Uint8Array}
 */
function createBox(size, type){
	var box = new Uint8Array(size);
	putUi32(box, size, 0);
	putStr(box, type, 4);
	return box;
}

/**
 * Create a full box.
 * @param {number} size
 * @param {string} type
 * @param {number} version
 * @param {number} flags
 * @return {Uint8Array}
 */
function createFullBox(size, type, version, flags){
	var box = createBox(size, type);
	putUi16(box, version, 8);
	putUi16(box, flags, 10);
	return box;
}

/**
 * Create a audio sample entry box (mp4a).
 * @param {number} dataReferenceIndex
 * @param {number} timeScale
 * @param {Uint8Array} esdsBox
 * @return {Uint8Array}
 */
function createMp4aBox(dataReferenceIndex, timeScale, esdsBox){
	var size = 36 + esdsBox.length,
		box = createBox(size, "mp4a");
	putUi16(box, dataReferenceIndex, 14);
	putUi16(box, 2, 24);
	putUi16(box, 16, 26);
	putUi16(box, timeScale, 32);
	box.set(esdsBox, 36);
	return box;
}

/**
 * Create a element stream descriptor box (esds).
 * @param {Uint8Array} esDescr
 * @return {Uint8Array}
 * TODO
 */
function createEsdsBox(esDescr){
	var box = createFullBox(12 + esDescr.length, "esds", 0, 0);
	box.set(esDescr, 12);
	return box;
}

/**
 * Create a base descriptor.
 * @param {number} size
 * @param {number} tag
 * @return {Uint8Array}
 */
function createBaseDescriptor(size, tag){
	var descriptor = new Uint8Array(size + 2);
	descriptor[0] = tag;
	descriptor[1] = size;
	return descriptor;
}

/**
 * Create a ES_Descriptor.
 * @param {number} esId
 * @param {number} streamPriority
 * @param {number} dependsOnEsId
 * @param {string} url
 * @param {Uint8Array} decConfigDescr
 * @param {Uint8Array} slConfigDescr
 * @param {Array} subDescriptors
 * @return {Uint8Array}
 */
function createESDescriptor(esId, streamPriority, dependsOnEsId, url, decConfigDescr, slConfigDescr, subDescriptors){
	var urlFlag = typeof url === "string" ? 1 : 0,
		streamDependenceFlag = dependsOnEsId != null ? 1 : 0,
		size = 3,
		offset = 2,
		i, n, descr;
	
	size += streamDependenceFlag ? 2 : 0;
	size += urlFlag ? (url.length + 1) : 0;
	size += decConfigDescr.length;
	size += slConfigDescr.length;
	for(i = 0, n = subDescriptors.length; i < n; ++i) size += subDescriptors[i].length;
	descr = createBaseDescriptor(size, 0x03);
	putUi16(descr, esId, offset);
	offset += 2;
	descr[offset++] = (streamDependenceFlag << 7) | (urlFlag << 6) | streamPriority;
	if(streamDependenceFlag) {
		putUi16(descr, dependsOnEsId, offset);
		offset += 2;
	}
	if(urlFlag) {
		descr[offset++] = url.length;
		putStr(descr, url, offset);
		offset += url.length;
	}
	descr.set(decConfigDescr, offset);
	offset += decConfigDescr.length;
	descr.set(slConfigDescr, offset);
	offset += slConfigDescr.length;
	for(i = 0; i < n; ++i) {
		descr.set(subDescriptors[i], offset);
		offset += subDescriptors[i].length;
	}
	return descr;
}

/**
 * Create a decode config descriptor.
 * @param {number} objectTypeIndication refer http://www.mp4ra.org/object.html
 * @param {number} streamType
 * @param {number} upStream
 * @param {number} bufferSizeDB
 * @param {number} maxBitrate
 * @param {number} avgBitrate
 * @param {Array} subDescriptors
 * @return {Uint8Array}
 */
function createDecodeConfigDescriptor(objectTypeIndication, streamType, upStream, bufferSizeDB, maxBitrate, avgBitrate, subDescriptors){
	var size = 13,
		offset = 15,
		descriptor, i, n;
	subDescriptors = subDescriptors || [];
	
	for(i = 0, n = subDescriptors.length; i < n; ++i) size += subDescriptors[i].length;
	console.log("descr :"+ size);
	descriptor = createBaseDescriptor(size, 0x04);
	descriptor[2] = objectTypeIndication;
	descriptor[3] = (streamType << 2) | (upStream << 1) | 1;
	putUi24(descriptor, bufferSizeDB, 4);
	putUi32(descriptor, maxBitrate, 7);
	putUi32(descriptor, avgBitrate, 11);
	for(i = 0; i < n; ++i) {
		descriptor.set(subDescriptors[i], offset);
		offset += subDescriptors[i].length;
	}
	return descriptor
}

/**
 * Create a decoder specific infomation.
 * @param {string} str
 * @return {Uint8Array}
 */
function createDecoderSpecificInfo(str){
	var descr = createBaseDescriptor(str.length, 0x05);
	putStr(descr, str, 2);
	return descr;
}

/**
 * Create a SL_ConfigDescriptor.
 * TODO mada tukuttenaiyo
 * @param {number} predefined
 * @return {Uint8Array}
 */
function createSLConfigDescriptor(predefined){
	var descr = createBaseDescriptor(1, 0x06);
	descr[2] = predefined;
	return descr;
}

/**
 * Create a track header box (tkhd).
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} trackId
 * @param {number} duration
 * @param {boolean} isVisual
 * @return {Uint8Array}
 */
function createTkhdBox(creationTime, modificationTime, trackId, duration, isVisual){
	var box = createFullBox(92, "tkhd", 0, 1);
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
}

/**
 * Create a media header box (mdhd).
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} timeScale
 * @param {number} duration
 * @return {Uint8Array}
 */
function createMdhdBox(creationTime, modificationTime, timeScale, duration){
	var box = createFullBox(32, "mdhd", 0, 0);
	putUi32(box, creationTime, 12);
	putUi32(box, modificationTime, 16);
	putUi32(box, timeScale, 20);
	putUi32(box, duration, 24);
	putUi16(box, 0x55C4, 28);
	return box;
}

/**
 * Create a handler box (hdlr).
 * @param {string} handlerType
 * @param {string} name
 * @return {Uint8Array}
 */
function createHdlrBox(handlerType, name){
	var box = createFullBox(12 + 4 + 4 + 12 + name.length + 1, "hdlr", 0, 0);
	putStr(box, handlerType, 16);
	putStr(box, name, 32);
	return box;
}

/**
 * Concat boxes
 * @param {...Uint8Array} boxes
 * @return {Uint8Array}
 */
function concatBoxes(boxes){
	var args = Array.prototype.slice.call(arguments, 1),
		type = arguments[0],
		size = 8,
		offset = 8,
		i, n, box;
	
	for(i = 0, n = args.length; i < n; ++i) size += args[i].length;
	box = createBox(size, type);
	for(i = 0; i < n; ++i) {
		box.set(args[i], offset);
		offset += args[i].length;
	}
	return box;
}

/**
 * Create a data entry url box (url ).
 * @param {string} location
 * @param {number} flags
 * @return {Uint8Array}
 */
function createUrlBox(location, flags){
	flags = typeof flags === "undefined" ? 1 : flags;
	var len = typeof location === "string" ? location.length + 1 : 0;
	var box = createFullBox(12 + len, "url ", 0, flags);
	len && putUi16(box, location, 12);
	return box;
}

/**
 * Create a data entry urn box (urn ).
 * @param {string} name
 * @param {string} location
 * @return {Uint8Array}
 */
function createUrnBox(name, location){
	return createUrlBox(name + "\x00" + location, 0);
}

/**
 * Create a data reference box (dref).
 * @return {Uint8Array}
 */
function createDrefBox(){
	var args = Array.prototype.slice.call(arguments, 0),
		size = 16,
		offset = 16,
		i, n, box;
	
	for(i = 0, n = args.length; i < n; ++i) size += args[i].length;
	box = createFullBox(size, "dref", 0, 0);
	putUi32(box, 12, n);
	for(i = 0; i < n; ++i) {
		box.set(args[i], offset);
		offset += args[i].length;
	}
	return box;
}

/**
 * Create a sample size box (stsz).
 * @param {number} sampleSize
 * @param {Array} sampleSizeArr
 * @return {Uint8Array}
 */
function createStszBox(sampleSize, sampleSizeArr){
	var box = createFullBox(12 + 8 + (sampleSizeArr.length * 4), "stsz", 0, 0),
		i, n;
	
	putUi32(box, sampleSize, 12);
	putUi32(box, sampleSizeArr.length, 16);
	if(!sampleSize) {
		for(i = 0, n = sampleSizeArr.length; i < n; ++i) {
			putUi32(box, sampleSizeArr[i], i * 4 + 20);
		}
	}
	return box;
}

/**
 * Create a moview header box (mvhd).
 * @param {number} creationTime
 * @param {number} modificationTime
 * @param {number} timeScale
 * @param {number} duration
 * @param {number} nextTrackId
 * @return {Uint8Array}
 */
function createMvhdBox(creationTime, modificationTime, timeScale, duration, nextTrackId){
	var box = createFullBox(108, "mvhd", 0, 0);
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
}

/**
 * Create a initial object descriptor box (iods).
 * @param {number} odProfile
 * @param {number} sceneProfile
 * @param {number} audioProfile
 * @param {number} visualProfile
 * @param {number} graphicsProfile
 * @return {Uint8Array}
 */
function createIodsBox(odProfile, sceneProfile, audioProfile, visualProfile, graphicsProfile){
	var box = createFullBox(21, "iods", 0, 0);
	putUi16(box, 0x1007, 12); //?
	putUi16(box, 0x004F, 14);
	box[16] = odProfile;
	box[17] = sceneProfile;
	box[18] = audioProfile;
	box[19] = visualProfile;
	box[20] = graphicsProfile;
	return box;
}

/**
 * @param {number} objectDescrId
 * @param {number} includeInlineProfileLevelFlag
 * @param {string} url
 * @param {number} odProfile
 * @param {number} sceneProfile
 * @param {number} audioProfile
 * @param {number} visualProfile
 * @param {number} graphicsProfile
 * @param {Array} subDescrs
 * @param {Array} extDescrs
 * @return {Uint8Array}
 */
function createInitialObjectDescriptor(objectDescrId, includeInlineProfileLevelFlag, url, odProfile, sceneProfile, audioProfile, visualProfile, graphicsProfile, subDescrs, extDescrs){
	var urlFlag = typeof url === "string" ? 1 : 0,
		size = 2, offset, descr, i, n;
	
	subDescrs = subDescrs != null ? [] : isType(subDescrs, Array) ? subDescr : [subDescr];
	extDescrs = extDescrs != null ? [] : isType(extDescrs, Array) ? extDescr : [extDescr];
	size += urlFlag ? url.length + 1 : 0;
	offset = 4;
	for(i = 0, n = extDescrs.length; i < n; ++i) size += extDescrs[i].length;
	if(urlFlag) {
		descr = createBaseDescriptor(size, 0x10);
		descr[offset++] = url.length;
		putStr(descr, url, offset);
		offset += url.length;
	} else {
		for(i = 0, n = subDescrs.length; i < n; ++i) size += subDescrs[i].length;
		descr = createBaseDescriptor(size, 0x10);
		descr[offset++] = odProfile;
		descr[offset++] = sceneProfile;
		descr[offset++] = audioProfile;
		descr[offset++] = visualProfile;
		descr[offset++] = graphicsProfile;
		for(i = 0; i < n; ++i) {
			descr.set(subDescrs[i], offset);
			offset += subDescrs[i].length;
		}
	}
	putUi16(descr, (objectDescrId << 6) | (urlFlag << 5) | (includeInlineProfileLevelFlag << 4) | 0xF, 2);
	for(i = 0, n = extDescrs.length; i < n; ++i) {
		descr.set(extDescrs[i], offset);
		offset += extDescrs[i].length;
	}
	return descr;
}

/**
 * Create a data infomation box (dinf).
 * @param {...Uint8Array} args
 * @return {Uint8Array}
 */
function createDinfBox(){
	var args = Array.prototype.slice.call(arguments, 0),
		size = 16,
		offset = 16,
		i, n, dref, dinf;
	
	for(i = 0, n = args.length; i < n; ++i) size += args[i].length;
	dref = createFullBox(size, "dref", 0, 0);
	putUi32(dref, n, 12);
	for(i = 0; i < n; ++i) {
		dref.set(args[i], offset);
		offset += args[i].length;
	}
	dinf = createBox(size + 8, "dinf");
	dinf.set(dref, 8);
	return dinf;
}

/**
 * Create a sample description box (stsd).
 * @param {...Uint8Array} sampleEntries
 * @return {Uint8Array}
 */
function createStsdBox(sampleEntries){
	var args = Array.prototype.slice.call(arguments, 0),
		size = 16,
		offset = 16,
		i, n, box;
	
	for(i = 0, n = args.length; i < n; ++i) size += args[i].length;
	box = createFullBox(size, "stsd", 0, 0);
	putUi32(box, n, 12);
	for(i = 0; i < n; ++i) {
		box.set(args[i], offset);
		offset += args[i].length;
	}
	return box;
}

/**
 * Create a time to sample box (stts).
 * @param {Array} entries
 * @return {Uint8Array}
 */
function createSttsBox(entries){
	var size = 16 + entries.length * 8,
		box = createFullBox(size, "stts", 0, 0),
		offset = 16,
		i, n;
	
	putUi32(box, entries.length, 12);
	for(i = 0, n = entries.length; i < n; ++i) {
		putUi32(box, entries[i].count, offset);
		putUi32(box, entries[i].duration, offset + 4);
		offset += 8;
	}
	return box;
}

/**
 * Create a sample to chunk box (stsc).
 * @param {number} sampleCount
 * @param {number} samplesPerChunk
 * @return {Uint8Array}
 */
function createStscBox(sampleCount, samplesPerChunk){
	var box = createFullBox(40, "stsc", 0, 0);
	putUi32(box, 2, 12);
	putUi32(box, 1, 16);
	putUi32(box, samplesPerChunk, 20);
	putUi32(box, 1, 24);
	putUi32(box, ~~(sampleCount / samplesPerChunk) + 1, 28);
	putUi32(box, sampleCount % samplesPerChunk, 32);
	putUi32(box, 1, 36);
	return box;
}

/**
 * Create a chunk offset box (stco).
 * @param {number} samplesPerChunk
 * @param {Array} sampleSizes
 * @param {number} dataStart
 * @return {Uint8Array}
 */
function createStcoBox(samplesPerChunk, sampleSizes, dataStart){
	var n = ~~(sampleSizes.length / samplesPerChunk) + 1,
		box = createFullBox(16 + n * 4, "stco", 0, 0),
		offset = dataStart,
		i, j;
	
	putUi32(box, n, 12);
	for(i = 0; i < n; ++i) {
		putUi32(box, offset, i * 4 + 16);
		for(j = 0; j < samplesPerChunk; ++j) {
			offset += sampleSizes[i * 4 + j];
		}
	}
	return box;
}

/**
 * Create a free box (free).
 * @param {string} str
 * @return {Uint8Array}
 */
function createFreeBox(str){
	var box = createFullBox(8 + str.length + 1, "free");
	putStr(box, str, 8);
	return box;
}

/**
 * Create a file type box (ftyp).
 * @param {string} main
 * @param {...string} other 
 * @return {Uint8Array}
 */
function createFtypBox(main, other){
	var args = Array.prototype.slice.call(arguments, 0),
		box = createBox(args.length * 4 + 16, "ftyp"),
		offset = 16,
		i, n;
	
	putStr(box, main, 8);
	for(i = 0, n = args.length; i < n; ++i) {
		putStr(box, args[i], offset);
		offset += 4;
	}
	return box;
}

Mp4.aacToMp4 = aacToM4a;
Mp4.load = loadFileBuffer;

return Mp4;

})();
