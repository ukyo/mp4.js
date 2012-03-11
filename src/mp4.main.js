/**
 * mp4.main.js Copyright 2012 - Syu Kato <ukyo.web@gmail.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function(window){

var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.BlobBuilder,
	getUi16 = this.utils.getUi16,
	getUi24 = this.utils.getUi24,
	getUi32 = this.utils.getUi32,
	putUi16 = this.utils.putUi16,
	getStr = this.utils.getStr,
	isType = this.utils.isType,
	concatByteArrays = this.utils.concatByteArrays
	self = this,
	
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
				i, n = getUi32(bytes, offset += 12);
				
			for(i = 0; i < n; ++i){
				ret.body.push({
					compositionOffset: getUi32(bytes, offset += 4),
					sampleCount: getUi32(bytes, offset += 4)
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
				type: getBoxType(bytes, offset + 16)
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
				creationTime: getUi32(bytes, offset + 12),
				modificationTime: getUi32(bytes, offset + 16),
				timeScale: getUi32(bytes, offset + 20),
				duration: getUi32(bytes, offset + 24),
				languageCode: getUi32(bytes, offset + 28)
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
				i, n = getUi32(bytes, offset += 12);
			
			for(i = 0; i < n; ++i){
				ret.body.push(getUi32(bytes, offset += 4));
			}
			return ret;
		},
		stdp: function(bytes, offset, size){},
		stsc: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getUi32(bytes, offset += 12);
			
			for(i = 0; i < n; ++i){
				ret.body.push({
					firstChunk: getUi32(bytes, offset += 4),
					samplesPerChunk: getUi32(bytes, offset += 4),
					sampleDescriptionIndex: getUi32(bytes, offset += 4)
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
				entryCount: getUi32(bytes, offset + 12),
				sampleCount: getUi32(bytes, offset + 16),
				sampleDelta: getUi32(bytes, offset + 20)
			}
		},
		styp: getBox,
		stsz: function(bytes, offset, size){
			var ret = {size: size, body: []},
				i, n = getUi32(bytes, offset += 16);
			
			for(i = 0; i < n; ++i){
				ret.body.push(getUi32(bytes, offset += 4));
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
				dataReferenceIndex: getUi32(bytes, offset += 12),
				channels: getUi16(bytes, offset += 12),
				bitPerSample: getUi16(bytes, offset += 2),
				sampleRate: getUi32(bytes, offset += 4),
				esds: {
					objectTypeIndication: bytes[offset += 25],
					bufferSizeDB: getUi16(bytes, offset += 3),
					maxBitrate: getUi32(bytes, offset += 2),
					avgBitrate: getUi32(bytes, offset += 4)
				}
			}
		}
	},
	SAMPLERATE_TABLE = [
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




/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @param {number} size
 * @return {Object}
 */
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


/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {string}
 */
function getBoxType(bytes, offset){
	return getStr(bytes, 4, offset);
}


/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {Object}
 */
function getBoxInfo(bytes, offset){
	return {
		size: getUi32(bytes, offset),
		type: getBoxType(bytes, offset + 4)
	}
}


/**
 * Mp4 Parser
 * 
 * @constructor
 * @param {ArrayBuffer|Uint8Array} buffer
 */
this.Mp4 = function(buffer){
	this.bytes = isType(buffer, ArrayBuffer) ? new Uint8Array(buffer) : buffer;
	this.cache = {};
};


this.Mp4.prototype = {
	/**
	 * @return {Object}
	 */
	parse: function(){
		if(this.cache.tree) return this.cache.tree;
		return this.cache.tree = getBox(this.bytes, -8, this.bytes.length);
	},
	
	/**
	 * @return {ArrayBuffer}
	 */
	extractAACAsArrayBuffer: function(){
		var tree = this.parse(),
			tracks = tree.moov.trak,
			audioTrack, mp4a, sampleToChunkEntries, sampleSizeEntries, chunkEntries,
			i, j, k, n, m, l, fileSize, idx,result,
			resultOffset = 0,
			offset = 0,
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
		
		result = new Uint8Array(sampleSizeEntries.length * 7 + sampleSizeEntries.reduce(function(a, b){return a + b}));
		
		aacHeader[0] = 0xFF;
		aacHeader[1] = 0xF9;
		aacHeader[2] = 0x40 | (SAMPLERATE_TABLE.indexOf(mp4a.sampleRate) << 2) | (mp4a.channels >> 2);
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
					result.set(this.bytes.subarray(offset, offset += sampleSizeEntries[idx]), resultOffset);
					resultOffset += sampleSizeEntries[idx];
				}
			}
		}
		return result.buffer;
	},
	
	extractAACAsBlob: function(){
		var bb = new BlobBuilder();
		bb.append(this.extractAACAsArrayBuffer());
		return bb.getBlob("audio/aac");
	}
};


/**
 * Convert a row aac file to a m4a file.
 * 
 * @param {ArrayBuffer} buffer
 * @return {ArrayBuffer}
 */
