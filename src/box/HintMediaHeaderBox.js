/*
aligned(8) class HintMediaHeaderBox
extends FullBox(‘hmhd’, version = 0, 0) {
unsigned int(16) maxPDUsize;
unsigned int(16) avgPDUsize;
unsigned int(32) maxbitrate;
unsigned int(32) avgbitrate;
unsigned int(32) reserved = 0;
}
*/

var HintMediaHeaderBox = FullBox.extend('hmhd', function(parent, cls) {
    this.init = function(params) {
        this.maxPDUsize = params.maxPDUsize;
        this.avgPDUsize = params.avgPDUsize;
        this.maxBitrate = this.maxBitrate;
        this.avgBitrate = this.avgBitrate;
        parent.init.call(this, 0, 0);
    };
});