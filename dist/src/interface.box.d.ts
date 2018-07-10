import { IESDescriptor, IIPMPDescriptorPointer } from "./interface.descr";
export interface IBox {
    byteLength?: number;
    type?: string;
    bytes?: Uint8Array;
}
export interface IFullBox extends IBox {
    version?: number;
    flags?: number;
}
export interface IFileTypeBox extends IBox {
    majorBrand: string;
    minorVersion: number;
    compatibleBrands: string[];
}
export interface IBoxList extends IBox {
    boxes: IBox[];
}
export interface IMovieBox extends IBoxList {
}
export interface IMediaDataBox extends IBox {
    data: Uint8Array;
}
export interface IMovieHeaderBox extends IFullBox {
    creationTime: number;
    modificationTime: number;
    timescale: number;
    duration: number;
    rate: number;
    volume: number;
    matrix: number[];
    nextTrackID: number;
}
export interface ITrackBox extends IBoxList {
}
export interface ITrackHeaderBox extends IFullBox {
    creationTime: number;
    modificationTime: number;
    trackID: number;
    duration: number;
    layer: number;
    alternateGroup: number;
    volume: number;
    matrix: number[];
    width: number;
    height: number;
}
export interface ITrackReferenceBox extends IBoxList {
}
export interface ITrackReferenceTypeBox extends IBox {
    trackIDs: number[];
}
export interface IMediaBox extends IBoxList {
}
export interface IMediaHeaderBox extends IFullBox {
    creationTime: number;
    modificationTime: number;
    timescale: number;
    duration: number;
    language: string;
}
export interface IHandlerBox extends IFullBox {
    handlerType: string;
    name: string;
}
export interface IMediaInformationBox extends IBoxList {
}
export interface IVideoMediaHeaderBox extends IFullBox {
    graphicsmode: number;
    opcolor: number[];
}
export interface ISoundMediaHeaderBox extends IFullBox {
    balance: number;
}
export interface IHintMediaHeaderBox extends IFullBox {
    maxPDUsize: number;
    avgPDUsize: number;
    maxbitrate: number;
    avgbitrate: number;
}
export interface INullMediaHeaderBox extends IFullBox {
}
export interface IDataInformationBox extends IBoxList {
}
export interface IDataEntryBox extends IFullBox {
}
export interface IDataEntryUrlBox extends IDataEntryBox {
    location: string;
}
export interface IDataEntryUrnBox extends IDataEntryUrlBox {
    name: string;
}
export interface IDataReferenceBox extends IFullBox {
    entryCount: number;
    entries: IDataEntryBox[];
}
export interface ISampleTableBox extends IBoxList {
}
export interface ITimeToSampleBox extends IFullBox {
    entryCount: number;
    entries: {
        sampleCount: number;
        sampleDelta: number;
    }[];
}
export interface ICompositionOffsetBox extends IFullBox {
    entryCount: number;
    entries: {
        sampleCount: number;
        sampleOffset: number;
    }[];
}
export interface ISampleEntry extends IBox {
    dataReferenceIndex: number;
}
export interface IHintSampleEntry extends ISampleEntry {
    data: Uint8Array;
}
export interface IVisualSampleEntry extends ISampleEntry {
    width: number;
    height: number;
    frameCount: number;
    horizresolution: number;
    vertresolution: number;
    compressorname: string;
    depth: number;
}
export interface IAudioSampleEntry extends ISampleEntry {
    channelCount: number;
    sampleSize: number;
    sampleRate: number;
}
export interface IESDBox extends IFullBox {
    esDescr: IESDescriptor;
}
export interface IMpegSampleEntry extends ISampleEntry {
    esBox: IESDBox;
}
export interface IMP4VisualSampleEntry extends IVisualSampleEntry {
    esBox: IESDBox;
}
export interface IMP4AudioSampleEntry extends IAudioSampleEntry {
    esBox: IESDBox;
}
export interface ISampleDescriptionBox extends IFullBox, IBoxList {
    entryCount: number;
}
export interface ISampleSizeBox extends IFullBox {
    sampleSize: number;
    sampleCount: number;
    sampleSizes: number[];
}
export interface ICompactSampleSizeBox extends IFullBox {
    fieldSize: number;
    sampleCount: number[];
}
export interface ISampleToChunkBox extends IFullBox {
    entryCount: number;
    entries: {
        firstChunk: number;
        samplesPerChunk: number;
        sampleDescriptionIndex: number;
    }[];
}
export interface IChunkOffsetBox extends IFullBox {
    entryCount: number;
    chunkOffsets: number[];
}
export interface ISyncSampleBox extends IFullBox {
    entryCount: number;
    sampleNumbers: number[];
}
export interface IShadowSyncSampleBox extends IFullBox {
    entryCount: number;
    entries: {
        shadowedSampleNumber: number;
        syncSampleNumber: number;
    }[];
}
export interface IDegradationPriorityBox extends IFullBox {
    priorities: number[];
}
export interface IPaddingBitsBox extends IFullBox {
    sampleCount: number;
    samples: {
        pad1: number;
        pad2: number;
    }[];
}
export interface IFreeSpaceBox extends IBox {
    data: Uint8Array;
}
export interface IEditBox extends IBox {
}
export interface IEditListBox extends IFullBox {
    entryCount: number;
    entries: {
        sagmentDuration: number;
        mediaTime: number;
        mediaRateInteger: number;
    }[];
}
export interface IUserDataBox extends IBox {
}
export interface ICopyrightBox extends IFullBox {
    language: string;
    notice: string;
}
export interface IMovieExtendsBox extends IBox {
}
export interface IMovieExtendsHeaderBox extends IFullBox {
    fragmentDuration: number;
}
export interface ITrackExtendsBox extends IFullBox {
    trackID: number;
    defaultSampleDescriptionIndex: number;
    defaultSampleDuration: number;
    defaultSampleSize: number;
    defaultSampleFlags: number;
}
export interface IMovieFragmentBox extends IBoxList {
}
export interface IMovieFragmentHeaderBox extends IFullBox {
    sequenceNumber: number;
}
export interface ITrackFragmentBox extends IBoxList {
}
export interface ITrackFragmentHeaderBox extends IFullBox {
    trackID: number;
    baseDataOffset?: Uint8Array;
    sampleDescriptionIndex?: number;
    defaultSampleDuration?: number;
    defaultSampleSize?: number;
    defaultSampleFlags?: number;
}
export interface ITrackRunBox extends IFullBox {
    sampleCount: number;
    dataOffset?: number;
    firstSampleFlats?: number;
    samples?: {
        sampleDuration?: number;
        sampleSize?: number;
        sampleFlags?: number;
        sampleCompositionTimeOffset?: number;
    }[];
}
export interface IMovieFragmentRandomAccessBox extends IBoxList {
}
export interface ITrackFragmentRandomAccessBox extends IFullBox {
    trackID: number;
    lengthSizeOfTrafNum: number;
    lengthSizeOfTrunNum: number;
    lengthSizeOfSampleNum: number;
    numberOfEntry: number;
    entries: {
        time: number;
        moofOffset: number;
        trafNumber: number;
        trunNumber: number;
        sampleNumber: number;
    }[];
}
export interface IMovieFragmentRandomAccessOffsetBox extends IFullBox {
    size: number;
}
export interface ISampleDependencyTypeBox extends IFullBox {
    samples: {
        sampleDependsOn: number;
        sampleIsDependedOn: number;
        sampleHasRedundancy: number;
    }[];
}
export interface ISampleToGroupBox extends IFullBox {
    groupintType: number;
    entryCount: number;
    entries: {
        sampleCount: number;
        groupDescriptionIndex: number;
    }[];
}
export interface ISampleGroupDescriptionEntry extends IBox {
    handlerType: string;
}
export interface IVisualSampleGroupEntry extends ISampleGroupDescriptionEntry {
}
export interface IAudioSampleGroupEntry extends ISampleGroupDescriptionEntry {
}
export interface IHintSampleGroupEntry extends ISampleGroupDescriptionEntry {
}
export interface ISampleGroupDescriptionBox extends IFullBox {
    groupingType: number;
    entryCount: number;
    entries: ISampleGroupDescriptionEntry[];
}
export interface IVisualRollRecoveryEntry extends IVisualSampleGroupEntry {
    rollDistance: number;
}
export interface IAudioRollRecoveryEntry extends IAudioSampleGroupEntry {
    rollDistance: number;
}
export interface ISampleScaleBox extends IFullBox {
    constraintFlag: number;
    scaleMethod: number;
    displayCenterX: number;
    displayCenterY: number;
}
export interface ISubSampleInformationBox extends IFullBox {
    entryCount: number;
    entries: {
        sampleDelta: number;
        subsampleCount: number;
        samples: {
            subsampleSize: number;
            subsamplePriority: number;
            discardable: number;
        }[];
    }[];
}
export interface IProgressiveDownloadInfoBox extends IFullBox {
    entries: {
        rate: number;
        initialDelay: number;
    }[];
}
export interface IMetaBox extends IFullBox {
    theHandler: IHandlerBox;
    primaryResource?: IPrimaryItemBox;
    fileLocations?: IDataInformationBox;
    itemLocations?: IItemLocationBox;
    protections?: IItemProtectionBox;
    itemInfos?: IItemInfoBox;
    IPMPControl?: IIPMPControlBox;
    otherBoxes?: IBox[];
}
export interface IXMLBox extends IFullBox {
    xml: string;
}
export interface IBinaryXMLBox extends IFullBox {
    data: Uint8Array;
}
export interface IItemLocationBox extends IFullBox {
    offsetSize: number;
    lengthSize: number;
    baseOffsetSize: number;
    itemCount: number;
    items: {
        itemID: number;
        dataReferenceIndex: number;
        baseOffset: number;
        extentCount: number;
        extents: {
            extentOffset: number;
            extentLength: number;
        }[];
    }[];
}
export interface IPrimaryItemBox extends IFullBox {
    itemID: number;
}
export interface IItemProtectionBox extends IFullBox {
    protectionCount: number;
    protectionInformations: IProtectionSchemeInfoBox[];
}
export interface IItemInfoEntry extends IFullBox {
    itemID: number;
    itemProtectionIndex: number;
    itemName: string;
    contentType: string;
    contentEncoding?: string;
}
export interface IItemInfoBox extends IFullBox {
    entryCount: number;
    itemInfos: IItemInfoEntry[];
}
export interface IIPMPControlBox extends IFullBox {
}
export interface IProtectionSchemeInfoBox extends IBox {
    originalFormat: IOriginalFormatBox;
    IPMPDescriptors?: IIPMPInfoBox;
    schemeTypeBox?: any;
    info?: ISchemeInformationBox;
}
export interface IOriginalFormatBox extends IBox {
    dataFormat: string;
}
export interface IIPMPInfoBox extends IFullBox {
    ipmpDescrs: IIPMPDescriptorPointer[];
}
export interface ISchemeInformationBox extends IFullBox {
}
