/*
aligned(8) class FullBox(unsigned int(32) boxtype, unsigned int(8) v, bit(24) f)
extends Box(boxtype) {
unsigned int(8)
version = v;
bit(24)
flags = f;
}
*/

var FullBox = Box.extend(function(parent, cls) {
    this.init = function(version, flags) {
        this.version = version;
        this.flags = flags;
        parent.init.call(this);
    };
});