import { IBox } from "./interface.box";

export class Finder {
  constructor(public tree: any) {}

  findOne(type: string): IBox {
    let box!: IBox;
    const find = (tree: any) => {
      if (box) return;
      switch (typeof tree) {
        case "number":
        case "string":
        case "boolean":
          return;
      }
      if (tree.type === type) {
        return (box = tree);
      }
      if (tree.buffer) return;
      Object.keys(tree).forEach(key => {
        const prop = tree[key];
        if (prop == null) return;
        if (Array.isArray(prop)) {
          prop.some(find);
        } else if (prop.type) {
          find(prop);
        }
      });
    };
    find(this.tree);
    return box;
  }

  findAll(type: string): IBox[] {
    const boxes: IBox[] = [];
    const find = (tree: any) => {
      switch (typeof tree) {
        case "number":
        case "string":
        case "boolean":
          return;
      }
      if (tree.type === type) boxes.push(tree);
      if (tree.buffer) return;
      Object.keys(tree).forEach(key => {
        const prop = tree[key];
        if (prop == null) return;
        if (Array.isArray(prop)) {
          prop.forEach(find);
        } else {
          find(prop);
        }
      });
    };
    find(this.tree);
    return boxes;
  }
}
