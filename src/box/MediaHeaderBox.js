/*
aligned(8) class MediaHeaderBox extends FullBox(‘mdhd’, version, 0) {
if (version==1) {
unsigned int(64) creation_time;
unsigned int(64) modification_time;
unsigned int(32) timescale;
unsigned int(64) duration;
} else { // version==0
unsigned int(32) creation_time;
unsigned int(32) modification_time;
unsigned int(32) timescale;
unsigned int(32) duration;
}
bit(1)
pad = 0;
unsigned int(5)[3]
language;
// ISO-639-2/T language code
unsigned int(16) pre_defined = 0;
}
*/

var MediaHeaderBox = FullBox.extend('mdhd', function(parent, cls) {
    cls.pad = 0;
    cls.preDefined = 0;
    
    this.init = function(params) {
        this.creationTime = params.creationTime;
        this.modificationTime = params.modificationTime;
        this.timescale = params.timescale;
        this.duration = params.duration;
        this.language = params.language;
        parent.init.call(this, 0, 0);
    };
});