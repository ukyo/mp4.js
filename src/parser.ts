///<reference path="dataview.ts" />

module mp4 {
  export class Parser {
    constructor(public bytes: Uint8Array) {}

    parse() {
      throw new Error('parse is not implemented.');
    }

    static createRootParser(bytes: Uint8Array): Parser {
      return new RootParser(bytes);
    }

    static createBoxParser(bytes: Uint8Array, type: string): Parser {
      return new BoxParser(bytes);
    }

    static createDiscriptorParser(bytes: Uint8Array, tag: number): Parser {
      return new Parser(new Uint8Array(10));
    }

  }

  export class BoxParser extends Parser {
    constructor(bytes: Uint8Array) { super(bytes); }

    static getBoxSize(bytes: Uint8Array, offset: number): number {
      var view = new DataView2(bytes, offset);
      return view.getUint32(0);
    }

    static getBoxType(bytes: Uint8Array, offset: number): string {
      var view = new DataView2(bytes, offset);
      return view.getString(4, 4);
    }

    static getBoxInfo(bytes: Uint8Array, offset: number): {size: number; type: string;} {
      return {
        size: BoxParser.getBoxSize(bytes, offset),
        type: BoxParser.getBoxType(bytes, offset)
      };
    }

    parse() {

    }
  }

  export class RootParser extends Parser {
    constructor(bytes) { super(bytes); }
  }

  export class FullBoxParser extends BoxParser {
  }

  export class MPEG4AudioSampleDescriptionBox extends BoxParser {

  }

  export class FileTypeBoxParser extends BoxParser {

  }
}