/*
aligned(8) class MovieHeaderBox extends FullBox(‘mvhd’, version, 0) {
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
template int(32) rate = 0x00010000; // typically 1.0
template int(16) volume = 0x0100;
// typically, full volume
const bit(16) reserved = 0;
const unsigned int(32)[2] reserved = 0;
template int(32)[9] matrix =
{ 0x00010000,0,0,0,0x00010000,0,0,0,0x40000000 };
// Unity matrix
bit(32)[6] pre_defined = 0;
unsigned int(32) next_track_ID;
}
*/

var MovieHeaderBox = FullBox.extend('mvhd', function(parent, cls) {
    cls.rate = 0x00010000;
    cls.volume = 0x0100;
    cls.matrix = [
        0x00010000, 0, 0,
        0, 0x00010000, 0,
        0, 0, 0x40000000
    ];

    this.init = function(params) {
        this.creationTime = params.creationTime;
        this.modificationTime = params.modificationTime;
        this.timescale = params.timescale;
        this.duration = params.duration;
        this.nextTrackId = params.nextTrackId;
        parent.init.call(this, 0, 0);
    };
});