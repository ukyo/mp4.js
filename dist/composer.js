"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitwriter_1 = require("./bitwriter");
class BaseBuilder extends bitwriter_1.BitWriter {
    build() {
        return this.data;
    }
}
exports.BaseBuilder = BaseBuilder;
