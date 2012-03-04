(function(window, Mp4){

var utils = {};

/**
 * @param {Object} obj
 * @param {Object} type
 * @return {boolean}
 */
utils.isType = function(obj, type){
	return obj != null ? obj.constructor == type : false;
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
utils.getUi16 = function(bytes, offset){
	return (bytes[offset] << 8) | (bytes[offset + 1]);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
utils.getUi24 = function(bytes, offset){
	return (bytes[offset + 1] << 16) | (bytes[offset] << 8) | (bytes[offset + 1]);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @return {number}
 */
utils.getUi32 = function(bytes, offset){
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
utils.getStr = function(bytes, len, offset){
	var a = [];
	for(var i = 0; i < len; ++i) a[a.length] = bytes[offset + i];
	return String.fromCharCode.apply(null, a);
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
utils.putUi16 = function(bytes, x, offset){
	bytes[offset + 1] = x & 0xFF;
	bytes[offset] = x >> 8;
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
utils.putUi24 = function(bytes, x, offset){
	bytes[offset + 2] = x & 0xFF;
	bytes[offset + 1] = (x >> 8) & 0xFF;
	bytes[offset] = x >> 16;
};

/**
 * @param {Uint8Array} bytes
 * @param {number} x
 * @param {number} offset
 */
utils.putUi32 = function(bytes, x, offset){
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
utils.putStr = function(bytes, s, offset){
	for(var i = 0, n = s.length; i < n; ++i) bytes[i + offset] = s.charCodeAt(i);
};

/**
 * @param {...(Uint8Array|int8Array)} byteArrays
 * @return {Uint8Array}
 */
utils.concatByteArrays = function(byteArrays){
	var byteArrays = utils.isType(byteArrays, Array) ? byteArrays : Array.prototype.slice.call(arguments, 0);
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

Mp4.utils = utils;

})(this, Mp4);