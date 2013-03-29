module mp4.parser {
  export interface IParser {
    parse(): any;
  }

  export class Parser implements IParser {
    constructor(public bytes: Uint8Array) {}
    parse(): any { throw new Error('not implemented error.'); }
  }
}