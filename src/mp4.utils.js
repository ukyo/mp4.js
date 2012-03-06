/**
 * mp4.utils.js Copyright 2012 - Syu Kato <ukyo.web@gmail.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function(window){

var self = this;

/**
 * @param {Object} obj
 * @param {Object} type
 * @return {boolean}
 */
this.isType = function(obj, type){
	return obj != null ? obj.constructor == type : false;
};

/**
 * @param {string} url
 * @param {function} callback
 */
this.load = function(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'arraybuffer';
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4) {
			if(~~(xhr.status / 100) === 2 || xhr.status === 0) {
				callback.call(xhr, xhr.response);
			} else {
				throw 'Error: ' + xhr.status;
			}
		}
	};
	xhr.send();
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
this.getUi16 = function(bytes, offset){
	return (bytes[offset] << 8) | (bytes[offset + 1]);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
this.getUi24 = function(bytes, offset){
	return (bytes[offset + 1] << 16) | (bytes[offset] << 8) | (bytes[offset + 1]);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
this.getUi32 = function(bytes, offset){
	return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
};

/**
 * @param {Uint8Array} bytes
 * @param {number} len
 * @param {number} offset
 * @return {string}
 * 
 * ascii only!
 */
this.getStr = function(bytes, len, offset){
	var a = [];
	for(var i = 0; i < len; ++i) a[a.length] = bytes[offset + i];
	return String.fromCharCode.apply(null, a);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
this.putUi16 = function(bytes, x, offset){
	bytes[offset + 1] = x & 0xFF;
	bytes[offset] = x >> 8;
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
this.putUi24 = function(bytes, x, offset){
	bytes[offset + 2] = x & 0xFF;
	bytes[offset + 1] = (x >> 8) & 0xFF;
	bytes[offset] = x >> 16;
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
this.putUi32 = function(bytes, x, offset){
	bytes[offset + 3] = x & 0xFF;
	bytes[offset + 2] = (x >> 8) & 0xFF;
	bytes[offset + 1] = (x >> 16) & 0xFF;
	bytes[offset] = x >> 24;
};

/**
 * @param {Uint8Array} bytes
 * @param {string} s
 * @param {number} offset
 * 
 * ascii only!
 */
this.putStr = function(bytes, s, offset){
	for(var i = 0, n = s.length; i < n; ++i) bytes[i + offset] = s.charCodeAt(i);
};

/**
 * @param {...(Uint8Array|int8Array)} byteArrays
 * @return {Uint8Array}
 */
this.concatByteArrays = function(byteArrays){
	var byteArrays = self.isType(byteArrays, Array) ? byteArrays : Array.prototype.slice.call(arguments, 0),
		size = 0,
		offset = 0,
		i, n, ret;
	
	for(i = 0, n = byteArrays.length; i < n; ++i) size += byteArrays[i].length;
	ret = new Uint8Array(size);
	for(i = 0; i < n; ++i) {
		ret.set(byteArrays[i], offset);
		offset += byteArrays[i].length;
	}
	return ret;
};

}).call((function(mp4js){
	mp4js = mp4js || {};
	mp4js.utils = mp4js.utils || {};
	return mp4js.utils;
})(this.mp4js), this);