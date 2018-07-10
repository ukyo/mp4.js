import { BitReader } from "./bitreader";
import { Finder } from "./finder";
import { BitWriter } from "./bitwriter";
import { DataView2 } from "./dataview";
import * as apis from "./mp4";
import * as statics from "./statics";
import * as boxBuilders from "./composer.box";
import * as descrBuilders from "./composer.descr";
import * as boxParsers from "./parser.box";
import * as descrParsers from "./parser.descr";

export const Mp4 = {
  DataView2,
  BitReader,
  BitWriter,
  Finder,
  ...apis,
  ...statics,
  Builder: {
    ...boxBuilders,
    ...descrBuilders
  },
  Parser: {
    ...boxParsers,
    ...descrParsers
  }
};
