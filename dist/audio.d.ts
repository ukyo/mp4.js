export declare function createMp4DescriptorSpecificInfo(sampleRate: number, channels: number): Uint8Array;
export declare function extractAudio(bytes: Uint8Array): Uint8Array;
export declare function extractRawAudio(bytes: Uint8Array): {
    type: string;
    data: Uint8Array;
};
export declare function aacToM4a(bytes: Uint8Array): Uint8Array;
