"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const statics_1 = require("./statics");
const dict = {};
function Tag(tag) {
    return function (constructor) {
        constructor.TAG = tag;
        if (typeof tag === "number") {
            dict[tag] = constructor;
        }
        else {
            tag.forEach(t => (dict[t] = constructor));
        }
        return constructor;
    };
}
exports.getDescriptorInfo = (bytes, offset = 0) => {
    var tag = bytes[offset++];
    var b = bytes[offset++];
    var bodyLength = b & 0x7f;
    var headerLength = 2;
    while (b & 0x80) {
        headerLength++;
        b = bytes[offset++];
        bodyLength <<= 7;
        bodyLength |= b & 0x7f;
    }
    return {
        tag: tag,
        byteLength: headerLength + bodyLength,
        headerLength: headerLength,
        bodyLength: bodyLength
    };
};
class DescriptorParserMixin extends parser_1.BaseParser {
    readDescriptor() {
        var info = exports.getDescriptorInfo(this.bytes, this.byteOffset);
        return exports.createDescriptorParser(this.readBytes(info.byteLength), info.tag).parse();
    }
}
exports.DescriptorParserMixin = DescriptorParserMixin;
class DescriptorParser extends DescriptorParserMixin {
    parse() {
        var info = exports.getDescriptorInfo(this.bytes);
        this.skipBytes(info.headerLength);
        info.bytes = this.bytes;
        return info;
    }
}
exports.DescriptorParser = DescriptorParser;
let DecoderSpecificInfoParser = class DecoderSpecificInfoParser extends DescriptorParser {
    parse() {
        var ret = super.parse();
        ret.data = this.bytes.subarray(this.byteOffset);
        return ret;
    }
};
DecoderSpecificInfoParser = __decorate([
    Tag(statics_1.DESCR_TAG_DECODER_SPECIFIC_INFO)
], DecoderSpecificInfoParser);
exports.DecoderSpecificInfoParser = DecoderSpecificInfoParser;
let ProfileLevelINdicationIndexDescriptor = class ProfileLevelINdicationIndexDescriptor extends DescriptorParser {
    parse() {
        var ret = super.parse();
        ret.profileLevelIndicationIndex = this.readUint8();
        return ret;
    }
};
ProfileLevelINdicationIndexDescriptor = __decorate([
    Tag(statics_1.DESCR_TAG_PROFILE_LEVEL_INDICATION_INDEX_DESCRIPTOR)
], ProfileLevelINdicationIndexDescriptor);
exports.ProfileLevelINdicationIndexDescriptor = ProfileLevelINdicationIndexDescriptor;
let DecoderConfigDescriptorParser = class DecoderConfigDescriptorParser extends DescriptorParser {
    parse() {
        var ret = super.parse();
        ret.objectTypeIndication = this.readUint8();
        ret.streamType = this.readBits(6);
        ret.upStream = this.readBits(1);
        this.skipBits(1);
        ret.bufferSizeDB = this.readUint24();
        ret.maxBitrate = this.readUint32();
        ret.avgBitrate = this.readUint32();
        var info;
        var descrParser;
        var descr;
        ret.profileLevelIndicationIndexDescrs = [];
        while (!this.eof()) {
            info = exports.getDescriptorInfo(this.bytes.subarray(this.byteOffset));
            descrParser = exports.createDescriptorParser(this.readBytes(info.byteLength), info.tag);
            descr = descrParser.parse();
            if (descrParser instanceof DecoderSpecificInfoParser) {
                ret.decSpecificInfo = descr;
            }
            else if (descrParser instanceof ProfileLevelINdicationIndexDescriptor) {
                ret.profileLevelIndicationIndexDescrs.push(descr);
            }
            else {
                throw new TypeError();
            }
        }
        return ret;
    }
};
DecoderConfigDescriptorParser.OBJECT_TYPE_INDICATION = {
    MP3: 0x6b,
    AAC: 0x40
};
DecoderConfigDescriptorParser = __decorate([
    Tag(statics_1.DESCR_TAG_DECODER_CONFIG_DESCRIPTOR)
], DecoderConfigDescriptorParser);
exports.DecoderConfigDescriptorParser = DecoderConfigDescriptorParser;
let SLConfigDescriptorParser = class SLConfigDescriptorParser extends DescriptorParser {
    parse() {
        var ret = super.parse();
        ret.preDefined = this.readUint8();
        if (ret.preDefined === 0) {
            ret.useAccessUnitStartFlag = this.readBits(1);
            ret.useAccessUnitEndFlag = this.readBits(1);
            ret.useRandomAccessPointFlag = this.readBits(1);
            ret.hasRandomAccessUnitsOnlyFlag = this.readBits(1);
            ret.usePaddingFlag = this.readBits(1);
            ret.useTimeStampsFlag = this.readBits(1);
            ret.useIdleFlag = this.readBits(1);
            ret.durationFlag = this.readBits(1);
            ret.timeStampResolution = this.readUint32();
            ret.ocrResolution = this.readUint32();
            ret.timeStampLength = this.readUint8();
            ret.ocrLength = this.readUint8();
            ret.auLength = this.readUint8();
            ret.instantBitrateLength = this.readUint8();
            ret.degradationPriorityLength = this.readBits(4);
            ret.auSeqNumLength = this.readBits(5);
            ret.packetSeqNumLength = this.readBits(5);
            this.skipBits(2);
        }
        if (ret.durationFlag) {
            ret.timeScale = this.readUint32();
            ret.accessUnitDuration = this.readUint16();
            ret.compositionUnitDuration = this.readUint16();
        }
        if (ret.useTimeStampsFlag === 0) {
            ret.startDecodingTimeStamp = this.readBits(ret.timeStampLength);
            ret.startCompositionTimeStamp = this.readBits(ret.timeStampLength);
        }
        return ret;
    }
};
SLConfigDescriptorParser = __decorate([
    Tag(statics_1.DESCR_TAG_SL_CONFIG_DESCRIPTOR)
], SLConfigDescriptorParser);
exports.SLConfigDescriptorParser = SLConfigDescriptorParser;
class IPIDescriptorPointerParser extends DescriptorParser {
}
exports.IPIDescriptorPointerParser = IPIDescriptorPointerParser;
class IPIdentificationDataSetParser extends DescriptorParser {
}
exports.IPIdentificationDataSetParser = IPIdentificationDataSetParser;
class IPMPDescriptorPointerParser extends DescriptorParser {
}
exports.IPMPDescriptorPointerParser = IPMPDescriptorPointerParser;
class LanguageDescriptorParser extends DescriptorParser {
}
exports.LanguageDescriptorParser = LanguageDescriptorParser;
class QosDescriptorParser extends DescriptorParser {
}
exports.QosDescriptorParser = QosDescriptorParser;
class ExtensionDescriptorParser extends DescriptorParser {
}
exports.ExtensionDescriptorParser = ExtensionDescriptorParser;
let ESDescriptorParser = class ESDescriptorParser extends DescriptorParser {
    parse() {
        var ret = super.parse();
        var descr;
        ret.esID = this.readUint16();
        ret.streamDependenceFlag = this.readBits(1);
        ret.urlFlag = this.readBits(1);
        ret.ocrStreamFlag = this.readBits(1);
        ret.streamPriority = this.readBits(5);
        if (ret.streamDependenceFlag) {
            ret.dependsOnEsID = this.readUint16();
        }
        if (ret.urlFlag) {
            ret.urlLength = this.readUint8();
            ret.urlString = this.readString(ret.urlLength);
        }
        if (ret.ocrStreamFlag) {
            ret.ocrEsID = this.readUint16();
        }
        while (!this.eof()) {
            descr = this.readDescriptor();
            switch (descr.tag) {
                case statics_1.DESCR_TAG_DECODER_CONFIG_DESCRIPTOR:
                    ret.decConfigDescr = descr;
                    break;
                case statics_1.DESCR_TAG_SL_CONFIG_DESCRIPTOR:
                    ret.slConfigDescr = descr;
                    break;
            }
        }
        return ret;
    }
};
ESDescriptorParser = __decorate([
    Tag(statics_1.DESCR_TAG_ES_DESCRIPTOR)
], ESDescriptorParser);
exports.ESDescriptorParser = ESDescriptorParser;
let InitialObjectDescriptorParser = class InitialObjectDescriptorParser extends DescriptorParser {
    parse() {
        var ret = super.parse();
        ret.objectDescrID = this.readBits(10);
        ret.urlFlag = this.readBits(1);
        ret.includeInlineProfileLevelFlag = this.readBits(1);
        this.skipBits(4);
        if (ret.urlFlag) {
            ret.urlLength = this.readUint8();
            ret.urlString = this.readString(ret.urlLength);
        }
        else {
            ret.odProfileLevelIndication = this.readUint8();
            ret.sceneProfileLevelIndication = this.readUint8();
            ret.audioProfileLevelIndication = this.readUint8();
            ret.visualProfileLevelIndication = this.readUint8();
            ret.graphicsProfileLevelIndication = this.readUint8();
            // TODO
        }
        ret.extDescrs = [];
        if (ret.urlFlag)
            while (!this.eof()) {
                ret.extDescrs.push(this.readDescriptor());
            }
        return ret;
    }
};
InitialObjectDescriptorParser = __decorate([
    Tag([0x02, 0x10])
], InitialObjectDescriptorParser);
exports.InitialObjectDescriptorParser = InitialObjectDescriptorParser;
exports.createDescriptorParser = (bytes, tag) => {
    return new (dict[tag] || DescriptorParser)(bytes);
};
