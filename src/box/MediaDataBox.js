/*
aligned(8) class MediaDataBox extends Box(‘mdat’) {
bit(8) data[];
}
*/

var MediaDataBox = Box.extend('mdat', function(parent, cls) {
    this.setBoxType(cls, 'mdat');
    this.setContainer(cls, null);

    this.init = function(data) {
        this.data = data;
        parent.init.call(this);
    };
});