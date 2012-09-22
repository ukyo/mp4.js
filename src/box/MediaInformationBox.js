/*
aligned(8) class MediaInformationBox extends Box(‘minf’) {
}
*/

var MediaInformationBox = Box.extend('mdia', function(parent, cls) {
    this.setBoxType(cls, 'mdia');
    this.setContainer(cls, MediaBox);
})