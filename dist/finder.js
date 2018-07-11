"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Finder {
    constructor(tree) {
        this.tree = tree;
    }
    findOne(type) {
        let box;
        const find = (tree) => {
            if (box)
                return;
            switch (typeof tree) {
                case "number":
                case "string":
                case "boolean":
                    return;
            }
            if (tree.type === type) {
                return (box = tree);
            }
            if (tree.buffer)
                return;
            Object.keys(tree).forEach(key => {
                const prop = tree[key];
                if (prop == null)
                    return;
                if (Array.isArray(prop)) {
                    prop.some(find);
                }
                else if (prop.type) {
                    find(prop);
                }
            });
        };
        find(this.tree);
        return box;
    }
    findAll(type) {
        const boxes = [];
        const find = (tree) => {
            switch (typeof tree) {
                case "number":
                case "string":
                case "boolean":
                    return;
            }
            if (tree.type === type)
                boxes.push(tree);
            if (tree.buffer)
                return;
            Object.keys(tree).forEach(key => {
                const prop = tree[key];
                if (prop == null)
                    return;
                if (Array.isArray(prop)) {
                    prop.forEach(find);
                }
                else {
                    find(prop);
                }
            });
        };
        find(this.tree);
        return boxes;
    }
}
exports.Finder = Finder;
