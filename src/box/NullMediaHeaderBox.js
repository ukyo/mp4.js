/*
aligned(8) class NullMediaHeaderBox
extends FullBox(’nmhd’, version = 0, flags) {
}
*/

var NullMediaHeaderBox = FullBox.extend('nmhd', function(parent, cls) {
    this.init = function() {
        parent.init.call(this, 0, 0);
    };
});