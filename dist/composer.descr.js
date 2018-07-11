"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const composer_1 = require("./composer");
const statics_1 = require("./statics");
const dict = {};
function Tag(tag) {
    return function (constructor) {
        constructor.TAG = tag;
        dict[tag] = constructor;
        return constructor;
    };
}
class DescriptorBuilderMixin extends composer_1.BaseBuilder {
    writeDescriptor(descr) {
        var bytes;
        if (descr instanceof Uint8Array) {
            bytes = descr;
        }
        else if (descr.bytes) {
            bytes = descr.bytes;
        }
        else {
            bytes = exports.createDescriptorBuilder(descr).build();
        }
        this.writeBytes(bytes);
    }
}
exports.DescriptorBuilderMixin = DescriptorBuilderMixin;
class DescriptorBuilder extends DescriptorBuilderMixin {
    constructor() {
        super();
        this.writeUint8(this.constructor.TAG);
        this.writeBytes(new Uint8Array(4));
    }
    build() {
        this.writeBodyLength();
        return super.build();
    }
    writeBodyLength() {
        var bytes = [0x80, 0x80, 0x80, 0x00];
        var bodyLength = this.byteOffset - 5;
        var i = 3;
        while (bodyLength) {
            bytes[i--] |= bodyLength & 0x7f;
            bodyLength >>>= 7;
        }
        this.bytes.set(bytes, 1);
    }
}
exports.DescriptorBuilder = DescriptorBuilder;
let DecoderConfigDescriptorBuilder = class DecoderConfigDescriptorBuilder extends DescriptorBuilder {
    constructor(descr) {
        super();
        this.writeUint8(descr.objectTypeIndication);
        this.writeBits(descr.streamType, 6);
        this.writeBits(descr.upStream, 1);
        this.writeBits(1, 1);
        this.writeUint24(descr.bufferSizeDB);
        this.writeUint32(descr.maxBitrate);
        this.writeUint32(descr.avgBitrate);
        descr.decSpecificInfo.tag = statics_1.DESCR_TAG_DECODER_SPECIFIC_INFO;
        this.writeDescriptor(descr.decSpecificInfo);
        if (descr.profileLevelIndicationIndexDescrs) {
            descr.profileLevelIndicationIndexDescrs.forEach(d => {
                d.tag = statics_1.DESCR_TAG_PROFILE_LEVEL_INDICATION_INDEX_DESCRIPTOR;
                this.writeDescriptor(d);
            });
        }
    }
};
DecoderConfigDescriptorBuilder = __decorate([
    Tag(statics_1.DESCR_TAG_DECODER_CONFIG_DESCRIPTOR)
], DecoderConfigDescriptorBuilder);
exports.DecoderConfigDescriptorBuilder = DecoderConfigDescriptorBuilder;
let SLConfigDescriptorBuilder = class SLConfigDescriptorBuilder extends DescriptorBuilder {
    constructor(descr) {
        super();
        this.writeUint8(descr.preDefined);
        if (descr.preDefined === 0) {
            this.writeBits(descr.useAccessUnitStartFlag, 1);
            this.writeBits(descr.useAccessUnitEndFlag, 1);
            this.writeBits(descr.useRandomAccessPointFlag, 1);
            this.writeBits(descr.hasRandomAccessUnitsOnlyFlag, 1);
            this.writeBits(descr.usePaddingFlag, 1);
            this.writeBits(descr.useTimeStampsFlag, 1);
            this.writeBits(descr.useTimeStampsFlag, 1);
            this.writeBits(descr.useIdleFlag, 1);
            this.writeBits(descr.durationFlag, 1);
            this.writeUint32(descr.timeStampResolution);
            this.writeUint32(descr.ocrResolution);
            this.writeUint8(descr.timeStampLength);
            this.writeUint8(descr.ocrLength);
            this.writeUint8(descr.auLength);
            this.writeUint8(descr.instantBitrateLength);
            this.writeBits(descr.degradationPriorityLength, 4);
            this.writeBits(descr.auSeqNumLength, 5);
            this.writeBits(descr.packetSeqNumLength, 5);
            this.writeBits(3, 2);
        }
        if (descr.durationFlag) {
            this.writeUint32(descr.timeScale);
            this.writeUint16(descr.accessUnitDuration);
            this.writeUint16(descr.compositionUnitDuration);
        }
        if (descr.useTimeStampsFlag === 0) {
            this.writeBits(descr.startDecodingTimeStamp, descr.timeStampLength);
            this.writeBits(descr.startCompositionTimeStamp, descr.timeStampLength);
        }
    }
};
SLConfigDescriptorBuilder = __decorate([
    Tag(statics_1.DESCR_TAG_SL_CONFIG_DESCRIPTOR)
], SLConfigDescriptorBuilder);
exports.SLConfigDescriptorBuilder = SLConfigDescriptorBuilder;
let DecoderSpecificInfoBuilder = class DecoderSpecificInfoBuilder extends DescriptorBuilder {
    constructor(descr) {
        super();
        this.writeBytes(descr.data);
    }
};
DecoderSpecificInfoBuilder = __decorate([
    Tag(statics_1.DESCR_TAG_DECODER_SPECIFIC_INFO)
], DecoderSpecificInfoBuilder);
exports.DecoderSpecificInfoBuilder = DecoderSpecificInfoBuilder;
let ESDescriptorBuilder = class ESDescriptorBuilder extends DescriptorBuilder {
    constructor(descr) {
        super();
        this.writeUint16(descr.esID);
        this.writeBits(descr.streamDependenceFlag || 0, 1);
        this.writeBits(descr.urlFlag || 0, 1);
        this.writeBits(descr.ocrStreamFlag || 0, 1);
        this.writeBits(descr.streamPriority, 5);
        if (descr.urlFlag) {
            this.writeUint8(descr.urlLength);
            this.writeString(descr.urlString);
        }
        if (descr.ocrStreamFlag) {
            this.writeUint16(descr.ocrEsID);
        }
        descr.decConfigDescr.tag = statics_1.DESCR_TAG_DECODER_CONFIG_DESCRIPTOR;
        this.writeDescriptor(descr.decConfigDescr);
        descr.slConfigDescr.tag = statics_1.DESCR_TAG_SL_CONFIG_DESCRIPTOR;
        this.writeDescriptor(descr.slConfigDescr);
    }
};
ESDescriptorBuilder = __decorate([
    Tag(statics_1.DESCR_TAG_ES_DESCRIPTOR)
], ESDescriptorBuilder);
exports.ESDescriptorBuilder = ESDescriptorBuilder;
exports.createDescriptorBuilder = (descr) => {
    return new (dict[descr.tag] || DescriptorBuilder)(descr);
};