this.aacToM4a = function(buffer){
	var bytes = new Uint8Array(buffer),
		offset = 0,
		count = 0,
		sampleSizes = [],
		sampleOffsets = [],
		currentTime = Date.now(),
		dataSize, chunkIndex, samplesPerChunk,
		dataOffset, mdatOffset, stcoOffset,
		mp4a, slConfigDescr, decConfigDescr, esDescr, decSpecificInfo, arr,
		initialObjectDescr,
		esds, i, j,
		ftyp, stts, stsc, stsz, stco, stsd, stbl, dinf,
		smhd, minf, mdhd, hdlr, mdia, tkhd, iods, mdat,
		free, mvhd, trak,
		adts = {};
	
	function getFrameLength(offset) {
		return ((bytes[offset + 3] & 0x3) << 11) | (bytes[offset + 4] << 3) | (bytes[offset + 5] >> 5);
	}
	
	//aac header
	adts.id = (bytes[1] & 0x8) >> 3;
	adts.profile = bytes[2] >> 6;
	adts.sampleRate = SAMPLERATE_TABLE[(bytes[2] & 0x3C) >> 2];
	adts.channelConf = ((bytes[2] & 1) << 2) | (bytes[3] >> 6);
	adts.original = bytes[3] & 0x20;
	adts.bufferFullness = ((bytes[5] & 0x1F) << 6) | (bytes[6] >> 2);
	
	//count aac samples
	while(offset < bytes.length) {
		sampleOffsets[count] = offset;
		sampleSizes[count++] = getFrameLength(offset) - 7;//last number is aac header size.
		offset += getFrameLength(offset);
	}
	samplesPerChunk = count;
	
	initialObjectDescr = self.descr.createInitialObjectDescriptor(0x01, 0x00, null, 0xFF, 0xFF, 0x29, 0xFF, 0xFF);
	//aac header info?
	arr = new Uint8Array(2);
	putUi16(arr, 0x1000 | (SAMPLERATE_TABLE.indexOf(adts.sampleRate) << 7) | (adts.channelConf << 3), 0);
	decSpecificInfo = self.descr.createDecoderSpecificInfo(arr);
	decConfigDescr = self.descr.createDecodeConfigDescriptor(0x40, 0x05, 0, 0, 0, 0, [decSpecificInfo]);
	slConfigDescr = self.descr.createSLConfigDescriptor(2);
	esDescr = self.descr.createESDescriptor(0, 0, null, null, decConfigDescr, slConfigDescr, []);
	esds = self.box.createEsdsBox(esDescr);
	mp4a = self.box.createMp4aBox(1, adts.sampleRate, esds);
	
	ftyp = self.box.createFtypBox("M4A ", "isom", "mp42");
	stts = self.box.createSttsBox([{count: count, duration: 1024}]);
	stsc = self.box.createStscBox({firstChunk: 1, samplesPerChunk: samplesPerChunk, samplesDescriptionIndex: 1});
	stsz = self.box.createStszBox(0, sampleSizes);
	stsd = self.box.createStsdBox(mp4a);
	dinf = self.box.createDinfBox(self.box.createUrlBox(null, 1));
	smhd = self.box.createBox(16, "smhd");
	mdhd = self.box.createMdhdBox(currentTime, currentTime, adts.sampleRate, count * 1024);
	hdlr = self.box.createHdlrBox("soun", "mp4.js Audio Handler");
	tkhd = self.box.createTkhdBox(currentTime, currentTime, 1, ~~(count * 1024 * 600 / adts.sampleRate));
	iods = self.box.createIodsBox(initialObjectDescr);
	mvhd = self.box.createMvhdBox(currentTime, currentTime, 600, ~~(count * 1024 * 600 / adts.sampleRate), 2);
	
	dataSize = sampleSizes.reduce(function(a, b){return a + b});
	dataStart =
		ftyp.length + stts.length + stsc.length + stsz.length +
		stsd.length + dinf.length + smhd.length + mdhd.length +
		hdlr.length + tkhd.length + iods.length + mvhd.length;
	dataStart += 8 * 6;
	dataStart += (~~(sampleSizes.length / samplesPerChunk)) * 4 + 16;
	stco = self.box.createStcoBox([dataStart]);
	
	stbl = self.box.concatBoxes("stbl", stsd, stts, stsc, stsz, stco);
	minf = self.box.concatBoxes("minf", smhd, dinf, stbl);
	mdia = self.box.concatBoxes("mdia", mdhd, hdlr, minf);
	trak = self.box.concatBoxes("trak", tkhd, mdia);
	moov = self.box.concatBoxes("moov", mvhd, iods, trak);
	
	mdat = self.box.createBox(dataSize + 8, "mdat");
	dataOffset = 0;
	mdatOffset = 8;
	for(i = 0; i < count; ++i) {
		dataOffset = sampleOffsets[i];
		mdat.set(bytes.subarray(dataOffset + 7, dataOffset + 7 + sampleSizes[i]), mdatOffset);
		mdatOffset += sampleSizes[i];
	}
	
	free = self.box.createFreeBox("Produced with mp4.js " + self.version);
	
	return concatByteArrays(ftyp, moov, mdat, free).buffer;
};

}).call(this.mp4js, this);
