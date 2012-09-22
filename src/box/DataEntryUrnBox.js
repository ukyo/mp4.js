/*
aligned(8) class DataEntryUrnBox (bit(24) flags)
extends FullBox(‘urn ’, version = 0, flags) {
string
name;
string
location;
}
*/

var DataEntryUrnBox = DataEntryBox.extend('urn ', function(parent, cls) {
    this.init = function(params, flags) {
        this.name = params.name;
        parent.init.call(this, params, flags);
    };
});