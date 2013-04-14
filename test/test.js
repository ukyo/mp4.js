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
        describe('TrackBox 1(Audio Track)', function () {
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
                describe('HandlerBox', function () {
                    var $hdlr = $mdia.find('HandlerBox');
                    var hdlr = finder.findOne('hdlr');
                    var $info = $hdlr.find('BoxInfo');
                    var $fullinfo = $hdlr.find('FullBoxInfo');
                    it('size', function () {
                        return expect(hdlr.byteLength).toBe(+$info.attr('Size'));
                    });
                    it('version', function () {
                        return expect(hdlr.version).toBe(+$fullinfo.attr('Version'));
                    });
                    it('flags', function () {
                        return expect(hdlr.flags).toBe(+$fullinfo.attr('Flags'));
                    });
                    it('handler type', function () {
                        return expect(hdlr.handlerType).toBe($hdlr.attr('Type'));
                    });
                    it('name', function () {
                        return expect(hdlr.name).toBe($hdlr.attr('Name'));
                    });
                });
                describe('MediaInformationBox', function () {
                    var $minf = $mdia.find('MediaInformationBox');
                    var minf = finder.findOne('minf');
                    var $info = $minf.find('BoxInfo');
                    it('size', function () {
                        return expect(minf.byteLength).toBe(+$info.attr('Size'));
                    });
                    describe('SoundMediaHeaderBox', function () {
                        var $smhd = $minf.find('SoundMediaHeaderBox');
                        var smhd = finder.findOne('smhd');
                        var $info = $smhd.find('BoxInfo');
                        var $fullinfo = $smhd.find('FullBoxInfo');
                        it('size', function () {
                            return expect(smhd.byteLength).toBe(+$info.attr('Size'));
                        });
                        it('version', function () {
                            return expect(smhd.version).toBe(+$fullinfo.attr('Version'));
                        });
                        it('flags', function () {
                            return expect(smhd.flags).toBe(+$fullinfo.attr('Flags'));
                        });
                    });
                    describe('DataInformationBox', function () {
                        var $dinf = $minf.find('DataInformationBox');
                        var dinf = finder.findOne('dinf');
                        var $info = $dinf.find('BoxInfo');
                        it('size', function () {
                            return expect(dinf.byteLength).toBe(+$info.attr('Size'));
                        });
                        describe('DataReferenceBox', function () {
                            var $dref = $dinf.find('DataReferenceBox');
                            var dref = finder.findOne('dref');
                            var $info = $dref.find('BoxInfo');
                            var $fullinfo = $dref.find('FullBoxInfo');
                            it('size', function () {
                                return expect(dref.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(dref.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(dref.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            describe('URLDataEntryBox', function () {
                                var $url = $dref.find('URLDataEntryBox');
                                var url = finder.findOne('url ');
                                var $info = $url.find('BoxInfo');
                                var $fullinfo = $url.find('FullBoxInfo');
                                it('size', function () {
                                    return expect(url.byteLength).toBe(+$info.attr('Size'));
                                });
                                it('version', function () {
                                    return expect(url.version).toBe(+$fullinfo.attr('Version'));
                                });
                                it('flags', function () {
                                    return expect(url.flags).toBe(+$fullinfo.attr('Flags'));
                                });
                            });
                        });
                    });
                    describe('SampleTableBox', function () {
                        var $stbl = $mdia.find('SampleTableBox');
                        var stbl = finder.findOne('stbl');
                        var $info = $stbl.find('BoxInfo');
                        it('size', function () {
                            return expect(stbl.byteLength).toBe(+$info.attr('Size'));
                        });
                        describe('SampleDescriptionBox', function () {
                            var $stsd = $stbl.find('SampleDescriptionBox');
                            var stsd = finder.findOne('stsd');
                            var $info = $stsd.find('BoxInfo');
                            var $fullinfo = $stsd.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsd.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsd.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsd.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            describe('MP4AudioSampleEntry', function () {
                                var $mp4a = $stsd.find('MPEGAudioSampleDescriptionBox');
                                var mp4a = finder.findOne('mp4a');
                                var $info = $mp4a.find('BoxInfo');
                                it('size', function () {
                                    return expect(mp4a.byteLength).toBe(+$info.attr('Size'));
                                });
                                it('data reference index', function () {
                                    return expect(mp4a.dataReferenceIndex).toBe(+$mp4a.attr('DataReferenceIndex'));
                                });
                                it('sample rate', function () {
                                    return expect(mp4a.samplerate).toBe(+$mp4a.attr('SampleRate'));
                                });
                                it('channel count', function () {
                                    return expect(mp4a.channelcount).toBe(+$mp4a.attr('Channels'));
                                });
                                it('sample size', function () {
                                    return expect(mp4a.samplesize).toBe(+$mp4a.attr('BitsPerSample'));
                                });
                            });
                        });
                        describe('TimeToSampleBox', function () {
                            var $stts = $stbl.find('TimeToSampleBox');
                            var stts = finder.findOne('stts');
                            var $info = $stts.find('BoxInfo');
                            var $fullinfo = $stts.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stts.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stts.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stts.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('entries', function () {
                                $stts.find('TimeToSampleEntry').map(function (i, el) {
                                    var $el = $(el);
                                    expect(stts.entries[i].sampleCount).toBe(+$el.attr('SampleCount'));
                                    expect(stts.entries[i].sampleDelta).toBe(+$el.attr('SampleDelta'));
                                });
                            });
                        });
                        describe('SampleToChunkBox', function () {
                            var $stsc = $stbl.find('SampleToChunkBox');
                            var stsc = finder.findOne('stsc');
                            var $info = $stsc.find('BoxInfo');
                            var $fullinfo = $stsc.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsc.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsc.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsc.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('entries', function () {
                                $stsc.find('SampleToChunkEntry').map(function (i, el) {
                                    var $el = $(el);
                                    expect(stsc.entries[i].firstChunk).toBe(+$el.attr('FirstChunk'));
                                    expect(stsc.entries[i].samplesPerChunk).toBe(+$el.attr('SamplesPerChunk'));
                                    expect(stsc.entries[i].sampleDescriptionIndex).toBe(+$el.attr('SampleDescriptionIndex'));
                                });
                            });
                        });
                        describe('SampleSizeBox', function () {
                            var $stsz = $stbl.find('SampleSizeBox');
                            var stsz = finder.findOne('stsz');
                            var $info = $stsz.find('BoxInfo');
                            var $fullinfo = $stsz.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsz.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsz.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsz.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('sample sizes', function () {
                                $stsz.find('SampleSizeEntry').map(function (i, el) {
                                    expect(stsz.sampleSizes[i]).toBe(+$(el).attr('Size'));
                                });
                            });
                        });
                        describe('ChunkOffsetBox', function () {
                            var $stco = $stbl.find('ChunkOffsetBox');
                            var stco = finder.findOne('stco');
                            var $info = $stco.find('BoxInfo');
                            var $fullinfo = $stco.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stco.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stco.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stco.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('chunk offsets', function () {
                                $stco.find('ChunkEntry').map(function (i, el) {
                                    expect(stco.chunkOffsets[i]).toBe(+$(el).attr('offset'));
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('TrackBox 2(Video Track)', function () {
            var $trak = $moov.find('TrackBox:nth(1)');
            var trak = finder.findAll('trak')[1];
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
                it('width', function () {
                    return expect(tkhd.width).toBe(+$tkhd.attr('Width'));
                });
                it('height', function () {
                    return expect(tkhd.height).toBe(+$tkhd.attr('Height'));
                });
                it('matrix', function () {
                    var $matrix = $tkhd.find('Matrix');
                    expect(tkhd.matrix[0]).toBe(+$matrix.attr('m11'));
                    expect(tkhd.matrix[1]).toBe(+$matrix.attr('m12'));
                    expect(tkhd.matrix[2]).toBe(+$matrix.attr('m13'));
                    expect(tkhd.matrix[3]).toBe(+$matrix.attr('m21'));
                    expect(tkhd.matrix[4]).toBe(+$matrix.attr('m22'));
                    expect(tkhd.matrix[5]).toBe(+$matrix.attr('m23'));
                    expect(tkhd.matrix[6]).toBe(+$matrix.attr('m31'));
                    expect(tkhd.matrix[7]).toBe(+$matrix.attr('m32'));
                    expect(tkhd.matrix[8]).toBe(+$matrix.attr('m33'));
                });
            });
            describe('EditBox', function () {
                var $edts = $trak.find('EditBox');
                var edts = finder.findOne('edts');
                var $info = $edts.find('BoxInfo');
                it('size', function () {
                    return expect(edts.byteLength).toBe(+$info.attr('Size'));
                });
                describe('EditListBox', function () {
                    var $elst = $edts.find('EditListBox');
                    var elst = finder.findOne('elst');
                    var $info = $elst.find('BoxInfo');
                    var $fullinfo = $elst.find('FullBoxInfo');
                    it('size', function () {
                        return expect(elst.byteLength).toBe(+$info.attr('Size'));
                    });
                    it('version', function () {
                        return expect(elst.version).toBe(+$fullinfo.attr('Version'));
                    });
                    it('flags', function () {
                        return expect(elst.flags).toBe(+$fullinfo.attr('Flags'));
                    });
                    it('entries', function () {
                        $elst.find('EditListEntry').map(function (i, el) {
                            var $el = $(el);
                            expect(elst.entries[i].sagmentDuration).toBe(+$el.attr('Duration'));
                            expect(elst.entries[i].mediaTime).toBe(+$el.attr('MediaTime'));
                            expect(elst.entries[i].mediaRateInteger).toBe(+$el.attr('MediaRate'));
                        });
                    });
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
                describe('HandlerBox', function () {
                    var $hdlr = $mdia.find('HandlerBox');
                    var hdlr = finder.findOne('hdlr');
                    var $info = $hdlr.find('BoxInfo');
                    var $fullinfo = $hdlr.find('FullBoxInfo');
                    it('size', function () {
                        return expect(hdlr.byteLength).toBe(+$info.attr('Size'));
                    });
                    it('version', function () {
                        return expect(hdlr.version).toBe(+$fullinfo.attr('Version'));
                    });
                    it('flags', function () {
                        return expect(hdlr.flags).toBe(+$fullinfo.attr('Flags'));
                    });
                    it('handler type', function () {
                        return expect(hdlr.handlerType).toBe($hdlr.attr('Type'));
                    });
                    it('name', function () {
                        return expect(hdlr.name).toBe($hdlr.attr('Name'));
                    });
                });
                describe('MediaInformationBox', function () {
                    var $minf = $mdia.find('MediaInformationBox');
                    var minf = finder.findOne('minf');
                    var $info = $minf.find('BoxInfo');
                    it('size', function () {
                        return expect(minf.byteLength).toBe(+$info.attr('Size'));
                    });
                    describe('DataInformationBox', function () {
                        var $dinf = $minf.find('DataInformationBox');
                        var dinf = finder.findOne('dinf');
                        var $info = $dinf.find('BoxInfo');
                        it('size', function () {
                            return expect(dinf.byteLength).toBe(+$info.attr('Size'));
                        });
                        describe('DataReferenceBox', function () {
                            var $dref = $dinf.find('DataReferenceBox');
                            var dref = finder.findOne('dref');
                            var $info = $dref.find('BoxInfo');
                            var $fullinfo = $dref.find('FullBoxInfo');
                            it('size', function () {
                                return expect(dref.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(dref.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(dref.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            describe('URLDataEntryBox', function () {
                                var $url = $dref.find('URLDataEntryBox');
                                var url = finder.findOne('url ');
                                var $info = $url.find('BoxInfo');
                                var $fullinfo = $url.find('FullBoxInfo');
                                it('size', function () {
                                    return expect(url.byteLength).toBe(+$info.attr('Size'));
                                });
                                it('version', function () {
                                    return expect(url.version).toBe(+$fullinfo.attr('Version'));
                                });
                                it('flags', function () {
                                    return expect(url.flags).toBe(+$fullinfo.attr('Flags'));
                                });
                            });
                        });
                    });
                    describe('SampleTableBox', function () {
                        var $stbl = $mdia.find('SampleTableBox');
                        var stbl = finder.findOne('stbl');
                        var $info = $stbl.find('BoxInfo');
                        it('size', function () {
                            return expect(stbl.byteLength).toBe(+$info.attr('Size'));
                        });
                        describe('SampleDescriptionBox', function () {
                            var $stsd = $stbl.find('SampleDescriptionBox');
                            var stsd = finder.findOne('stsd');
                            var $info = $stsd.find('BoxInfo');
                            var $fullinfo = $stsd.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsd.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsd.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsd.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                        });
                        describe('TimeToSampleBox', function () {
                            var $stts = $stbl.find('TimeToSampleBox');
                            var stts = finder.findOne('stts');
                            var $info = $stts.find('BoxInfo');
                            var $fullinfo = $stts.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stts.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stts.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stts.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('entries', function () {
                                $stts.find('TimeToSampleEntry').map(function (i, el) {
                                    var $el = $(el);
                                    expect(stts.entries[i].sampleCount).toBe(+$el.attr('SampleCount'));
                                    expect(stts.entries[i].sampleDelta).toBe(+$el.attr('SampleDelta'));
                                });
                            });
                        });
                        describe('SampleToChunkBox', function () {
                            var $stsc = $stbl.find('SampleToChunkBox');
                            var stsc = finder.findOne('stsc');
                            var $info = $stsc.find('BoxInfo');
                            var $fullinfo = $stsc.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsc.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsc.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsc.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('entries', function () {
                                $stsc.find('SampleToChunkEntry').map(function (i, el) {
                                    var $el = $(el);
                                    expect(stsc.entries[i].firstChunk).toBe(+$el.attr('FirstChunk'));
                                    expect(stsc.entries[i].samplesPerChunk).toBe(+$el.attr('SamplesPerChunk'));
                                    expect(stsc.entries[i].sampleDescriptionIndex).toBe(+$el.attr('SampleDescriptionIndex'));
                                });
                            });
                        });
                        describe('SampleSizeBox', function () {
                            var $stsz = $stbl.find('SampleSizeBox');
                            var stsz = finder.findOne('stsz');
                            var $info = $stsz.find('BoxInfo');
                            var $fullinfo = $stsz.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stsz.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stsz.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stsz.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('sample sizes', function () {
                                $stsz.find('SampleSizeEntry').map(function (i, el) {
                                    expect(stsz.sampleSizes[i]).toBe(+$(el).attr('Size'));
                                });
                            });
                        });
                        describe('ChunkOffsetBox', function () {
                            var $stco = $stbl.find('ChunkOffsetBox');
                            var stco = finder.findOne('stco');
                            var $info = $stco.find('BoxInfo');
                            var $fullinfo = $stco.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stco.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stco.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stco.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('chunk offsets', function () {
                                $stco.find('ChunkEntry').map(function (i, el) {
                                    expect(stco.chunkOffsets[i]).toBe(+$(el).attr('offset'));
                                });
                            });
                        });
                        describe('SyncSampleBox', function () {
                            var $stss = $stbl.find('SyncSampleBox');
                            var stss = finder.findOne('stss');
                            var $info = $stss.find('BoxInfo');
                            var $fullinfo = $stss.find('FullBoxInfo');
                            it('size', function () {
                                return expect(stss.byteLength).toBe(+$info.attr('Size'));
                            });
                            it('version', function () {
                                return expect(stss.version).toBe(+$fullinfo.attr('Version'));
                            });
                            it('flags', function () {
                                return expect(stss.flags).toBe(+$fullinfo.attr('Flags'));
                            });
                            it('sample numbers', function () {
                                $stss.find('SyncSampleEntry').map(function (i, el) {
                                    expect(stss.sampleNumbers[i]).toBe(+$(el).attr('sampleNumber'));
                                });
                            });
                        });
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
describe('Composer', function () {
});
//@ sourceMappingURL=test.js.map
