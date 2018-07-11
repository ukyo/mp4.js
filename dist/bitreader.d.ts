import { DataView2 } from "./dataview";
export declare class BitReader {
    bytes: Uint8Array;
    littleEndian: boolean;
    view: DataView2;
    bitOffset: number;
    constructor(bytes: Uint8Array, littleEndian?: boolean);
    readBits(n: number): number;
    readUint8(): number;
    readInt8(): number;
    readUint16(): number;
    readInt16(): number;
    readUint24(): number;
    readInt24(): number;
    readUint32(): number;
    readUint64(): number;
    readInt32(): number;
    readFloat32(): number;
    readFloat64(): number;
    readBytes(n: number): Uint8Array;
    readString(n?: number): string;
    readStringNullTerminated(): string;
    readUTF8StringNullTerminated(): string;
    skipBits(n: number): void;
    skipBytes(n: number): void;
    readonly byteOffset: number;
    eof(): boolean;
}
