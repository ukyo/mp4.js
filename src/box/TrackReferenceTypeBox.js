/*
aligned(8) class TrackReferenceTypeBox (unsigned int(32) reference_type) extends
Box(reference_type) {
unsigned int(32) track_IDs[];
}
*/

var TrackReferenceTypeBox = Box.extend(function(parent, cls) {
    cls.hint = 'hint';
    cls.cdsc = 'cdsc';

    this.setContainer(cls, TrackBox);

    this.init = function(referenceType, trackIds) {
        this.boxType = referenceType;
        this.trackIds = trackIds;
        parent.init.call(this);
    };
});