/// <reference path="dataview.ts" />
/// <reference path="interface.descr.ts" />
/// <reference path="interface.box.ts" />
/// <reference path="finder.ts" />
/// <reference path="parser.ts" />
/// <reference path="parser.box.ts" />

module mp4 {
  export var parse = (bytes: Uint8Array): IBox[] => {
    return new mp4.parser.box.RootParser(bytes).parse();
  };


}