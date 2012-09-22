/*
aligned(8) class TimeToSampleBox
extends FullBox(’stts’, version = 0, 0) {
unsigned int(32) entry_count;
int i;
for (i=0; i < entry_count; i++) {
unsigned int(32) sample_count;
unsigned int(32) sample_delta;
}
}
*/

var TimeToSampleBox = FullBox.extend('stts', function(parent, cls) {
    this.init = function(sampleEntries) {
        this.sampleEntries = sampleEntries;
        parent.init.call(this, 0, 0);
    };
;