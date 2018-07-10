export interface IDescriptor {
    tag?: number;
    byteLength?: number;
    headerLength?: number;
    bodyLength?: number;
    bytes?: Uint8Array;
}
export interface IESDescriptor extends IDescriptor {
    esID: number;
    streamDependenceFlag?: number;
    urlFlag?: number;
    ocrStreamFlag?: number;
    streamPriority?: number;
    dependsOnEsID?: number;
    urlLength?: number;
    urlString?: string;
    ocrEsID?: number;
    decConfigDescr?: IDecoderConfigDescriptor;
    slConfigDescr?: ISLConfigDescriptor;
    ipiPtr?: IIPIDescPointer;
    ipIDSs?: IIPIdentificationDataSet[];
    ipmpDescrPtrs?: IIPMPDescriptorPointer[];
    langDescrs?: ILanguageDescriptor[];
    qosDescr?: IQoSDescriptor;
    extDescrs?: IExtensionDescriptor[];
}
export interface IDecoderConfigDescriptor extends IDescriptor {
    objectTypeIndication: number;
    streamType: number;
    upStream: number;
    bufferSizeDB: number;
    maxBitrate: number;
    avgBitrate: number;
    decSpecificInfo: IDecoderSpecificInfo;
    profileLevelIndicationIndexDescrs?: IProfileLevelIndicationIndexDescriptor[];
}
export interface IDecoderSpecificInfo extends IDescriptor {
    data: Uint8Array;
}
export interface IProfileLevelIndicationIndexDescriptor extends IDescriptor {
    profileLevelIndicationIndex: number;
}
export interface IIPIDescPointer extends IDescriptor {
    ipiEsID: number;
}
export interface ISLConfigDescriptor extends IDescriptor {
    preDefined: number;
    useAccessUnitStartFlag?: number;
    useAccessUnitEndFlag?: number;
    useRandomAccessPointFlag?: number;
    hasRandomAccessUnitsOnlyFlag?: number;
    usePaddingFlag?: number;
    useTimeStampsFlag?: number;
    useIdleFlag?: number;
    durationFlag?: number;
    timeStampResolution?: number;
    ocrResolution?: number;
    timeStampLength?: number;
    ocrLength?: number;
    auLength?: number;
    instantBitrateLength?: number;
    degradationPriorityLength?: number;
    auSeqNumLength?: number;
    packetSeqNumLength?: number;
    timeScale?: number;
    accessUnitDuration?: number;
    compositionUnitDuration?: number;
    startDecodingTimeStamp?: number;
    startCompositionTimeStamp?: number;
}
export interface IIPMPDescriptorPointer extends IDescriptor {
}
export interface IIPIdentificationDataSet extends IDescriptor {
}
export interface ILanguageDescriptor extends IDescriptor {
}
export interface IQoSDescriptor extends IDescriptor {
    preDefined: number;
    qosQualifierCount?: number;
    qosQualifierTag?: number[];
    qosQualifierLength?: number[];
    qosQualifierData?: number[][];
}
export interface IExtensionDescriptor extends IDescriptor {
}
export interface IInitialObjectDescriptor extends IDescriptor {
    objectDescrID: number;
    urlFlag: number;
    includeInlineProfileLevelFlag: number;
    urlLength?: number;
    urlString?: string;
    odProfileLevelIndication?: number;
    sceneProfileLevelIndication?: number;
    audioProfileLevelIndication?: number;
    visualProfileLevelIndication?: number;
    graphicsProfileLevelIndication?: number;
    esDescrs: IESDescriptor[];
    ociDescrs?: IOCIDescriptor[];
    ipmpDescrPtrs?: IIPMPDescriptorPointer[];
    ipmpDescrs?: IIPMPDescriptor[];
    toolListDescr?: IIPMPToolListDescriptor;
    extDescrs?: IExtensionDescriptor[];
}
export interface IOCIDescriptor extends IDescriptor {
}
export interface IIPMPDescriptor extends IDescriptor {
}
export interface IIPMPToolListDescriptor extends IDescriptor {
}
