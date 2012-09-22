/*
aligned(8) class FileTypeBox
extends Box(‘ftyp’) {
unsigned int(32) major_brand;
unsigned int(32) minor_version;
unsigned int(32) compatible_brands[];
}
*/

var FileTypeBox = Box.extend('ftyp', function(parent, cls) {
    this.init = function(majorBrand, minorVersion, compatibleBlands) {
        this.majorBrand = majorBrand;
        this.minorVersion = minorVersion;
        this.compatibleBlands = compatibleBlands;
        parent.init.call(this);
    };
});