/// <reference path="dataview.ts" />
/// <reference path="interface.descr.ts" />
/// <reference path="interface.box.ts" />
/// <reference path="finder.ts" />
/// <reference path="parser.ts" />
/// <reference path="parser.descr.ts" />
/// <reference path="parser.box.ts" />
/// <reference path="composer.ts" />
/// <reference path="composer.descr.ts" />
/// <reference path="composer.box.ts" />

module Mp4 {
  export var parse = (bytes: Uint8Array): IBox[] => {
    return new Mp4.Parser.Box.RootParser(bytes).parse();
  };

  export var extractAudio = (bytes: Uint8Array): Uint8Array => {
    var tree = parse(bytes);
    var finder = new Finder(tree);
    var audioTrack: IBox;


    return new Uint8Array(0);

  };
}