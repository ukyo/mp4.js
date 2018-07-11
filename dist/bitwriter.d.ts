import { DataView2 } from "./dataview";
export declare class BitWriter {
    littleEndian: boolean;
    view: DataView2;
    bitOffset: number;
    bytes: Uint8Array;
    constructor(littleEndian?: boolean);
    readonly data: Uint8Array;
    readonly byteOffset: number;
    skipBits(n: number): void;
    skipBytes(n: number): void;
    writeBits(n: number, bitLength: number): void;
    writeBytes(bytes: Uint8Array): void;
    writeUint8(n: number): void;
    writeInt8(n: number): void;
    writeUint16(n: number): void;
    writeInt16(n: number): void;
    writeUint24(n: number): void;
    writeInt24(n: number): void;
    writeUint32(n: number): void;
    writeInt32(n: number): void;
    writeFloat32(n: number): void;
    writeFloat64(n: number): void;
    writeString(s: string): void;
    writeStringNullTerminated(s: string): void;
    writeUTF8String(s: string): void;
    writeUTF8StringNullTerminated(s: string): void;
    private expandBuffer;
}
