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
 
Class.prototype.hook = function() {};
 
Class.extend = function(params, scope) {
    var parent = this.prototype,
        proto = Object.create(parent),
        cls = {},
        ctor;
 
    include.call(cls, this);
 
    if(arguments.length === 1 && typeof params === 'function') scope = params;
    if(typeof scope === 'function') scope.call(proto, parent, cls);
 
    ctor = proto.hasOwnProperty('init') ?
        proto.init :
        function() { parent.constructor.apply(this, slice.call(arguments)); };
 
    if(typeof params !== 'function') proto.hook(params, parent, cls);
 
    include.call(ctor, cls);
    ctor.prototype = proto;
    proto.constructor = ctor;
 
    return ctor;
};
