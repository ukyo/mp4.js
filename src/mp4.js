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
	};

Blob.prototype.slice = Blob.prototype.webkitSlice || Blob.prototype.mozSlice || Blob.prototype.slice;

function Mp4(data){
	var self = this,
		bb = new BlobBuilder();
	
	this.complete = false;
	this.cache = {};
	
	if(isType(data, ArrayBuffer)){
		this.data = data;
		bb.append(data);
		this.blob = bb.getBlob();
		this.cache.parse = this.parse();
	} else if(isType(data, String)){
		loadFileBuffer(data, function(bytes, offset, size){
			self.data = bytes;
			bb.append(bytes);
			self.blob = bb.getBlob();
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
			i, j, k, n, m, l, fileSize, idx,
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
					bb.append(aacHeader.buffer);
					
					//AAC body.
					bb.append(this.blob.slice(offset, offset += sampleSizeEntries[idx]));
				}
			}
		}
		
		return bb.getBlob('audio/aac');
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
 * @param {ArrayBuffer|Blob} data
 * @param {function} callback
 */
function aacToM4a(data, callback){
	if(isType(data, Blob)) {
		var fr = new FileReader();
		fr.onload = function(){
			_aacToM4a(this.result, callback);
		};
		fr.readAsArrayBuffer(data);
	} else if(isType(data, ArrayBuffer)){
		_aacToM4a(data, callback);
	}
}

/**
 * @param {ArrayBuffer} data
 * @param {function} callback
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
function _aacToM4a(data, callback){
	var ui8a = new Uint8Array(data),
		offset = 0,
		count = 0,
		sampleSizes = [],
		sampleOffsets = [],
		result,
		currentTime = Date.now(),
		dataSize, chunk,
		dataOffset, mdatOffset, stcoOffset,
		dataBuilder = new BlobBuilder(),
		i, j,
		
		ftyp, stts, stsc, stsz, stco, stsd, stbl, dinf,
		smhd, minf, mdhd, hdlr, mdia, tkhd, iods, mdat,
		free, mvhd, trak,
		
		//aac header
		adts = {};
	
	//build ftyp
	ftyp = new Uint8Array([
		0, 0, 0, 0x1C, 0x66, 0x74, 0x79, 0x70,
		0x4D, 0x34, 0x42, 0x20, 0, 0, 0, 0,
		0x69, 0x73, 0x6F, 0x6D, 0x4D, 0x34, 0x41, 0x20,
		0x6D, 0x70, 0x34, 0x32
	]);
	
	function getFrameLength(offset) {
		return ((ui8a[offset + 3] & 0x3) << 11) | (ui8a[offset + 4] << 3) | (ui8a[offset + 5] >> 5);
	}
	
	function putUi32BE(ui8a, x, offset) {
		ui8a[offset + 3] = x & 0xFF;
		ui8a[offset + 2] = (x >> 8) & 0xFF;
		ui8a[offset + 1] = (x >> 16) & 0xFF;
		ui8a[offset] = (x >> 24);
	}
	
	function putStr(ui8a, s, offset) {
		for(var i = offset, end = i + s.length; i < end; ++i) {
			ui8a[i] = s.charCodeAt(i);
		}
	}
	
	//aac header
	adts.id = (ui8a[1] & 0x8) >> 3;
	adts.profile = ui8a[2] >> 6;
	adts.sampleRate = sampleRateTable[(ui8a[2] & 0x3C) >> 2];
	adts.channelConf = ((ui8a[2] & 1) << 2) | (ui8a[3] >> 6);
	adts.original = ui8a[3] & 0x20;
	adts.bufferFullness = ((ui8a[5] & 0x1F) << 6) | (ui8a[6] >> 2);
	
	//count aac samples
	while(offset < ui8a.length) {
		sampleOffsets[count] = offset;
		sampleSizes[count++] = getFrameLength(offset) - 7;//last number is aac header size.
		offset += getFrameLength(offset);
	}
	console.log('number of aac samples: ' + count);
	
	//build time to sample box(stts)
	stts = new Uint8Array(24);
	stts[3] = 24;
	putStr(stts, "stts", 4);
	stts[15] = 1;
	putUi32BE(stts, count, 16);
	putUi32BE(stts, 1024, 20);
	console.log("stts");
	
	//build sample to chunk box(stsc)
	//4 + 4 + 8 + 12 * 2
	stsc = new Uint8Array(40);
	stsc[3] = 40;
	putStr(stsc, "stsc", 4);
	stsc[15] = 2;
	putUi32BE(stsc, 1, 16); //first chunk
	putUi32BE(stsc, 16, 20); //sample per chunk
	putUi32BE(stsc, 1, 24); //sample description index?
	chunk = (count >> 4) + 1;
	putUi32BE(stsc, chunk, 28); //number of chunk
	putUi32BE(stsc, count % 16, 32);
	putUi32BE(stsc, 1, 36);
	console.log("stsc");
	
	//build sample size box(stsz)
	stsz = new Uint8Array(count * 4 + 20);
	putUi32BE(stsz, count * 4 + 20, 0);
	putStr(stsz, "stsz", 4);
	putUi32BE(stsz, count, 16);
	for(i = 0; i < count; ++i) {
		putUi32BE(stsz, sampleSizes[i], i * 4 + 20);
	}
	console.log("stsz");
	
	//build chunk offset box(stco)
	//4 + 4 + 8 + entryCount * 4
	stco = new Uint8Array(16 + chunk * 4);
	putUi32BE(stco, 16 + chunk * 4, 0);
	putStr(stco, "stco", 4);
	putUi32BE(stco, chunk, 12); //number of chunk
	stcoOffset = 16 + 540 + stco.length + stsz.length; //start offset of aac data
	for(i = 0; i < chunk; ++i) {
		putUi32BE(stco, stcoOffset, i * 4 + 16);
		for(j = 0; j < 16; ++j) {
			stcoOffset += sampleSizes[i * 16 + j];
		}
	}
	console.log("stco");
	
	//build sample description box(stsd)
	stsd = new Uint8Array(54);
	putUi32BE(stsd, 54, 0);
	putStr(stsd, "stsd", 4);
	stsd[15] = 1; //?
	//mpeg audio sample description box
	putUi32BE(stsd, 38, 16);
	putStr(stsd, "mp4a", 20);
	stsd[31] = 1; //?
	stsd[41] = adts.channelConf; //channels;
	stsd[43] = 16; //bit per sample
	stsd[48] = adts.sampleRate >> 2;
	stsd[49] = adts.sampleRate & 0xFF;
	console.log("stsd");
	
	//merge stsd, stts, stsc, stsz, stco to sample table box(stbl)
	stbl = new Uint8Array(
		stsd.length +
		stts.length +
		stsc.length +
		stsz.length +
		stco.length + 8
	);
	putUi32BE(stbl, stbl.length, 0);
	putStr(stbl, "stbl", 4);
	stbl.set(stsd, 8);
	stbl.set(stts, stsd.length + 8);
	stbl.set(stsc, stsd.length + stts.length + 8);
	stbl.set(stsz, stsd.length + stts.length + stsc.length + 8);
	stbl.set(stco, stsd.length + stts.length + stsc.length + stsz.length + 8);
	console.log("stbl");
	
	//build data information box(dinf)
	dinf = new Uint8Array(36);
	putUi32BE(dinf, 36, 0);
	putStr(dinf, "dinf", 4);
	//dref
	putUi32BE(dinf, 28, 8);
	putStr(dinf, "dref", 12);
	dinf[19] = 1;
	dinf[23] = 12;
	putStr(dinf, "url ", 24);
	dinf[35] = 1;
	console.log("dinf");
	
	//build sound media header box(smhd)
	smhd = new Uint8Array(16);
	putUi32BE(smhd, 16, 0);
	putStr(smhd, "smhd", 4);
	console.log("smhd");
	
	//merge smhd, dinf, stbl to media information box(minf)
	minf = new Uint8Array(
		smhd.length +
		dinf.length +
		stbl.length + 8
	);
	putUi32BE(minf, minf.length, 0);
	putStr(minf, "minf", 4);
	minf.set(smhd, 8);
	minf.set(dinf, smhd.length + 8);
	minf.set(stbl, smhd.length + dinf.length + 8);
	console.log("minf");
	
	//build media header box(mdhd)
	mdhd = new Uint8Array(32);
	putUi32BE(mdhd, 32, 0);
	putStr(mdhd, "mdhd", 4);
	putUi32BE(mdhd, currentTime, 12); //creation time
	putUi32BE(mdhd, currentTime, 16); //modification time
	putUi32BE(mdhd, adts.sampleRate, 20); //sample rate
	putUi32BE(mdhd, count * 1024, 24) //duration
	putUi32BE(mdhd, 0x55C40000, 28);
	console.log("mdhd");
	
	//build handler box(hdlr)
	hdlr = new Uint8Array(41);
	putStr(hdlr, "hdlr", 4);
	putStr(hdlr, "soun", 12);
	putStr(hdlr, "JS Audio Handler", 24);
	console.log("hdlr");
	
	//merge mdhd, soun, minf to mdia
	mdia = new Uint8Array(
		mdhd.length +
		hdlr.length +
		minf.length + 8
	);
	putUi32BE(mdia, mdia.length, 0);
	putStr(mdia, "mdia", 4);
	mdia.set(mdhd, 8);
	mdia.set(hdlr, mdhd.length + 8);
	mdia.set(minf, mdhd.length + hdlr.length + 8);
	console.log("mdia");
	
	//build track header box(tkhd)
	tkhd = new Uint8Array(92);
	putUi32BE(tkhd, 92, 0);
	putStr(tkhd, "tkhd", 4);
	tkhd[7] = 1; //flag?
	putUi32BE(tkhd, currentTime, 8); //creation time
	putUi32BE(tkhd, currentTime, 12); //modification time
	putUi32BE(tkhd, 1, 16); //track id
	putUi32BE(tkhd, ~~(count * 1024 * 600 / adts.sampleRate), 24); //duration
	tkhd[40] = 1; //?
	tkhd[45] = 1; //?
	tkhd[61] = 1; //?
	tkhd[76] = 0x40; //?
	console.log("tkhd");
	
	//build object descriptor box(iods)
	iods = new Uint8Array(21);
	putUi32BE(iods, 21, 0);
	putStr(iods, "iods", 4);
	putUi32BE(iods, 0x1007004F, 12); //?
	iods[16] = 0xFF;
	iods[17] = 0xFF;
	iods[18] = 0x29;
	iods[19] = 0xFF;
	iods[20] = 0xFF;
	console.log("iods");
	
	//merge tkhd, mdia to trak
	trak = new Uint8Array(
		tkhd.length +
		mdia.length + 8
	);
	putUi32BE(trak, trak.length, 0);
	putStr(trak, "trak", 4);
	trak.set(tkhd, 8);
	trak.set(mdia, tkhd.length + 8);
	console.log("trak");
	
	//build movie header box(mvhd)
	mvhd = new Uint8Array(108);
	putUi32BE(mvhd, 108, 0);
	putStr(mvhd, "mvhd", 4);
	putUi32BE(mvhd, currentTime, 12); //creation time
	putUi32BE(mvhd, currentTime, 16); //modification time
	putUi32BE(mvhd, 600, 20); //time scale
	putUi32BE(mvhd, ~~(count * 1024 * 600 / adts.sampleRate), 24); //duration
	mvhd[29] = 1;
	mvhd[32] = 1;
	mvhd[45] = 1;
	mvhd[61] = 1;
	mvhd[76] = 0x40;
	mvhd[107] = 2; //?
	console.log("mvhd");
	
	//merge mvhd, iods, trak to moov
	moov = new Uint8Array(
		mvhd.length +
		iods.length +
		trak.length + 8
	);
	putUi32BE(moov, moov.length, 0);
	putStr(moov, "moov", 4);
	moov.set(mvhd, 8);
	moov.set(iods, mvhd.length + 8);
	moov.set(trak, mvhd.length + iods.length + 8);
	console.log("moov");
	
	//build media data box(mdat)
	dataSize = 0;
	for(i = 0, n = sampleSizes.length; i < n; ++i) {
		dataSize += sampleSizes[i];
	}
	console.log(dataSize + 8);
	mdat = new Uint8Array(dataSize+8);
	console.log("hoge");
	putUi32BE(mdat, mdat.length, 0);
	putStr(mdat, "mdat", 4);
	dataOffset = 0;
	mdatOffset = 8;
	for(var i = 0; i < count; ++i) {
		dataOffset += sampleOffsets[i];
		mdat.set(ui8a.subarray(dataOffset + 7, dataOffset + sampleSizes[i] + 7), mdatOffset);
		mdatOffset += sampleSizes[i];
	}
	console.log("mdat");
	
	//build free space box(free)
	free = new Uint8Array(33);
	putUi32BE(free, 33, 4);
	putStr(free, "free", 4);
	putStr(free, "m4a produced with mp4.js", 8);
	console.log("free");
	
	//merge ftyp, moov, mdat, free to result file
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
	
	callback(result);
}

Mp4.aacToMp4 = aacToM4a;
Mp4.load = loadFileBuffer;

return Mp4;

})();
