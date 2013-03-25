var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="dataview.ts" />
var mp4;
(function (mp4) {
    var Parser = (function () {
        function Parser(bytes) {
            this.bytes = bytes;
        }
        Parser.prototype.parse = function () {
            throw new Error('parse is not implemented.');
        };
        Parser.createRootParser = function createRootParser(bytes) {
            return new RootParser(bytes);
        };
        Parser.createBoxParser = function createBoxParser(bytes, type) {
            return new BoxParser(bytes);
        };
        Parser.createDiscriptorParser = function createDiscriptorParser(bytes, tag) {
            return new Parser(new Uint8Array(10));
        };
        return Parser;
    })();
    mp4.Parser = Parser;    
    var BoxParser = (function (_super) {
        __extends(BoxParser, _super);
        function BoxParser(bytes) {
                _super.call(this, bytes);
        }
        BoxParser.getBoxSize = function getBoxSize(bytes, offset) {
            var view = new mp4.DataView2(bytes, offset);
            return view.getUint32(0);
        };
        BoxParser.getBoxType = function getBoxType(bytes, offset) {
            var view = new mp4.DataView2(bytes, offset);
            return view.getString(4, 4);
        };
        BoxParser.getBoxInfo = function getBoxInfo(bytes, offset) {
            return {
                size: BoxParser.getBoxSize(bytes, offset),
                type: BoxParser.getBoxType(bytes, offset)
            };
        };
        BoxParser.prototype.parse = function () {
        };
        return BoxParser;
    })(Parser);
    mp4.BoxParser = BoxParser;    
    var RootParser = (function (_super) {
        __extends(RootParser, _super);
        function RootParser(bytes) {
                _super.call(this, bytes);
        }
        return RootParser;
    })(Parser);
    mp4.RootParser = RootParser;    
    var FullBoxParser = (function (_super) {
        __extends(FullBoxParser, _super);
        function FullBoxParser() {
            _super.apply(this, arguments);

        }
        return FullBoxParser;
    })(BoxParser);
    mp4.FullBoxParser = FullBoxParser;    
    var MPEG4AudioSampleDescriptionBox = (function (_super) {
        __extends(MPEG4AudioSampleDescriptionBox, _super);
        function MPEG4AudioSampleDescriptionBox() {
            _super.apply(this, arguments);

        }
        return MPEG4AudioSampleDescriptionBox;
    })(BoxParser);
    mp4.MPEG4AudioSampleDescriptionBox = MPEG4AudioSampleDescriptionBox;    
    var FileTypeBoxParser = (function (_super) {
        __extends(FileTypeBoxParser, _super);
        function FileTypeBoxParser() {
            _super.apply(this, arguments);

        }
        return FileTypeBoxParser;
    })(BoxParser);
    mp4.FileTypeBoxParser = FileTypeBoxParser;    
})(mp4 || (mp4 = {}));
