import { IBox } from "./interface.box";
export declare class Finder {
    tree: any;
    constructor(tree: any);
    findOne(type: string): IBox;
    findAll(type: string): IBox[];
}
