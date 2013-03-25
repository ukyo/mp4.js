module mp4 {
  var toString = Object.prototype.toString;

  export class DataView2 {
    private view: DataView;
    private buffer: ArrayBuffer;
    private byteOffset: number;
    private byteLength: number;

    constructor(buffer: any, byteOffset?: number, byteLength?: number) {
      if (typeof buffer === 'number') {
        this.view = new DataView(new ArrayBuffer(buffer));
      } else {
        switch (toString.call(buffer)) {
          case '[object ArrayBuffer]':
            byteOffset = byteOffset || 0;
            byteLength = byteLength || buffer.byteLength;
            this.view = new DataView(buffer, byteOffset, byteLength);
            break;
          case '[object Uint8Array]':
          case '[object Uint8ClampedArray]':
          case '[object Int8Array]':
          case '[object Uint16Array]':
          case '[object Int16Array]':
          case '[object Uint32Array]':
          case '[object Int32Array]':
          case '[object Float32Array]':
          case '[object Float64Array]':
            byteOffset = byteOffset !== void 0 ? byteOffset : buffer.byteOffset;
            byteLength = byteLength !== void 0 ? byteLength : buffer.byteLength;
            this.view = new DataView(buffer.buffer, byteOffset, byteLength);
            break;
          default: throw new TypeError();
        }
      }

      this.buffer = this.view.buffer;
      this.byteOffset = this.view.byteOffset;
      this.byteLength = this.view.byteLength;
    }

    getUint8(byteOffset: number): number {
      return this.view.getUint8(byteOffset);
    }

    setUint8(byteOffset: number, value: number) {
      this.view.setUint8(byteOffset, value);
    }

    getInt8(byteOffset: number): number {
      return this.view.getInt8(byteOffset);
    }

    setInt8(byteOffset: number, value: number) {
      this.view.setInt8(byteOffset, value);
    }

    getUint16(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getUint16(byteOffset, littleEndian);
    }

    setUint16(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setUint16(byteOffset, value, littleEndian);
    }

    getInt16(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getInt16(byteOffset, littleEndian);
    }

    setInt16(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setInt16(byteOffset, value, littleEndian);
    }

    getUint32(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getUint32(byteOffset, littleEndian);
    }

    setUint32(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setUint32(byteOffset, value, littleEndian);
    }

    getInt32(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getInt32(byteOffset, littleEndian);
    }

    setInt32(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setInt32(byteOffset, value, littleEndian);
    }

    getFloat32(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getFloat32(byteOffset, littleEndian);
    }

    setFloat32(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setFloat32(byteOffset, value, littleEndian);
    }

    getFloat64(byteOffset: number, littleEndian: bool = false): number {
      return this.view.getFloat64(byteOffset, littleEndian);
    }

    setFloat64(byteOffset: number, value: number, littleEndian: bool = false) {
      this.view.setFloat64(byteOffset, value, littleEndian);
    }

    getString(byteOffset: number, byteLength: number): string {
      var bytes = new Uint8Array(this.buffer, this.byteOffset + byteOffset, byteLength);
      return String.fromCharCode.apply(null, bytes);
    }

    setString(byteOffset: number, s: string) {
      var bytes = new Uint8Array(this.buffer, this.byteOffset + byteOffset);
      var i = s.length;
      while(i) bytes[--i] = s.charCodeAt(i);
    }

    getUint24(byteOffset: number, littleEndian: bool = false) {
      var b = new Uint8Array(this.buffer, this.byteOffset + byteOffset);
      return littleEndian ? (b[0] | (b[1] << 8) | (b[2] << 16)) : (b[2] | (b[1] << 8) | (b[0] << 16));
    }

    setUint24(byteOffset: number, value: number, littleEndian: bool = false) {
      var b = new Uint8Array(this.buffer, this.byteOffset + byteOffset);
      if(littleEndian) {
        b[0] = value & 0xFF;
        b[1] = (value & 0xFF00) >> 8;
        b[2] = (value & 0xFF0000) >> 16;
      } else {
        b[2] = value & 0xFF;
        b[1] = (value & 0xFF00) >> 8;
        b[0] = (value & 0xFF0000) >> 16;
      }
    }

    getInt24(byteOffset: number, littleEndian: bool = false) {
      var v = this.getUint24(byteOffset, littleEndian);
      return v & 0x800000 ? v - 0x1000000 : v;
    }

    setInt24(byteOffset: number, value: number, littleEndian: bool = false) {
      this.setUint24(byteOffset, value, littleEndian);
    }
  }
}