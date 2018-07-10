import { IBox, IFullBox, IFileTypeBox, IBoxList, IMediaDataBox, IMovieHeaderBox, ITrackHeaderBox, ITrackReferenceTypeBox, IMediaHeaderBox, IHandlerBox, IVideoMediaHeaderBox, ISoundMediaHeaderBox, IHintMediaHeaderBox, IDataReferenceBox, IDataEntryUrlBox, IDataEntryUrnBox, ITimeToSampleBox, ICompositionOffsetBox, ISampleEntry, IHintSampleEntry, IVisualSampleEntry, IAudioSampleEntry, IESDBox, IMP4VisualSampleEntry, IMP4AudioSampleEntry, IMpegSampleEntry, ISampleDescriptionBox, ISampleSizeBox, ISampleToChunkBox, IChunkOffsetBox, ISyncSampleBox, IShadowSyncSampleBox, IDegradationPriorityBox, IPaddingBitsBox, IEditListBox, ICopyrightBox, IMovieExtendsHeaderBox, ITrackExtendsBox, IMovieFragmentHeaderBox, ITrackFragmentHeaderBox, ITrackRunBox, ITrackFragmentRandomAccessBox, IMovieFragmentRandomAccessOffsetBox, ISampleDependencyTypeBox, ISampleToGroupBox, ISampleGroupDescriptionBox, IVisualRollRecoveryEntry, IAudioRollRecoveryEntry, ISampleScaleBox, ISubSampleInformationBox, IProgressiveDownloadInfoBox, IMetaBox, IPrimaryItemBox, IItemLocationBox, IItemInfoBox, IItemProtectionBox, IXMLBox, IBinaryXMLBox, IProtectionSchemeInfoBox, IItemInfoEntry, IOriginalFormatBox, IIPMPInfoBox } from "./interface.box";
import { DescriptorParserMixin } from "./parser.descr";
export declare class BoxParserMixin extends DescriptorParserMixin {
    readBox(): IBox;
}
export declare class RootParser extends BoxParserMixin {
    parse(): IBox[];
}
export declare class BoxParser extends BoxParserMixin {
    byteLength: number;
    type: string;
    constructor(bytes: Uint8Array);
    parse(): IBox;
}
export declare class FullBoxParser extends BoxParser {
    version: number;
    flags: number;
    constructor(bytes: Uint8Array);
    parse(): IFullBox;
}
export declare class FileTypeBoxParser extends BoxParser {
    parse(): IFileTypeBox;
}
export declare class BoxListParser extends BoxParser {
    parse(): IBoxList;
}
export declare class MovieBoxParser extends BoxListParser {
}
export declare class MediaDataBoxParser extends BoxParser {
    parse(): IMediaDataBox;
}
export declare class MovieHeaderBoxParser extends FullBoxParser {
    parse(): IMovieHeaderBox;
}
export declare class TrackBoxParser extends BoxListParser {
}
export declare class TrackHeaderBoxParser extends FullBoxParser {
    parse(): ITrackHeaderBox;
}
export declare class TrackReferenceBox extends BoxListParser {
}
export declare class TrackReferenceTypeBox extends BoxParser {
    parse(): ITrackReferenceTypeBox;
}
export declare class HintTrackReferenceTypeBox extends TrackReferenceTypeBox {
}
export declare class DescribeTrackReferenceTypeBox extends TrackReferenceTypeBox {
}
export declare class MediaBoxParser extends BoxListParser {
}
export declare class MediaHeaderBoxParser extends FullBoxParser {
    parse(): IMediaHeaderBox;
}
export declare class HandlerBoxParser extends FullBoxParser {
    parse(): IHandlerBox;
}
export declare class MediaInformationBoxParser extends BoxListParser {
}
export declare class VideoMediaHeaderBoxParser extends FullBoxParser {
    parse(): IVideoMediaHeaderBox;
}
export declare class SoundMediaHeaderBoxParser extends FullBoxParser {
    parse(): ISoundMediaHeaderBox;
}
export declare class HintMediaHeaderBoxParser extends FullBoxParser {
    parse(): IHintMediaHeaderBox;
}
export declare class NullMediaHeaderBoxParser extends FullBoxParser {
}
export declare class DataInformationBoxParser extends BoxListParser {
}
export declare class DataReferenceBoxParser extends FullBoxParser {
    parse(): IDataReferenceBox;
}
export declare class DataEntryUrlBoxParser extends FullBoxParser {
    parse(): IDataEntryUrlBox;
}
export declare class DataEntryUrnBoxParser extends FullBoxParser {
    parse(): IDataEntryUrnBox;
}
export declare class SampleTableBoxParser extends BoxListParser {
}
export declare class TimeToSampleBoxParser extends FullBoxParser {
    parse(): ITimeToSampleBox;
}
export declare class CompositionOffsetBoxParser extends FullBoxParser {
    parse(): ICompositionOffsetBox;
}
export declare class SampleEntryParser extends BoxParser {
    parse(): ISampleEntry;
}
export declare class HintSampleEntryParser extends SampleEntryParser {
    parse(): IHintSampleEntry;
}
export declare class VisualSampleEntryParser extends SampleEntryParser {
    parse(): IVisualSampleEntry;
}
export declare class AudioSampleEntryParser extends SampleEntryParser {
    parse(): IAudioSampleEntry;
}
export declare class ESDBoxParser extends FullBoxParser {
    parse(): IESDBox;
}
export declare class MP4VisualSampleEntryParser extends VisualSampleEntryParser {
    parse(): IMP4VisualSampleEntry;
}
export declare class MP4AudioSampleEntryParser extends AudioSampleEntryParser {
    parse(): IMP4AudioSampleEntry;
}
export declare class MpegSampleEntryParser extends SampleEntryParser {
    parse(): IMpegSampleEntry;
}
export declare class SampleDescriptionBoxParser extends FullBoxParser {
    parse(): ISampleDescriptionBox;
}
export declare class SampleSizeBoxParser extends FullBoxParser {
    parse(): ISampleSizeBox;
}
export declare class SampleToChunkBoxParser extends FullBoxParser {
    parse(): ISampleToChunkBox;
}
export declare class ChunkOffsetBoxParser extends FullBoxParser {
    parse(): IChunkOffsetBox;
}
export declare class SyncSampleBoxParser extends FullBoxParser {
    parse(): ISyncSampleBox;
}
export declare class ShadowSyncSampleBoxParser extends FullBoxParser {
    parse(): IShadowSyncSampleBox;
}
export declare class DegradationPriorityBoxParser extends FullBoxParser {
    parse(): IDegradationPriorityBox;
}
export declare class PaddingBitsBoxParser extends FullBoxParser {
    parse(): IPaddingBitsBox;
}
export declare class FreeSpaceBoxParser extends MediaBoxParser {
}
export declare class SkipBoxParser extends MediaBoxParser {
}
export declare class EditBoxParser extends BoxListParser {
}
export declare class EditListBoxParser extends FullBoxParser {
    parse(): IEditListBox;
}
export declare class CopyrightBoxParser extends FullBoxParser {
    parse(): ICopyrightBox;
}
export declare class MovieExtendsBoxParser extends BoxListParser {
}
export declare class MovieExtendsHeaderBoxParser extends FullBoxParser {
    parse(): IMovieExtendsHeaderBox;
}
export declare class TrackExtendsBoxParser extends FullBoxParser {
    parse(): ITrackExtendsBox;
}
export declare class MovieFlagmentBoxParser extends BoxListParser {
}
export declare class MovieFragmentHeaderBoxParser extends FullBoxParser {
    parse(): IMovieFragmentHeaderBox;
}
export declare class TrackFragmentBoxParser extends BoxListParser {
}
export declare class TrackFragmentHeaderBoxParser extends FullBoxParser {
    parse(): ITrackFragmentHeaderBox;
}
export declare class TrackRunBoxParser extends FullBoxParser {
    parse(): ITrackRunBox;
}
export declare class TrackFragmentRandomAccessBoxParser extends FullBoxParser {
    parse(): ITrackFragmentRandomAccessBox;
}
export declare class MovieFragmentRandomAccessOffsetBoxParser extends FullBoxParser {
    parse(): IMovieFragmentRandomAccessOffsetBox;
}
export declare class SampleDependencyTypeBoxParser extends FullBoxParser {
    parse(): ISampleDependencyTypeBox;
}
export declare class SampleToGroupBoxParser extends FullBoxParser {
    parse(): ISampleToGroupBox;
}
export declare class SampleGroupDescriptionEntryParser extends BoxParser {
}
export declare class VisualSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
export declare class AudioSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
export declare class HintSampleGroupEntryParser extends SampleGroupDescriptionEntryParser {
}
export declare class SampleGroupDescriptionBoxParser extends FullBoxParser {
    parse(): ISampleGroupDescriptionBox;
}
export declare class VisualRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
    parse(): IVisualRollRecoveryEntry;
}
export declare class AudioRollRecoveryEntryParser extends VisualSampleGroupEntryParser {
    parse(): IAudioRollRecoveryEntry;
}
export declare class SampleScaleBoxParser extends FullBoxParser {
    parse(): ISampleScaleBox;
}
export declare class SubSampleInformationBoxParser extends FullBoxParser {
    parse(): ISubSampleInformationBox;
}
export declare class ProgressiveDownloadInfoBoxParser extends FullBoxParser {
    parse(): IProgressiveDownloadInfoBox;
}
export declare class MetaBoxParser extends FullBoxParser {
    parse(): IMetaBox;
}
export declare class XMLBoxParsr extends FullBoxParser {
    parse(): IXMLBox;
}
export declare class BinaryXMLBoxParser extends FullBoxParser {
    parse(): IBinaryXMLBox;
}
export declare class ItemLocationBoxParser extends FullBoxParser {
    parse(): IItemLocationBox;
}
export declare class PrimaryItemBoxParser extends FullBoxParser {
    parse(): IPrimaryItemBox;
}
export declare class ItemProtectionBoxParser extends FullBoxParser {
    parse(): IItemProtectionBox;
}
export declare class ItemInfoEntryParser extends FullBoxParser {
    parse(): IItemInfoEntry;
}
export declare class ItemInfoBoxParser extends FullBoxParser {
    parse(): IItemInfoBox;
}
export declare class ProtectionSchemeInfoBoxParser extends BoxParser {
    parse(): IProtectionSchemeInfoBox;
}
export declare class OriginalFormatBoxParser extends BoxParser {
    parse(): IOriginalFormatBox;
}
export declare class IPMPInfoBoxParser extends FullBoxParser {
    parse(): IIPMPInfoBox;
}
/**
 * Create a box parser by the box type.
 * @param bytes
 * @param type A box type.
 */
export declare var createBoxParser: (bytes: Uint8Array, type: string) => BoxParser;
