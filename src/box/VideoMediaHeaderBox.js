/*
aligned(8) class VideoMediaHeaderBox
extends FullBox(‘vmhd’, version = 0, 1) {
template unsigned int(16) graphicsmode = 0;
// copy, see below
template unsigned int(16)[3] opcolor = {0, 0, 0};
}
*/

var VideoMediaHeaderBox = FullBox.extend('vmhd', function(parent, cls) {
    cls.GRAPHICS_MODE = 0;
    cls.OP_COLOR = [0, 0, 0];

    this.init = function(params) {
        this.graphicsMode = params.graphicsMode || cls.GRAPHICS_MODE;
        this.opColor = params.opColor || cls.OP_COLOR;
        this.parent.init.call(this, 0, 1);
    };
});