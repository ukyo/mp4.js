"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitreader_1 = require("./bitreader");
const finder_1 = require("./finder");
const bitwriter_1 = require("./bitwriter");
const dataview_1 = require("./dataview");
const apis = __importStar(require("./mp4"));
const statics = __importStar(require("./statics"));
const boxBuilders = __importStar(require("./composer.box"));
const descrBuilders = __importStar(require("./composer.descr"));
const boxParsers = __importStar(require("./parser.box"));
const descrParsers = __importStar(require("./parser.descr"));
exports.Mp4 = Object.assign({ DataView2: dataview_1.DataView2,
    BitReader: bitreader_1.BitReader,
    BitWriter: bitwriter_1.BitWriter,
    Finder: finder_1.Finder }, apis, statics, { Builder: Object.assign({}, boxBuilders, descrBuilders), Parser: Object.assign({}, boxParsers, descrParsers) });
