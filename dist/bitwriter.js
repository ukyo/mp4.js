"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataview_1 = require("./dataview");
class BitWriter {
    constructor(littleEndian = false) {
        this.littleEndian = littleEndian;
        this.bitOffset = 0;
        this.bytes = new Uint8Array(2);
        this.view = new dataview_1.DataView2(this.bytes);
    }
    get data() {
        const byteOffset = this.byteOffset;
        if (byteOffset > this.bytes.length) {
            const bytes = new Uint8Array(byteOffset);
            bytes.set(this.bytes);
            return bytes;
        }
        else {
            return this.bytes.subarray(0, byteOffset);
        }
    }
    get byteOffset() {
        return this.bitOffset >>> 3;
    }
    skipBits(n) {
        this.bitOffset += n;
    }
    skipBytes(n) {
        this.skipBits(n * 8);
    }
    writeBits(n, bitLength) {
        this.expandBuffer(bitLength);
        const needBytes = Math.ceil(((this.bitOffset % 8) + bitLength) / 8);
        let tmp;
        switch (needBytes) {
            case 1:
                tmp = this.view.getUint8(this.byteOffset);
                break;
            case 2:
                tmp = this.view.getUint16(this.byteOffset);
                break;
            case 3:
                tmp = this.view.getUint24(this.byteOffset);
                break;
            case 4:
                tmp = this.view.getUint32(this.byteOffset);
                break;
        }
        tmp |= n << (needBytes * 8 - ((this.bitOffset % 8) + bitLength));
        switch (needBytes) {
            case 1:
                this.view.setUint8(this.byteOffset, tmp);
                break;
            case 2:
                this.view.setUint16(this.byteOffset, tmp);
                break;
            case 3:
                this.view.setUint24(this.byteOffset, tmp);
                break;
            case 4:
                this.view.setUint32(this.byteOffset, tmp);
                break;
        }
        this.skipBits(bitLength);
    }
    writeBytes(bytes) {
        this.expandBuffer(bytes.length * 8);
        this.bytes.set(bytes, this.byteOffset);
        this.skipBytes(bytes.length);
    }
    writeUint8(n) {
        this.expandBuffer(8);
        this.view.setUint8(this.byteOffset, n);
        this.skipBytes(1);
    }
    writeInt8(n) {
        this.expandBuffer(8);
        this.view.setInt8(this.byteOffset, n);
        this.skipBytes(1);
    }
    writeUint16(n) {
        this.expandBuffer(16);
        this.view.setUint16(this.byteOffset, n, this.littleEndian);
        this.skipBytes(2);
    }
    writeInt16(n) {
        this.expandBuffer(16);
        this.view.setInt16(this.byteOffset, n, this.littleEndian);
        this.skipBytes(2);
    }
    writeUint24(n) {
        this.expandBuffer(24);
        this.view.setUint24(this.byteOffset, n, this.littleEndian);
        this.skipBytes(3);
    }
    writeInt24(n) {
        this.expandBuffer(24);
        this.view.setInt24(this.byteOffset, n, this.littleEndian);
        this.skipBytes(3);
    }
    writeUint32(n) {
        this.expandBuffer(32);
        this.view.setUint32(this.byteOffset, n, this.littleEndian);
        this.skipBytes(4);
    }
    writeInt32(n) {
        this.expandBuffer(32);
        this.view.setInt32(this.byteOffset, n, this.littleEndian);
        this.skipBytes(4);
    }
    writeFloat32(n) {
        this.expandBuffer(32);
        this.view.setFloat32(this.byteOffset, n, this.littleEndian);
        this.skipBytes(4);
    }
    writeFloat64(n) {
        this.expandBuffer(64);
        this.view.setFloat64(this.byteOffset, n, this.littleEndian);
        this.skipBytes(8);
    }
    writeString(s) {
        this.expandBuffer(s.length * 8);
        this.view.setString(this.byteOffset, s);
        this.skipBytes(s.length);
    }
    writeStringNullTerminated(s) {
        this.writeString(s + "\0");
    }
    writeUTF8String(s) {
        var UTF8Bytes = dataview_1.DataView2.stringToUTF8Bytes(s);
        this.expandBuffer(UTF8Bytes.length * 8);
        this.writeBytes(UTF8Bytes);
    }
    writeUTF8StringNullTerminated(s) {
        this.writeUTF8String(s + "\0");
    }
    expandBuffer(expandBitWidth) {
        let bitLength = this.bytes.length * 8;
        const originalBitLength = bitLength;
        while (bitLength < this.bitOffset + expandBitWidth)
            bitLength *= 2;
        const bytes = new Uint8Array(Math.ceil(bitLength / 8));
        bytes.set(this.bytes);
        this.bytes = bytes;
        this.view = new dataview_1.DataView2(bytes);
    }
}
exports.BitWriter = BitWriter;
