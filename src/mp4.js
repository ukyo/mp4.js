var Mp4;
(function (Mp4) {
    Mp4.parse = function (bytes) {
        return new Mp4.Parser.Box.RootParser(bytes).parse();
    };
})(Mp4 || (Mp4 = {}));
//@ sourceMappingURL=mp4.js.map
