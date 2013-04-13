var m4v;
var xml;
describe('Parser', function () {
    var tree = mp4.parse(m4v);
    var finder = new mp4.Finder(tree);
    var $xml = $(xml);
    describe('FileTypeBox', function () {
        var $ftyp = $xml.find('FileTypeBox');
        var ftyp = finder.findOne('ftyp');
        var $info = $ftyp.find('BoxInfo');
        it('size', function () {
            return expect(ftyp.byteLength).toBe(+$info.attr('Size'));
        });
        it('major brand', function () {
            return expect(ftyp.majorBrand).toBe($ftyp.attr('MajorBrand'));
        });
        it('minor version', function () {
            return expect(ftyp.minorVersion).toBe(+$ftyp.attr('MinorVersion'));
        });
        it('compatible brands', function () {
            $ftyp.find('BrandEntry').map(function (i, el) {
                expect(ftyp.compatibleBrands[i]).toBe($(el).attr('AlternateBrand'));
            });
        });
    });
    describe('MovieBox', function () {
        var $moov = $xml.find('MovieBox');
        var moov = finder.findOne('moov');
        var $info = $moov.find('BoxInfo');
        it('size', function () {
            return expect(moov.byteLength).toBe(+$info.attr('Size'));
        });
        describe('MovieHeaderBox', function () {
            var $mvhd = $moov.find('MovieHeaderBox');
            var mvhd = finder.findOne('mvhd');
            var $info = $mvhd.find('BoxInfo');
            var $fullinfo = $mvhd.find('FullBoxInfo');
            it('size', function () {
                return expect(mvhd.byteLength).toBe(+$info.attr('Size'));
            });
            it('version', function () {
                return expect(mvhd.version).toBe(+$fullinfo.attr('Version'));
            });
            it('flags', function () {
                return expect(mvhd.flags).toBe(+$fullinfo.attr('Flags'));
            });
            it('creation time', function () {
                return expect(mvhd.creationTime).toBe(+$mvhd.attr('CreationTime'));
            });
            it('modification time', function () {
                return expect(mvhd.modificationTime).toBe(+$mvhd.attr('ModificationTime'));
            });
            it('time scale', function () {
                return expect(mvhd.timescale).toBe(+$mvhd.attr('TimeScale'));
            });
            it('duration', function () {
                return expect(mvhd.duration).toBe(+$mvhd.attr('Duration'));
            });
            it('next track id', function () {
                return expect(mvhd.nextTrackID).toBe(+$mvhd.attr('NextTrackID'));
            });
        });
        describe('TrackBox 1', function () {
            var $trak = $moov.find('TrackBox:nth(0)');
            var trak = finder.findOne('trak');
            var $info = $trak.find('BoxInfo');
            it('size', function () {
                return expect(trak.byteLength).toBe(+$info.attr('Size'));
            });
            var _finder = new mp4.Finder(trak);
            describe('TrackHeaderBox', function () {
                var finder = _finder;
                var $tkhd = $trak.find('TrackHeaderBox');
                var tkhd = finder.findOne('tkhd');
                var $info = $tkhd.find('BoxInfo');
                var $fullinfo = $tkhd.find('FullBoxInfo');
                it('size', function () {
                    return expect(tkhd.byteLength).toBe(+$info.attr('Size'));
                });
                it('version', function () {
                    return expect(tkhd.version).toBe(+$fullinfo.attr('Version'));
                });
                it('flags', function () {
                    return expect(tkhd.flags).toBe(+$fullinfo.attr('Flags'));
                });
                it('creation time', function () {
                    return expect(tkhd.creationTime).toBe(+$tkhd.attr('CreationTime'));
                });
                it('modifiction time', function () {
                    return expect(tkhd.modificationTime).toBe(+$tkhd.attr('ModificationTime'));
                });
                it('track id', function () {
                    return expect(tkhd.trackID).toBe(+$tkhd.attr('TrackID'));
                });
                it('duration', function () {
                    return expect(tkhd.duration).toBe(+$tkhd.attr('Duration'));
                });
                it('volume', function () {
                    return expect(tkhd.volume).toBe(+$tkhd.attr('Volume'));
                });
            });
            describe('MediaBox', function () {
                var finder = _finder;
                var $mdia = $trak.find('MediaBox');
                var mdia = finder.findOne('mdia');
                var $info = $mdia.find('BoxInfo');
                it('size', function () {
                    return expect(mdia.byteLength).toBe(+$info.attr('Size'));
                });
                describe('MediaHeaderBox', function () {
                    var $mdhd = $mdia.find('MediaHeaderBox');
                    var mdhd = finder.findOne('mdhd');
                    var $info = $mdhd.find('BoxInfo');
                    var $fullinfo = $mdhd.find('FullBoxInfo');
                    it('size', function () {
                        return expect(mdhd.byteLength).toBe(+$info.attr('Size'));
                    });
                    it('version', function () {
                        return expect(mdhd.version).toBe(+$fullinfo.attr('Version'));
                    });
                    it('flags', function () {
                        return expect(mdhd.flags).toBe(+$fullinfo.attr('Flags'));
                    });
                    it('creation time', function () {
                        return expect(mdhd.creationTime).toBe(+$mdhd.attr('CreationTime'));
                    });
                    it('modification time', function () {
                        return expect(mdhd.modificationTime).toBe(+$mdhd.attr('ModificationTime'));
                    });
                    it('timescale', function () {
                        return expect(mdhd.timescale).toBe(+$mdhd.attr('TimeScale'));
                    });
                    it('duration', function () {
                        return expect(mdhd.duration).toBe(+$mdhd.attr('Duration'));
                    });
                    it('language', function () {
                        return expect(mdhd.language).toBe($mdhd.attr('LanguageCode'));
                    });
                });
            });
        });
    });
    describe('MediaDataBox', function () {
        var $mdat = $xml.find('MediaDataBox');
        var mdat = finder.findOne('mdat');
        var $info = $mdat.find('BoxInfo');
        it('size', function () {
            return expect(mdat.byteLength).toBe(+$info.attr('Size'));
        });
    });
});
//@ sourceMappingURL=test.js.map
