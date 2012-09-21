var Class = function() {},
    slice = Array.prototype.slice,
    include;


Class.include = Class.prototype.include = include = function() {
    var self = this;

    slice.call(arguments).forEach(function(object) {
        Object.getOwnPropertyNames(object).forEach(function(name) {
            self[name] = object[name];
        });
    });
};

Class.extend = function(f) {
    var parent = this.prototype,
        proto = Object.create(parent),
        cls = {},
        ctor;

    include.call(cls, this);
    f.call(proto, parent, cls);
    ctor = proto.hasOwnProperty('init') ?
        proto.init :
        function() { parent.constructor.apply(this, slice.call(arguments)); };

    include.call(ctor, cls);
    ctor.prototype = proto;
    proto.constructor = ctor;
    proto.init = void 0;

    return ctor;
};
