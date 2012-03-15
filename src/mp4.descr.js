/**
 * Copyright 2012 - Syu Kato <ukyo.web@gmail.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * http://www.apache.org/licenses/LICENSE-2.0
 */

var mp4 = mp4 || {};
mp4.descr = mp4.descr || {};

(function(window, utils){

var self = this,
	putUi16 = utils.putUi16,
	putUi24 = utils.putUi24,
	putUi32 = utils.putUi32,
	putStr = utils.putStr,
	isType = utils.isType,
	concatByteArrays = utils.concatByteArrays;


/**
 * Create a base descriptor.
 * @param {number} size
 * @param {number} tag
 * @return {Uint8Array}
 */
this.createBaseDescriptor = function(size, tag){
	var descr = new Uint8Array(size + 2);
	descr[0] = tag;
	descr[1] = size;
	return descr;
};

/**
 * Get a Descriptor Info.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.getDescrInfo = function(bytes){
	return {
		tag: bytes[0],
		size: bytes[1]
	};
};

/**
 * Create a ES_Descriptor.
 * 
 * aligned(8) class ES_Descriptor extends BaseDescriptor: bit(8) tag=ES_DescrTag {
 *  bit(16)      ES_ID;
 *  bit(1)       streamDependenceFlag;
 *  const bit(1) reserved=1;
 *  bit(5)       streamPriority;
 *  if (streamDependenceFlag) bit(16) dependsOn_ES_ID;
 *  if (URL_Flag) bit(8) URLstring
 *  ExtensionDescriptor     extDescr[0 .. 255];
 *  LanguageDescriptor      langConfigDescr[0 .. 1];
 *  DecoderConfigDescriptor decConfigDescr;
 *  SLConfigDescriptor      slConfigDescr;
 *  IPI_DescPointer         ipiPtr[0 .. 1];
 * }
 * 
 * @param {number} esId
 * @param {number} streamPriority
 * @param {number} dependsOnEsId
 * @param {string} url
 * @param {Uint8Array} decConfigDescr
 * @param {Uint8Array} slConfigDescr
 * @param {Array} subDescrs
 * @return {Uint8Array}
 */
this.createESDescriptor = function(esId, streamPriority, dependsOnEsId, url, decConfigDescr, slConfigDescr, subDescrs){
	var urlFlag = typeof url === "string" ? 1 : 0,
		streamDependenceFlag = dependsOnEsId != null ? 1 : 0,
		size = 3,
		offset = 2,
		descr, arr, view;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescrs : [subDescrs];
	size += streamDependenceFlag ? 2 : 0;
	size += urlFlag ? (url.length + 1) : 0;
	size += decConfigDescr.length;
	size += slConfigDescr.length;
	arr = concatByteArrays(subDescrs);
	size += arr.length;
	descr = self.createBaseDescriptor(size, 0x03);
	view = new DataView(descr.buffer);
	view.setUint16(offset, esId);
	offset += 2;
	descr[offset++] = (streamDependenceFlag << 7) | (urlFlag << 6) | streamPriority;
	if(streamDependenceFlag) {
		view.setUint16(offset, dependsOnEsId);
		offset += 2;
	}
	if(urlFlag) {
		descr[offset++] = url.length;
		view.setString(offset, url);
		offset += url.length;
	}
	descr.set(decConfigDescr, offset);
	offset += decConfigDescr.length;
	descr.set(slConfigDescr, offset);
	offset += slConfigDescr.length;
	descr.set(arr, offset);
	return descr;
};

/**
 * Create a DecodeConfigDescriptor.
 * 
 * aligned(8) class DecodeConfigDescriptor extends BaseDescriptor: bit(8) tag=DecoderConfigDescrTag {
 *  bit(8) objectTypeIndication;
 *  bit(6) streamType;
 *  bit(1) upStream;
 *  const bit(1) reserved=1;
 *  bit(24) bufferSizeDB;
 *  bit(32) maxBitrate;
 *  bit(32) avgBitrate;
 *  DecoderSpecificInfo decSpecificInfo[0 .. 1];
 *  profileLevelIndicationIndexDescriptor profileLevelIndicationIndexDescr[0 .. 255];
 * }
 * 
 * @param {number} objectTypeIndication refer http://www.mp4ra.org/object.html
 * @param {number} streamType
 * @param {number} upStream
 * @param {number} bufferSizeDB max size of sample
 * @param {number} maxBitrate
 * @param {number} avgBitrate
 * @param {Array} subDescrs
 * @return {Uint8Array}
 */
this.createDecodeConfigDescriptor = function(objectTypeIndication, streamType, upStream, bufferSizeDB, maxBitrate, avgBitrate, subDescrs){
	var descr, arr, view;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescrs : [subDescrs];
	arr = concatByteArrays(subDescrs);
	descr = self.createBaseDescriptor(arr.length + 13, 0x04);
	view = new DataView(descr.buffer);
	descr[2] = objectTypeIndication;
	descr[3] = (streamType << 2) | (upStream << 1) | 1;
	view.setUint24(4, bufferSizeDB);
	view.setUint32(7, maxBitrate);
	view.setUint32(11, avgBitrate);
	descr.set(arr, 15);
	return descr
};

/**
 * Parse a DecodeConfigDescriptor.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseDecodeConfigDescriptor = function(bytes){
	var view = DataView.create(bytes.subarray(2)),
		descrInfo = self.getDescrInfo(bytes);
	return {
		descrInfo: descrInfo,
		objectTypeIndication: view.getUint8(0),
		streamType: view.getUint8(1) >> 2,
		upStream: (view.getUint8(1) % 0x2) >> 1,
		bufferSizeDB: view.getUint24(2),
		maxBitrate: view.getUint32(5),
		avgBitrate: view.getUint32(9)
	};
};

/**
 * Create a DecoderSpecificInfo.
 * @param {Uint8Array} arr
 * @return {Uint8Array}
 */
this.createDecoderSpecificInfo = function(arr){
	var descr = self.createBaseDescriptor(arr.length, 0x05);
	descr.set(arr, 2);
	return descr;
};

/**
 * Parse a DecoderSpecificInfo.
 * @param {Uint8Array} bytes
 * @return {Object}
 */
this.parseDecoderSpecificInfo = function(bytes){
	var view = DataView.create(bytes.subarray(2)),
		descrInfo = self.getDescrInfo(bytes);
	return {
		descrInfo: descrInfo,
		dataString: view.getString(0, descrInfo.size)
	};
};

/**
 * Create a SL_ConfigDescriptor.
 * 
 * class SLConfigDescriptor extends BaseDescriptor : bit(8) tag=SLConfigDescrTag {
 *  bit(8) predefined;
 *  if (predefined==0) {
 *   bit(1) useAccessUnitStartFlag;
 *   bit(1) useAccessUnitEndFlag;
 *   bit(1) useRandomAccessPointFlag;
 *   bit(1) hasRandomAccessUnitsOnlyFlag;
 *   bit(1) usePaddingFlag;
 *   bit(1) useTimeStampsFlag;
 *   bit(1) useIdleFlag;
 *   bit(1) durationFlag;
 *   bit(32) timeStampResolution;
 *   bit(32) OCRResolution;
 *   bit(8) timeStampLength; // must be ≤ 64
 *   bit(8) OCRLength; // must be ≤ 64
 *   bit(8) AU_Length; // must be ≤ 32
 *   bit(8) instantBitrateLength;
 *   bit(4) degradationPriorityLength;
 *   bit(5) AU_seqNumLength; // must be ≤ 16
 *   bit(5) packetSeqNumLength; // must be ≤ 16
 *   bit(2) reserved=0b11;
 *  }
 *  if (durationFlag) {
 *   bit(32) timeScale;
 *   bit(16) accessUnitDuration;
 *   bit(16) compositionUnitDuration;
 *  }
 *  if (!useTimeStampsFlag) {
 *   bit(timeStampLength) startDecodingTimeStamp;
 *   bit(timeStampLength) startCompositionTimeStamp;
 *  }
 * }
 * 
 * TODO mada tukuttenaiyo
 * @param {number} predefined
 * @return {Uint8Array}
 */
this.createSLConfigDescriptor = function(predefined){
	var descr = self.createBaseDescriptor(1, 0x06);
	descr[2] = predefined;
	return descr;
};

this.parseSLConfigDescriptor = function(){
	
};

/**
 * Create a InitialObjectDescriptor.
 * 
 * class InitialObjectDescriptor extends BaseDiscriptor: bit(8) tag=InitialObjectDescrTag {
 *  bit(10) ObjectDescriptorID;
 *  bit(1) URL_Flag;
 *  bit(1) includeInlineProfileLevelFlag;
 *  const bit(4) reserved=0b1111;
 *  if (URL_Flag) {
 * 	 bit(8) URLLength;
 *   bit(8) URLstring[URLLength];
 *  } else {
 * 	 bit(8) ODProfileLevelIndication;
 *   bit(8) sceneProfileLevelIndication;
 *   bit(8) audioProfileIndication;
 *   bit(8) graphicsProfileLevelIndication;
 *   ES_Descriptor esDescr[1 .. 255];
 *   OCI_Descriptor ociDescr[0 .. 255];
 *   IPMP_DescriptorPointer inmpDescrPtr[0 .. 255];
 *   IPMP_Descriptor ipmpDescr[0 .. 255];
 *   IPMP_ToolListDescriptor toolListDescr[0 .. 1];
 *  }
 *  ExtensionDescriptor extDescr[0 .. 255];
 * }
 * 
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
this.createInitialObjectDescriptor = function(objectDescrId, includeInlineProfileLevelFlag, url, odProfile, sceneProfile, audioProfile, visualProfile, graphicsProfile, subDescrs, extDescrs){
	var urlFlag = typeof url === "string" ? 1 : 0,
		size = 2, offset = 4, descr, view, subArr, extArr;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescr : [subDescr];
	extDescrs = extDescrs == null ? [] : isType(extDescrs, Array) ? extDescr : [extDescr];
	size += urlFlag ? url.length + 1 : 5;
	extArr = concatByteArrays(extDescrs);
	size += extArr.length;
	if(urlFlag) {
		descr = self.createBaseDescriptor(size, 0x10);
		view = new DataView(descr.buffer);
		descr[offset++] = url.length;
		view.setString(offset, url);
		offset += url.length;
	} else {
		subArr = concatByteArrays(subDescrs);
		size += subArr.length;
		descr = self.createBaseDescriptor(size, 0x10);
		view = new DataView(descr.buffer);
		descr[offset++] = odProfile;
		descr[offset++] = sceneProfile;
		descr[offset++] = audioProfile;
		descr[offset++] = visualProfile;
		descr[offset++] = graphicsProfile;
		descr.set(subArr, offset);
		offset += subArr.length;
	}
	view.setUint16(2, (objectDescrId << 6) | (urlFlag << 5) | (includeInlineProfileLevelFlag << 4) | 0xF);
	descr.set(extArr, offset);
	return descr;
};

this.parseInitialObjectDescriptor = function(){
	
};

}).call((function(mp4js){
	mp4js = mp4js || {};
	mp4js.descr = mp4js.descr || {};
	return mp4js.descr;
})(this.mp4js), this, this.mp4js.utils);
