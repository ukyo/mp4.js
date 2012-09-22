/*
aligned(8) class SoundMediaHeaderBox
extends FullBox(‘smhd’, version = 0, 0) {
template int(16) balance = 0;
const unsigned int(16) reserved = 0;
}
*/

var SoundMediaHeaderBox = FullBox.extend('smhd', function(parent, cls) {
    cls.balance = 0;

    this.init = function(balance) {
        this.balance = Math.max(-1, Math.min(1, balance || cls.balance));
        parent.init.call(this, 0, 0);
    };
});