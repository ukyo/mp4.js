/*
aligned(8) class DataReferenceBox
extends FullBox(‘dref’, version = 0, 0) {
unsigned int(32) entry_count;
for (i=1; i • entry_count; i++) {
DataEntryBox(entry_version, entry_flags) data_entry;
}
}
*/

var DataReferenceBox = FullBox.extend('dref', function(parent, cls) {
    this.init = function(dataEntryBoxes) {
        this.dataEntryBoxes = dataEntryBoxes;
        this.init.call(this);
    };
});