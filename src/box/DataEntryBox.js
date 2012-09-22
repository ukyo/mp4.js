var DataEntryBox = FullBox.extend(function(parent, cls) {
    this.init = function(params, flags) {
        this.location = params.location;
        parent.init.call(this, 0, flags);
    };
});