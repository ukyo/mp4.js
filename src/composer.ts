import { BitWriter } from "./bitwriter";

export class BaseBuilder extends BitWriter {
  build(): Uint8Array {
    return this.data;
  }
}
