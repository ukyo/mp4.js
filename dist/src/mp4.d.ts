import { IBox } from "./interface.box";
export declare var parse: (bytes: Uint8Array) => IBox[];
export declare var extractAudio: (bytes: Uint8Array) => Uint8Array;
export declare var extractRawAudio: (bytes: Uint8Array) => {
    type: string;
    data: Uint8Array;
};
export declare var aacToM4a: (bytes: Uint8Array) => Uint8Array;
