/*
aligned(8) class DataEntryUrlBox (bit(24) flags)
extends FullBox(‘url ’, version = 0, flags) {
string
location;
}
*/

var DataEntryUrlBox = DataEntryBox.extend('url ', function(parent, cls) {
    this.init = function(params, flags) {
        parent.init.call(this, params, flags);
    };
});