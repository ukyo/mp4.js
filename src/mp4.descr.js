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
 * Create a ES_Descriptor.
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
		descr, arr;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescrs : [subDescrs];
	size += streamDependenceFlag ? 2 : 0;
	size += urlFlag ? (url.length + 1) : 0;
	size += decConfigDescr.length;
	size += slConfigDescr.length;
	arr = concatByteArrays(subDescrs);
	size += arr.length;
	descr = self.createBaseDescriptor(size, 0x03);
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
	descr.set(arr, offset);
	return descr;
};

/**
 * Create a decode config descriptor.
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
	var descr, arr;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescrs : [subDescrs];
	arr = concatByteArrays(subDescrs);
	descr = self.createBaseDescriptor(arr.length + 13, 0x04);
	descr[2] = objectTypeIndication;
	descr[3] = (streamType << 2) | (upStream << 1) | 1;
	putUi24(descr, bufferSizeDB, 4);
	putUi32(descr, maxBitrate, 7);
	putUi32(descr, avgBitrate, 11);
	descr.set(arr, 15);
	return descr
};

/**
 * Create a decoder specific infomation.
 * @param {Uint8Array} arr
 * @return {Uint8Array}
 */
this.createDecoderSpecificInfo = function(arr){
	var descr = self.createBaseDescriptor(arr.length, 0x05);
	descr.set(arr, 2);
	return descr;
};

/**
 * Create a SL_ConfigDescriptor.
 * TODO mada tukuttenaiyo
 * @param {number} predefined
 * @return {Uint8Array}
 */
this.createSLConfigDescriptor = function(predefined){
	var descr = self.createBaseDescriptor(1, 0x06);
	descr[2] = predefined;
	return descr;
};

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
this.createInitialObjectDescriptor = function(objectDescrId, includeInlineProfileLevelFlag, url, odProfile, sceneProfile, audioProfile, visualProfile, graphicsProfile, subDescrs, extDescrs){
	var urlFlag = typeof url === "string" ? 1 : 0,
		size = 2, offset = 4, descr, subArr, extArr;
	
	subDescrs = subDescrs == null ? [] : isType(subDescrs, Array) ? subDescr : [subDescr];
	extDescrs = extDescrs == null ? [] : isType(extDescrs, Array) ? extDescr : [extDescr];
	size += urlFlag ? url.length + 1 : 5;
	extArr = concatByteArrays(extDescrs);
	size += extArr.length;
	if(urlFlag) {
		descr = self.createBaseDescriptor(size, 0x10);
		descr[offset++] = url.length;
		putStr(descr, url, offset);
		offset += url.length;
	} else {
		subArr = concatByteArrays(subDescrs);
		size += subArr.length;
		descr = self.createBaseDescriptor(size, 0x10);
		descr[offset++] = odProfile;
		descr[offset++] = sceneProfile;
		descr[offset++] = audioProfile;
		descr[offset++] = visualProfile;
		descr[offset++] = graphicsProfile;
		descr.set(subArr, offset);
		offset += subArr.length;
	}
	putUi16(descr, (objectDescrId << 6) | (urlFlag << 5) | (includeInlineProfileLevelFlag << 4) | 0xF, 2);
	descr.set(extArr, offset);
	return descr;
};

}).call((function(mp4js){
	mp4js = mp4js || {};
	mp4js.descr = mp4js.descr || {};
	return mp4js.descr;
})(this.mp4js), this, this.mp4js.utils);
