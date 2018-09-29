import { DescriptorBuilderMixin } from "./composer.descr";
import { IFullBox, IFileTypeBox, IMediaDataBox, IMovieHeaderBox, ITrackHeaderBox, ITrackReferenceTypeBox, IMediaHeaderBox, IHandlerBox, IVideoMediaHeaderBox, ISoundMediaHeaderBox, IHintMediaHeaderBox, IDataEntryUrlBox, IDataEntryUrnBox, IDataReferenceBox, ITimeToSampleBox, ICompositionOffsetBox, ISampleEntry, IHintSampleEntry, IVisualSampleEntry, IMP4VisualSampleEntry, IESDBox, IAudioSampleEntry, IMP4AudioSampleEntry, ISampleDescriptionBox, ISampleSizeBox, ISampleToChunkBox, IChunkOffsetBox, ISampleDependencyTypeBox } from "./interface.box";
export declare class BoxBuilder extends DescriptorBuilderMixin {
    constructor();
    build(): Uint8Array;
    writeBox(box: any): void;
}
export declare class FullBoxBuilder extends BoxBuilder {
    box: IFullBox;
    constructor(box: IFullBox);
}
export declare class BoxListBuilder extends BoxBuilder {
    constructor(boxes: any[]);
}
export declare class FileTypeBoxBuilder extends BoxBuilder {
    constructor(box: IFileTypeBox);
}
export declare class MovieBoxBuilder extends BoxListBuilder {
}
export declare class MediaDataBoxBuilder extends BoxBuilder {
    constructor(box: IMediaDataBox);
}
export declare class MovieHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: IMovieHeaderBox);
}
export declare class TrackBoxBuilder extends BoxListBuilder {
}
export declare class TrackHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: ITrackHeaderBox);
}
export declare class TrackReferenceBoxBuilder extends BoxListBuilder {
}
export declare class TrackReferenceTypeBoxBuilder extends BoxBuilder {
    constructor(box: ITrackReferenceTypeBox);
}
export declare class HintTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {
}
export declare class DescribeTrackReferenceTypeBoxBuilder extends TrackReferenceTypeBoxBuilder {
}
export declare class MediaBoxBuilder extends BoxListBuilder {
}
export declare class MediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: IMediaHeaderBox);
}
export declare class HandlerBoxBuilder extends FullBoxBuilder {
    constructor(box: IHandlerBox);
}
export declare class MediaInformationBoxBuilder extends BoxListBuilder {
}
export declare class VideoMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: IVideoMediaHeaderBox);
}
export declare class SoundMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: ISoundMediaHeaderBox);
}
export declare class HintMediaHeaderBoxBuilder extends FullBoxBuilder {
    constructor(box: IHintMediaHeaderBox);
}
export declare class NullMediaHeaderBoxBuilder extends FullBoxBuilder {
}
export declare class DataInformationBoxBuilder extends BoxListBuilder {
}
export declare class DataEntryUrlBoxBuilder extends FullBoxBuilder {
    constructor(box: IDataEntryUrlBox);
}
export declare class DataEntryUrnBoxBuilder extends FullBoxBuilder {
    constructor(box: IDataEntryUrnBox);
}
export declare class DataReferenceBoxBuilder extends FullBoxBuilder {
    constructor(box: IDataReferenceBox);
}
export declare class SampleTableBoxBuilder extends BoxListBuilder {
}
export declare class TimeToSampleBoxBuilder extends FullBoxBuilder {
    constructor(box: ITimeToSampleBox);
}
export declare class CompositionOffsetBoxBuilder extends FullBoxBuilder {
    constructor(box: ICompositionOffsetBox);
}
export declare class SampleEntryBuilder extends BoxBuilder {
    constructor(box: ISampleEntry);
}
export declare class HintSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box: IHintSampleEntry);
}
export declare class VisualSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box: IVisualSampleEntry);
}
export declare class MP4VisualSampleEntryBuilder extends VisualSampleEntryBuilder {
    constructor(box: IMP4VisualSampleEntry);
}
export declare class ESDBoxBuilder extends FullBoxBuilder {
    constructor(box: IESDBox);
}
export declare class AudioSampleEntryBuilder extends SampleEntryBuilder {
    constructor(box: IAudioSampleEntry);
}
export declare class MP4AudioSampleEntryBuilder extends AudioSampleEntryBuilder {
    constructor(box: IMP4AudioSampleEntry);
}
export declare class SampleDescriptionBoxBuilder extends FullBoxBuilder {
    constructor(box: ISampleDescriptionBox);
}
export declare class SampleSizeBoxBuilder extends FullBoxBuilder {
    constructor(box: ISampleSizeBox);
}
export declare class SampleToChunkBoxBuilder extends FullBoxBuilder {
    constructor(box: ISampleToChunkBox);
}
export declare class ChunkOffsetBoxBuilder extends FullBoxBuilder {
    constructor(box: IChunkOffsetBox);
}
export declare class ChunkOffset64BoxBuilder extends FullBoxBuilder {
    constructor(box: IChunkOffsetBox);
}
export declare class SampleDependencyTypeBoxBuilder extends FullBoxBuilder {
    constructor(box: ISampleDependencyTypeBox);
}
