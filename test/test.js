var m4v;
var xml;
describe('Parser', function () {
    var tree = Mp4.parse(m4v);
    var finder = new Mp4.Finder(tree);
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
            var _finder = new Mp4.Finder(trak);
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
                                    return expect(mp4a.sampleRate).toBe(+$mp4a.attr('SampleRate'));
                                });
                                it('channel count', function () {
                                    return expect(mp4a.channelCount).toBe(+$mp4a.attr('Channels'));
                                });
                                it('sample size', function () {
                                    return expect(mp4a.sampleSize).toBe(+$mp4a.attr('BitsPerSample'));
                                });
                                describe('ESDescriptor', function () {
                                    var $esDescr = $mp4a.find('ES_Descriptor');
                                    var esDescr = mp4a.esBox.esDescr;
                                    it('es ID', function () {
                                        return expect(esDescr.esID).toBe(+$esDescr.attr('ES_ID')[2]);
                                    });
                                    describe('DecoderConfigDescriptor', function () {
                                        var $decConfigDescr = $esDescr.find('DecoderConfigDescriptor');
                                        var decConfigDescr = esDescr.decConfigDescr;
                                        it('object type indication', function () {
                                            return expect(decConfigDescr.objectTypeIndication).toBe(+$decConfigDescr.attr('objectTypeIndication'));
                                        });
                                        it('stream type', function () {
                                            return expect(decConfigDescr.streamType).toBe(+$decConfigDescr.attr('streamType'));
                                        });
                                        it('buffer size DB', function () {
                                            return expect(decConfigDescr.bufferSizeDB).toBe(+$decConfigDescr.attr('bufferSizeDB'));
                                        });
                                        it('max bitrate', function () {
                                            return expect(decConfigDescr.maxBitrate).toBe(+$decConfigDescr.attr('maxBitrate'));
                                        });
                                        it('avg bitrate', function () {
                                            return expect(decConfigDescr.avgBitrate).toBe(+$decConfigDescr.attr('avgBitrate'));
                                        });
                                        describe('DecoderSpecificInfo', function () {
                                            var $decSpecificInfo = $decConfigDescr.find('DecoderSpecificInfo');
                                            var decSpecificInfo = decConfigDescr.decSpecificInfo;
                                            it('data', function () {
                                                $decSpecificInfo.attr('src').match(/\d+/g).forEach(function (x, i) {
                                                    expect(decSpecificInfo.data[i]).toBe(parseInt(x, 16));
                                                });
                                            });
                                        });
                                        describe('SLConfigDescriptor', function () {
                                            var $slConfigDescr = $esDescr.find('SLConfigDescriptor');
                                            var slConfigDescr = esDescr.slConfigDescr;
                                            it('pre defined', function () {
                                                return expect(slConfigDescr.preDefined).toBe(+$slConfigDescr.find('predefined').attr('value'));
                                            });
                                        });
                                    });
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
            var _finder = new Mp4.Finder(trak);
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
    var tree = Mp4.parse(m4v);
    var finder = new Mp4.Finder(tree);
    describe('FileTypeBox', function () {
        var ftyp1 = finder.findOne(Mp4.BOX_TYPE_FILE_TYPE_BOX);
        ftyp1.bytes = null;
        var ftypBytes = new Mp4.Composer.FileTypeBoxComposer(ftyp1).compose();
        var ftyp2 = new Mp4.Parser.FileTypeBoxParser(ftypBytes).parse();
        it('major brand', function () {
            return expect(ftyp2.majorBrand).toBe(ftyp1.majorBrand);
        });
        it('minor version', function () {
            return expect(ftyp2.minorVersion).toBe(ftyp2.minorVersion);
        });
        it('compatible brands', function () {
            ftyp2.compatibleBrands.forEach(function (brand, i) {
                expect(brand).toBe(ftyp1.compatibleBrands[i]);
            });
        });
    });
    describe('MovieHeaderBox', function () {
        var mvhd1 = finder.findOne(Mp4.BOX_TYPE_MOVIE_HEADER_BOX);
        mvhd1.bytes = null;
        var mvhdBytes = new Mp4.Composer.MovieHeaderBoxComposer(mvhd1).compose();
        var mvhd2 = new Mp4.Parser.MovieHeaderBoxParser(mvhdBytes).parse();
        it('creation time', function () {
            return expect(mvhd2.creationTime).toBe(mvhd1.creationTime);
        });
        it('modification time', function () {
            return expect(mvhd2.modificationTime).toBe(mvhd1.modificationTime);
        });
        it('time scale', function () {
            return expect(mvhd2.timescale).toBe(mvhd1.timescale);
        });
        it('duration', function () {
            return expect(mvhd2.duration).toBe(mvhd1.duration);
        });
        it('next track id', function () {
            return expect(mvhd2.nextTrackID).toBe(mvhd1.nextTrackID);
        });
    });
    var audioTrack = finder.findAll(Mp4.BOX_TYPE_TRACK_BOX)[0];
    finder = new Mp4.Finder(audioTrack);
    describe('TrackHeaderBox', function () {
        var tkhd1 = finder.findOne(Mp4.BOX_TYPE_TRACK_HEADER_BOX);
        tkhd1.bytes = null;
        var tkhdBytes = new Mp4.Composer.TrackHeaderBoxComposer(tkhd1).compose();
        var tkhd2 = new Mp4.Parser.TrackHeaderBoxParser(tkhdBytes).parse();
        it('creation time', function () {
            return expect(tkhd2.creationTime).toBe(tkhd1.creationTime);
        });
        it('modification time', function () {
            return expect(tkhd2.modificationTime).toBe(tkhd1.modificationTime);
        });
        it('track id', function () {
            return expect(tkhd2.trackID).toBe(tkhd1.trackID);
        });
        it('duration', function () {
            return expect(tkhd2.duration).toBe(tkhd1.duration);
        });
        it('volume', function () {
            return expect(tkhd2.volume).toBe(tkhd1.volume);
        });
    });
    describe('MediaHeaderBox', function () {
        var mdhd1 = finder.findOne(Mp4.BOX_TYPE_MEDIA_HEADER_BOX);
        mdhd1.bytes = null;
        var mdhdBytes = new Mp4.Composer.MediaHeaderBoxComposer(mdhd1).compose();
        var mdhd2 = new Mp4.Parser.MediaHeaderBoxParser(mdhdBytes).parse();
        it('creation time', function () {
            return expect(mdhd2.creationTime).toBe(mdhd1.creationTime);
        });
        it('modification time', function () {
            return expect(mdhd2.modificationTime).toBe(mdhd1.creationTime);
        });
        it('timescale', function () {
            return expect(mdhd2.timescale).toBe(mdhd1.timescale);
        });
        it('duration', function () {
            return expect(mdhd2.duration).toBe(mdhd1.duration);
        });
        it('language', function () {
            return expect(mdhd2.language).toBe(mdhd1.language);
        });
    });
    describe('HandlerBox', function () {
        var hdlr1 = finder.findOne(Mp4.BOX_TYPE_HANDLER_BOX);
        hdlr1.bytes = null;
        var hdlrBytes = new Mp4.Composer.HandlerBoxComposer(hdlr1).compose();
        var hdlr2 = new Mp4.Parser.HandlerBoxParser(hdlrBytes).parse();
        it('handler type', function () {
            return expect(hdlr2.handlerType).toBe(hdlr1.handlerType);
        });
        it('name', function () {
            return expect(hdlr2.name).toBe(hdlr1.name);
        });
    });
    describe('DataReferenceBox', function () {
        var dref1 = finder.findOne(Mp4.BOX_TYPE_DATA_REFERENCE_BOX);
        dref1.bytes = null;
        var drefBytes = new Mp4.Composer.DataReferenceBoxComposer(dref1).compose();
        var dref2 = new Mp4.Parser.DataReferenceBoxParser(drefBytes).parse();
        it('entry count', function () {
            return expect(dref2.entryCount).toBe(dref1.entryCount);
        });
        describe('DataEntryUrlBox', function () {
            var url1 = dref1.entries[0];
            url1.bytes = null;
            var urlBytes = new Mp4.Composer.DataEntryUrlBoxComposer(url1).compose();
            var url2 = new Mp4.Parser.DataEntryUrlBoxParser(urlBytes).parse();
            it('location', function () {
                return expect(url2.location).toBe(url1.location);
            });
        });
    });
    describe('SampleDescriptionBox', function () {
        var stsd1 = finder.findOne(Mp4.BOX_TYPE_SAMPLE_DESCRIPTION_BOX);
        stsd1.bytes = null;
        var stsdBytes = new Mp4.Composer.SampleDescriptionBoxComposer(stsd1).compose();
        var stsd2 = new Mp4.Parser.SampleDescriptionBoxParser(stsdBytes).parse();
        it('entry count', function () {
            return expect(stsd1.entryCount).toBe(stsd2.entryCount);
        });
        describe('MP4AudioSampleEntry', function () {
            var mp4a1 = finder.findOne(Mp4.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY);
            mp4a1.bytes = null;
            var mp4aBytes = new Mp4.Composer.MP4AudioSampleEntryComposer(mp4a1).compose();
            var mp4a2 = new Mp4.Parser.MP4AudioSampleEntryParser(mp4aBytes).parse();
            it('data reference index', function () {
                return expect(mp4a2.dataReferenceIndex).toBe(mp4a1.dataReferenceIndex);
            });
            it('sample rate', function () {
                return expect(mp4a2.sampleRate).toBe(mp4a1.sampleRate);
            });
            it('sample size', function () {
                return expect(mp4a2.sampleSize).toBe(mp4a1.sampleSize);
            });
            describe('ESDescriptor', function () {
                var esDescr1 = mp4a1.esBox.esDescr;
                esDescr1.bytes = null;
                var esDescrBytes = new Mp4.Composer.ESDescriptorComposer(esDescr1).compose();
                var esDescr2 = new Mp4.Parser.ESDescriptorParser(esDescrBytes).parse();
                it('es ID', function () {
                    return expect(esDescr2.esID).toBe(esDescr1.esID);
                });
                describe('DecoderConfigDescriptor', function () {
                    var decConfigDescr1 = esDescr1.decConfigDescr;
                    decConfigDescr1.bytes = null;
                    var decConfigDescrBytes = new Mp4.Composer.DecoderConfigDescriptorComposer(decConfigDescr1).compose();
                    var decConfigDescr2 = new Mp4.Parser.DecoderConfigDescriptorParser(decConfigDescrBytes).parse();
                    it('object type indication', function () {
                        return expect(decConfigDescr2.objectTypeIndication).toBe(decConfigDescr1.objectTypeIndication);
                    });
                    it('stream type', function () {
                        return expect(decConfigDescr2.streamType).toBe(decConfigDescr1.streamType);
                    });
                    it('buffer size DB', function () {
                        return expect(decConfigDescr2.bufferSizeDB).toBe(decConfigDescr1.bufferSizeDB);
                    });
                    it('max bitrate', function () {
                        return expect(decConfigDescr2.maxBitrate).toBe(decConfigDescr1.maxBitrate);
                    });
                    it('avg bitrate', function () {
                        return expect(decConfigDescr2.avgBitrate).toBe(decConfigDescr1.avgBitrate);
                    });
                    describe('DecoderSpecificInfo', function () {
                        var decSpecificInfo1 = decConfigDescr1.decSpecificInfo;
                        decSpecificInfo1.bytes = null;
                        var decSpecificInfoBytes = new Mp4.Composer.DecoderSpecificInfoComposer(decSpecificInfo1).compose();
                        var decSpecificInfo2 = new Mp4.Parser.DecoderSpecificInfoParser(decSpecificInfoBytes).parse();
                        it('data', function () {
                            expect(decSpecificInfo2.data.length).toBe(decSpecificInfo1.data.length);
                            for(var i = 0; i < decSpecificInfo1.data.length; ++i) {
                                expect(decSpecificInfo2.data[i]).toBe(decSpecificInfo1.data[i]);
                            }
                        });
                    });
                });
                describe('SLConfigDescriptor', function () {
                    var slConfigDescr1 = esDescr1.slConfigDescr;
                    slConfigDescr1.bytes = null;
                    var slConfigDescrBytes = new Mp4.Composer.SLConfigDescriptorComposer(slConfigDescr1).compose();
                    var slConfigDescr2 = new Mp4.Parser.SLConfigDescriptorParser(slConfigDescrBytes).parse();
                    it('pre defined', function () {
                        return expect(slConfigDescr2.preDefined).toBe(slConfigDescr1.preDefined);
                    });
                });
            });
        });
    });
    describe('TimeToSampleBox', function () {
        var stts1 = finder.findOne(Mp4.BOX_TYPE_TIME_TO_SAMPLE_BOX);
        stts1.bytes = null;
        var sttsBytes = new Mp4.Composer.TimeToSampleBoxComposer(stts1).compose();
        var stts2 = new Mp4.Parser.TimeToSampleBoxParser(sttsBytes).parse();
        it('entry count', function () {
            return expect(stts2.entryCount).toBe(stts1.entryCount);
        });
        it('entries', function () {
            stts1.entries.forEach(function (entry, i) {
                expect(stts2.entries[i].sampleDelta).toBe(entry.sampleDelta);
                expect(stts2.entries[i].sampleCount).toBe(entry.sampleCount);
            });
        });
    });
    describe('SampleToChunkBox', function () {
        var stsc1 = finder.findOne(Mp4.BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
        stsc1.bytes = null;
        var stscBytes = new Mp4.Composer.SampleToChunkBoxComposer(stsc1).compose();
        var stsc2 = new Mp4.Parser.SampleToChunkBoxParser(stscBytes).parse();
        it('entry count', function () {
            return expect(stsc2.entryCount).toBe(stsc1.entryCount);
        });
        it('entries', function () {
            stsc1.entries.forEach(function (entry, i) {
                var e = stsc2.entries[i];
                expect(e.firstChunk).toBe(entry.firstChunk);
                expect(e.samplesPerChunk).toBe(entry.samplesPerChunk);
                expect(e.sampleDescriptionIndex).toBe(entry.sampleDescriptionIndex);
            });
        });
    });
    describe('SampleSizeBox', function () {
        var stsz1 = finder.findOne(Mp4.BOX_TYPE_SAMPLE_SIZE_BOX);
        stsz1.bytes = null;
        var stszBytes = new Mp4.Composer.SampleSizeBoxComposer(stsz1).compose();
        var stsz2 = new Mp4.Parser.SampleSizeBoxParser(stszBytes).parse();
        it('sample size', function () {
            return expect(stsz2.sampleSize).toBe(stsz1.sampleSize);
        });
        it('sample count', function () {
            return expect(stsz2.sampleCount).toBe(stsz1.sampleCount);
        });
        it('sample sizes', function () {
            stsz2.sampleSizes.forEach(function (size, i) {
                expect(size).toBe(stsz1.sampleSizes[i]);
            });
        });
    });
    describe('ChunkOffsetBox', function () {
        var stco1 = finder.findOne(Mp4.BOX_TYPE_CHUNK_OFFSET_BOX);
        stco1.bytes = null;
        var stcoBytes = new Mp4.Composer.ChunkOffsetBoxComposer(stco1).compose();
        var stco2 = new Mp4.Parser.ChunkOffsetBoxParser(stcoBytes).parse();
        it('entry count', function () {
            return expect(stco2.entryCount).toBe(stco1.entryCount);
        });
        it('entries', function () {
            stco2.chunkOffsets.forEach(function (chunkOffset, i) {
                expect(chunkOffset).toBe(stco1.chunkOffsets[i]);
            });
        });
    });
});
//@ sourceMappingURL=test.js.map
