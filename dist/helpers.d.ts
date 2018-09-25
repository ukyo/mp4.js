import { ITrackBox, IBox } from "./interface.box";
export declare function getChunks(bytes: Uint8Array, trackBox: ITrackBox): Uint8Array[];
export declare function concatBytes(bytess: Uint8Array[]): Uint8Array;
export declare function parse(bytes: Uint8Array): IBox[];
