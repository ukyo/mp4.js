var mp4;
(function (mp4) {
    (function (parser) {
        var Parser = (function () {
            function Parser(bytes) {
                this.bytes = bytes;
            }
            Parser.prototype.parse = function () {
                throw new Error('not implemented error.');
            };
            return Parser;
        })();
        parser.Parser = Parser;        
    })(mp4.parser || (mp4.parser = {}));
    var parser = mp4.parser;
})(mp4 || (mp4 = {}));
//@ sourceMappingURL=parser.js.map
