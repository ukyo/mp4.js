module mp4 {
  
  export class Finder {
    constructor(public boxes: IBox[]) { }

    findBoxes(type: string): IBox[] {
      var boxes: IBox[] = [];
      var find = (box) => {
        if (box.type === type) boxes.push(box);
        if (box.boxes) box.boxes.forEach(find);
      };
      this.boxes.forEach(find);
      return boxes;
    }

    findDescriptors(tag: number): IDescriptor[] {

      return <IDescriptor[]>[];
    }
  }



}