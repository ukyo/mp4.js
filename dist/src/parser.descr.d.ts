import { BaseParser } from "./parser";
import { IDescriptor, IDecoderSpecificInfo, IProfileLevelIndicationIndexDescriptor, IDecoderConfigDescriptor, ISLConfigDescriptor, IESDescriptor, IInitialObjectDescriptor } from "./interface.descr";
export declare var getDescriptorInfo: (bytes: Uint8Array, offset?: number) => IDescriptor;
export declare class DescriptorParserMixin extends BaseParser {
    readDescriptor(): IDescriptor;
}
export declare class DescriptorParser extends DescriptorParserMixin {
    parse(): IDescriptor;
}
export declare class DecoderSpecificInfoParser extends DescriptorParser {
    parse(): IDecoderSpecificInfo;
}
export declare class ProfileLevelINdicationIndexDescriptor extends DescriptorParser {
    parse(): IProfileLevelIndicationIndexDescriptor;
}
export declare class DecoderConfigDescriptorParser extends DescriptorParser {
    static OBJECT_TYPE_INDICATION: {
        MP3: number;
        AAC: number;
    };
    parse(): IDecoderConfigDescriptor;
}
export declare class SLConfigDescriptorParser extends DescriptorParser {
    parse(): ISLConfigDescriptor;
}
export declare class IPIDescriptorPointerParser extends DescriptorParser {
}
export declare class IPIdentificationDataSetParser extends DescriptorParser {
}
export declare class IPMPDescriptorPointerParser extends DescriptorParser {
}
export declare class LanguageDescriptorParser extends DescriptorParser {
}
export declare class QosDescriptorParser extends DescriptorParser {
}
export declare class ExtensionDescriptorParser extends DescriptorParser {
}
export declare class ESDescriptorParser extends DescriptorParser {
    parse(): IESDescriptor;
}
export declare class InitialObjectDescriptorParser extends DescriptorParser {
    parse(): IInitialObjectDescriptor;
}
export declare var createDescriptorParser: (bytes: Uint8Array, tag: number) => DescriptorParser;
