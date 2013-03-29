var mp4;
(function (mp4) {
    mp4.parse = function (bytes) {
        return new mp4.parser.box.RootParser(bytes).parse();
    };
})(mp4 || (mp4 = {}));
//@ sourceMappingURL=mp4.js.map
