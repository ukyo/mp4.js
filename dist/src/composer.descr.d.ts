import { BaseBuilder } from "./composer";
import { IDecoderConfigDescriptor, ISLConfigDescriptor, IDecoderSpecificInfo, IESDescriptor, IDescriptor } from "./interface.descr";
export declare class DescriptorBuilderMixin extends BaseBuilder {
    writeDescriptor(descr: any): void;
}
export declare class DescriptorBuilder extends DescriptorBuilderMixin {
    constructor();
    build(): Uint8Array;
    private writeBodyLength;
}
export declare class DecoderConfigDescriptorBuilder extends DescriptorBuilder {
    constructor(descr: IDecoderConfigDescriptor);
}
export declare class SLConfigDescriptorBuilder extends DescriptorBuilder {
    constructor(descr: ISLConfigDescriptor);
}
export declare class DecoderSpecificInfoBuilder extends DescriptorBuilder {
    constructor(descr: IDecoderSpecificInfo);
}
export declare class ESDescriptorBuilder extends DescriptorBuilder {
    constructor(descr: IESDescriptor);
}
export declare var createDescriptorBuilder: (descr: IDescriptor) => DescriptorBuilder;
