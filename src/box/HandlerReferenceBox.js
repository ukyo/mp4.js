/*
aligned(8) class HandlerBox extends FullBox(‘hdlr’, version = 0, 0) {
unsigned int(32) pre_defined = 0;
unsigned int(32) handler_type;
const unsigned int(32)[3] reserved = 0;
string
name;
}
*/

var HanderReferenceBox = FullBox.extend('hdlr', function(parent, cls) {
    cls.preDefined = 0;
    cls.vide = 'vide';
    cls.soun = 'soun';
    cls.hint = 'hint';

    this.init = function(params) {
        this.handlerType = params.handlerType;
        this.name = params.name;
        parent.init.call(this, 0, 0);
    };
})