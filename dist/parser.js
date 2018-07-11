"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitreader_1 = require("./bitreader");
class BaseParser extends bitreader_1.BitReader {
    parse() {
        throw new Error("not implemented error.");
    }
}
exports.BaseParser = BaseParser;
