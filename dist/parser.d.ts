import { BitReader } from "./bitreader";
export interface IParser {
    parse(): any;
}
export declare class BaseParser extends BitReader implements IParser {
    parse(): any;
}
