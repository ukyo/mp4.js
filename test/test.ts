/// <reference path="../src/mp4.ts" />
/// <reference path="../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../d.ts/DefinitelyTyped/jasmine/jasmine.d.ts" />


var m4v: Uint8Array;
var xml: string;

describe('Parser', () => {
  var tree = Mp4.parse(m4v);
  var finder = new Mp4.Finder(tree);
  var $xml = $(xml);


  describe('FileTypeBox', () => {
    var $ftyp = $xml.find('FileTypeBox');
    var ftyp = <Mp4.IFileTypeBox>finder.findOne('ftyp');
    var $info = $ftyp.find('BoxInfo');

    it('size', () => expect(ftyp.byteLength).toBe(+$info.attr('Size')));
    it('major brand', () => expect(ftyp.majorBrand).toBe($ftyp.attr('MajorBrand')));
    it('minor version', () => expect(ftyp.minorVersion).toBe(+$ftyp.attr('MinorVersion')));
    it('compatible brands', () => {
      $ftyp.find('BrandEntry').map((i, el) => {
        expect(ftyp.compatibleBrands[i]).toBe($(el).attr('AlternateBrand'));
      });
    });
  });


  describe('MovieBox', () => {
    var $moov = $xml.find('MovieBox');
    var moov = <Mp4.IMovieBox>finder.findOne('moov');
    var $info = $moov.find('BoxInfo');

    it('size', () => expect(moov.byteLength).toBe(+$info.attr('Size')));

    describe('MovieHeaderBox', () => {
      var $mvhd = $moov.find('MovieHeaderBox');
      var mvhd = <Mp4.IMovieHeaderBox>finder.findOne('mvhd');
      var $info = $mvhd.find('BoxInfo');
      var $fullinfo = $mvhd.find('FullBoxInfo');

      it('size', () => expect(mvhd.byteLength).toBe(+$info.attr('Size')));
      it('version', () => expect(mvhd.version).toBe(+$fullinfo.attr('Version')));
      it('flags', () => expect(mvhd.flags).toBe(+$fullinfo.attr('Flags')));
      it('creation time', () => expect(mvhd.creationTime).toBe(+$mvhd.attr('CreationTime')));
      it('modification time', () => expect(mvhd.modificationTime).toBe(+$mvhd.attr('ModificationTime')));
      it('time scale', () => expect(mvhd.timescale).toBe(+$mvhd.attr('TimeScale')));
      it('duration', () => expect(mvhd.duration).toBe(+$mvhd.attr('Duration')));
      it('next track id', () => expect(mvhd.nextTrackID).toBe(+$mvhd.attr('NextTrackID')));
    });

    describe('TrackBox 1(Audio Track)', () => {
      var $trak = $moov.find('TrackBox:nth(0)');
      var trak = <Mp4.ITrackBox>finder.findOne('trak');
      var $info = $trak.find('BoxInfo');

      it('size', () => expect(trak.byteLength).toBe(+$info.attr('Size')));

      var _finder = new Mp4.Finder(trak);

      describe('TrackHeaderBox', () => {
        var finder = _finder;
        var $tkhd = $trak.find('TrackHeaderBox');
        var tkhd = <Mp4.ITrackHeaderBox>finder.findOne('tkhd');
        var $info = $tkhd.find('BoxInfo');
        var $fullinfo = $tkhd.find('FullBoxInfo');

        it('size', () => expect(tkhd.byteLength).toBe(+$info.attr('Size')));
        it('version', () => expect(tkhd.version).toBe(+$fullinfo.attr('Version')));
        it('flags', () => expect(tkhd.flags).toBe(+$fullinfo.attr('Flags')));
        it('creation time', () => expect(tkhd.creationTime).toBe(+$tkhd.attr('CreationTime')));
        it('modifiction time', () => expect(tkhd.modificationTime).toBe(+$tkhd.attr('ModificationTime')));
        it('track id', () => expect(tkhd.trackID).toBe(+$tkhd.attr('TrackID')));
        it('duration', () => expect(tkhd.duration).toBe(+$tkhd.attr('Duration')));
        it('volume', () => expect(tkhd.volume).toBe(+$tkhd.attr('Volume')));
      });

      describe('MediaBox', () => {
        var finder = _finder;
        var $mdia = $trak.find('MediaBox');
        var mdia = <Mp4.IMediaBox>finder.findOne('mdia');
        var $info = $mdia.find('BoxInfo');

        it('size', () => expect(mdia.byteLength).toBe(+$info.attr('Size')));

        describe('MediaHeaderBox', () => {
          var $mdhd = $mdia.find('MediaHeaderBox');
          var mdhd = <Mp4.IMediaHeaderBox>finder.findOne('mdhd');
          var $info = $mdhd.find('BoxInfo');
          var $fullinfo = $mdhd.find('FullBoxInfo');

          it('size', () => expect(mdhd.byteLength).toBe(+$info.attr('Size')));
          it('version', () => expect(mdhd.version).toBe(+$fullinfo.attr('Version')));
          it('flags', () => expect(mdhd.flags).toBe(+$fullinfo.attr('Flags')));
          it('creation time', () => expect(mdhd.creationTime).toBe(+$mdhd.attr('CreationTime')));
          it('modification time', () => expect(mdhd.modificationTime).toBe(+$mdhd.attr('ModificationTime')));
          it('timescale', () => expect(mdhd.timescale).toBe(+$mdhd.attr('TimeScale')));
          it('duration', () => expect(mdhd.duration).toBe(+$mdhd.attr('Duration')));
          it('language', () => expect(mdhd.language).toBe($mdhd.attr('LanguageCode')));
        });

        describe('HandlerBox', () => {
          var $hdlr = $mdia.find('HandlerBox');
          var hdlr = <Mp4.IHandlerBox>finder.findOne('hdlr');
          var $info = $hdlr.find('BoxInfo');
          var $fullinfo = $hdlr.find('FullBoxInfo');

          it('size', () => expect(hdlr.byteLength).toBe(+$info.attr('Size')));
          it('version', () => expect(hdlr.version).toBe(+$fullinfo.attr('Version')));
          it('flags', () => expect(hdlr.flags).toBe(+$fullinfo.attr('Flags')));
          it('handler type', () => expect(hdlr.handlerType).toBe($hdlr.attr('Type')));
          it('name', () => expect(hdlr.name).toBe($hdlr.attr('Name')));

        });

        describe('MediaInformationBox', () => {
          var $minf = $mdia.find('MediaInformationBox');
          var minf = <Mp4.IMediaInformationBox>finder.findOne('minf');
          var $info = $minf.find('BoxInfo');

          it('size', () => expect(minf.byteLength).toBe(+$info.attr('Size')));

          describe('SoundMediaHeaderBox', () => {
            var $smhd = $minf.find('SoundMediaHeaderBox');
            var smhd = <Mp4.ISoundMediaHeaderBox>finder.findOne('smhd');
            var $info = $smhd.find('BoxInfo');
            var $fullinfo = $smhd.find('FullBoxInfo');

            it('size', () => expect(smhd.byteLength).toBe(+$info.attr('Size')));
            it('version', () => expect(smhd.version).toBe(+$fullinfo.attr('Version')));
            it('flags', () => expect(smhd.flags).toBe(+$fullinfo.attr('Flags')));
          });

          describe('DataInformationBox', () => {
            var $dinf = $minf.find('DataInformationBox');
            var dinf = <Mp4.IDataInformationBox>finder.findOne('dinf');
            var $info = $dinf.find('BoxInfo');

            it('size', () => expect(dinf.byteLength).toBe(+$info.attr('Size')));

            describe('DataReferenceBox', () => {
              var $dref = $dinf.find('DataReferenceBox');
              var dref = <Mp4.IDataReferenceBox>finder.findOne('dref');
              var $info = $dref.find('BoxInfo');
              var $fullinfo = $dref.find('FullBoxInfo');

              it('size', () => expect(dref.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(dref.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(dref.flags).toBe(+$fullinfo.attr('Flags')));

              describe('URLDataEntryBox', () => {
                var $url = $dref.find('URLDataEntryBox');
                var url = <Mp4.IDataEntryUrlBox>finder.findOne('url ');
                var $info = $url.find('BoxInfo');
                var $fullinfo = $url.find('FullBoxInfo');

                it('size', () => expect(url.byteLength).toBe(+$info.attr('Size')));
                it('version', () => expect(url.version).toBe(+$fullinfo.attr('Version')));
                it('flags', () => expect(url.flags).toBe(+$fullinfo.attr('Flags')));
              });
            });
          });

          describe('SampleTableBox', () => {
            var $stbl = $mdia.find('SampleTableBox');
            var stbl = <Mp4.ISampleTableBox>finder.findOne('stbl');
            var $info = $stbl.find('BoxInfo');

            it('size', () => expect(stbl.byteLength).toBe(+$info.attr('Size')));

            describe('SampleDescriptionBox', () => {
              var $stsd = $stbl.find('SampleDescriptionBox');
              var stsd = <Mp4.ISampleDescriptionBox>finder.findOne('stsd');
              var $info = $stsd.find('BoxInfo');
              var $fullinfo = $stsd.find('FullBoxInfo');

              it('size', () => expect(stsd.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsd.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsd.flags).toBe(+$fullinfo.attr('Flags')));

              describe('MP4AudioSampleEntry', () => {
                var $mp4a = $stsd.find('MPEGAudioSampleDescriptionBox');
                var mp4a = <Mp4.IMP4AudioSampleEntry>finder.findOne('mp4a');
                var $info = $mp4a.find('BoxInfo');

                it('size', () => expect(mp4a.byteLength).toBe(+$info.attr('Size')));
                it('data reference index', () => expect(mp4a.dataReferenceIndex).toBe(+$mp4a.attr('DataReferenceIndex')));
                it('sample rate', () => expect(mp4a.sampleRate).toBe(+$mp4a.attr('SampleRate')));
                it('channel count', () => expect(mp4a.channelCount).toBe(+$mp4a.attr('Channels')));
                it('sample size', () => expect(mp4a.sampleSize).toBe(+$mp4a.attr('BitsPerSample')));

                describe('ESDescriptor', () => {
                  var $esDescr = $mp4a.find('ES_Descriptor');
                  var esDescr=mp4a.esBox.esDescr;

                  it('es ID', () => expect(esDescr.esID).toBe(+$esDescr.attr('ES_ID')[2]));
                  
                  describe('DecoderConfigDescriptor', () => {
                    var $decConfigDescr = $esDescr.find('DecoderConfigDescriptor');
                    var decConfigDescr = esDescr.decConfigDescr;

                    it('object type indication', () => expect(decConfigDescr.objectTypeIndication).toBe(+$decConfigDescr.attr('objectTypeIndication')));
                    it('stream type', () => expect(decConfigDescr.streamType).toBe(+$decConfigDescr.attr('streamType')));
                    it('buffer size DB', () => expect(decConfigDescr.bufferSizeDB).toBe(+$decConfigDescr.attr('bufferSizeDB')));
                    it('max bitrate', () => expect(decConfigDescr.maxBitrate).toBe(+$decConfigDescr.attr('maxBitrate')));
                    it('avg bitrate', () => expect(decConfigDescr.avgBitrate).toBe(+$decConfigDescr.attr('avgBitrate')));

                    describe('DecoderSpecificInfo', () => {
                      var $decSpecificInfo = $decConfigDescr.find('DecoderSpecificInfo');
                      var decSpecificInfo = decConfigDescr.decSpecificInfo;

                      it('data', () => {
                        $decSpecificInfo.attr('src').match(/\d+/g).forEach((x, i) => {
                          expect(decSpecificInfo.data[i]).toBe(parseInt(x, 16));
                        });
                      });
                    });

                    describe('SLConfigDescriptor', () => {
                      var $slConfigDescr = $esDescr.find('SLConfigDescriptor');
                      var slConfigDescr = esDescr.slConfigDescr;

                      it('pre defined', () => expect(slConfigDescr.preDefined).toBe(+$slConfigDescr.find('predefined').attr('value')));
                    });
                  });
                });
              });
            });

            describe('TimeToSampleBox', () => {
              var $stts = $stbl.find('TimeToSampleBox');
              var stts = <Mp4.ITimeToSampleBox>finder.findOne('stts');
              var $info = $stts.find('BoxInfo');
              var $fullinfo = $stts.find('FullBoxInfo');

              it('size', () => expect(stts.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stts.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stts.flags).toBe(+$fullinfo.attr('Flags')));
              it('entries', () => {
                $stts.find('TimeToSampleEntry').map((i, el) => {
                  var $el = $(el);
                  expect(stts.entries[i].sampleCount).toBe(+$el.attr('SampleCount'));
                  expect(stts.entries[i].sampleDelta).toBe(+$el.attr('SampleDelta'));
                });
              });
            });

            describe('SampleToChunkBox', () => {
              var $stsc = $stbl.find('SampleToChunkBox');
              var stsc = <Mp4.ISampleToChunkBox>finder.findOne('stsc');
              var $info = $stsc.find('BoxInfo');
              var $fullinfo = $stsc.find('FullBoxInfo');

              it('size', () => expect(stsc.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsc.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsc.flags).toBe(+$fullinfo.attr('Flags')));
              it('entries', () => {
                $stsc.find('SampleToChunkEntry').map((i, el) => {
                  var $el = $(el);
                  expect(stsc.entries[i].firstChunk).toBe(+$el.attr('FirstChunk'));
                  expect(stsc.entries[i].samplesPerChunk).toBe(+$el.attr('SamplesPerChunk'));
                  expect(stsc.entries[i].sampleDescriptionIndex).toBe(+$el.attr('SampleDescriptionIndex'));
                });
              });
            });

            describe('SampleSizeBox', () => {
              var $stsz = $stbl.find('SampleSizeBox');
              var stsz = <Mp4.ISampleSizeBox>finder.findOne('stsz');
              var $info = $stsz.find('BoxInfo');
              var $fullinfo = $stsz.find('FullBoxInfo');

              it('size', () => expect(stsz.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsz.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsz.flags).toBe(+$fullinfo.attr('Flags')));
              it('sample sizes', () => {
                $stsz.find('SampleSizeEntry').map((i, el) => {
                  expect(stsz.sampleSizes[i]).toBe(+$(el).attr('Size'));
                });
              });
            });

            describe('ChunkOffsetBox', () => {
              var $stco = $stbl.find('ChunkOffsetBox');
              var stco = <Mp4.IChunkOffsetBox>finder.findOne('stco');
              var $info = $stco.find('BoxInfo');
              var $fullinfo = $stco.find('FullBoxInfo');

              it('size', () => expect(stco.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stco.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stco.flags).toBe(+$fullinfo.attr('Flags')));
              it('chunk offsets', () => {
                $stco.find('ChunkEntry').map((i, el) => {
                  expect(stco.chunkOffsets[i]).toBe(+$(el).attr('offset'));
                });
              });
            });
          });
        });
      });
    });


    describe('TrackBox 2(Video Track)', () => {
      var $trak = $moov.find('TrackBox:nth(1)');
      var trak = <Mp4.ITrackBox>finder.findAll('trak')[1];
      var $info = $trak.find('BoxInfo');

      it('size', () => expect(trak.byteLength).toBe(+$info.attr('Size')));

      var _finder = new Mp4.Finder(trak);

      describe('TrackHeaderBox', () => {
        var finder = _finder;
        var $tkhd = $trak.find('TrackHeaderBox');
        var tkhd = <Mp4.ITrackHeaderBox>finder.findOne('tkhd');
        var $info = $tkhd.find('BoxInfo');
        var $fullinfo = $tkhd.find('FullBoxInfo');

        it('size', () => expect(tkhd.byteLength).toBe(+$info.attr('Size')));
        it('version', () => expect(tkhd.version).toBe(+$fullinfo.attr('Version')));
        it('flags', () => expect(tkhd.flags).toBe(+$fullinfo.attr('Flags')));
        it('creation time', () => expect(tkhd.creationTime).toBe(+$tkhd.attr('CreationTime')));
        it('modifiction time', () => expect(tkhd.modificationTime).toBe(+$tkhd.attr('ModificationTime')));
        it('track id', () => expect(tkhd.trackID).toBe(+$tkhd.attr('TrackID')));
        it('duration', () => expect(tkhd.duration).toBe(+$tkhd.attr('Duration')));
        it('width', () => expect(tkhd.width).toBe(+$tkhd.attr('Width')));
        it('height', () => expect(tkhd.height).toBe(+$tkhd.attr('Height')));
        it('matrix', () => {
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

      describe('EditBox', () => {
        var $edts = $trak.find('EditBox');
        var edts = <Mp4.IEditBox>finder.findOne('edts');
        var $info = $edts.find('BoxInfo');

        it('size', () => expect(edts.byteLength).toBe(+$info.attr('Size')));

        describe('EditListBox', () => {
          var $elst = $edts.find('EditListBox');
          var elst = <Mp4.IEditListBox>finder.findOne('elst');
          var $info = $elst.find('BoxInfo');
          var $fullinfo = $elst.find('FullBoxInfo');

          it('size', () => expect(elst.byteLength).toBe(+$info.attr('Size')));
          it('version', () => expect(elst.version).toBe(+$fullinfo.attr('Version')));
          it('flags', () => expect(elst.flags).toBe(+$fullinfo.attr('Flags')));
          it('entries', () => {
            $elst.find('EditListEntry').map((i, el) => {
              var $el = $(el);
              expect(elst.entries[i].sagmentDuration).toBe(+$el.attr('Duration'));
              expect(elst.entries[i].mediaTime).toBe(+$el.attr('MediaTime'));
              expect(elst.entries[i].mediaRateInteger).toBe(+$el.attr('MediaRate'));
            });
          });
        });
      });

      describe('MediaBox', () => {
        var finder = _finder;
        var $mdia = $trak.find('MediaBox');
        var mdia = <Mp4.IMediaBox>finder.findOne('mdia');
        var $info = $mdia.find('BoxInfo');

        it('size', () => expect(mdia.byteLength).toBe(+$info.attr('Size')));

        describe('MediaHeaderBox', () => {
          var $mdhd = $mdia.find('MediaHeaderBox');
          var mdhd = <Mp4.IMediaHeaderBox>finder.findOne('mdhd');
          var $info = $mdhd.find('BoxInfo');
          var $fullinfo = $mdhd.find('FullBoxInfo');

          it('size', () => expect(mdhd.byteLength).toBe(+$info.attr('Size')));
          it('version', () => expect(mdhd.version).toBe(+$fullinfo.attr('Version')));
          it('flags', () => expect(mdhd.flags).toBe(+$fullinfo.attr('Flags')));
          it('creation time', () => expect(mdhd.creationTime).toBe(+$mdhd.attr('CreationTime')));
          it('modification time', () => expect(mdhd.modificationTime).toBe(+$mdhd.attr('ModificationTime')));
          it('timescale', () => expect(mdhd.timescale).toBe(+$mdhd.attr('TimeScale')));
          it('duration', () => expect(mdhd.duration).toBe(+$mdhd.attr('Duration')));
          it('language', () => expect(mdhd.language).toBe($mdhd.attr('LanguageCode')));
        });

        describe('HandlerBox', () => {
          var $hdlr = $mdia.find('HandlerBox');
          var hdlr = <Mp4.IHandlerBox>finder.findOne('hdlr');
          var $info = $hdlr.find('BoxInfo');
          var $fullinfo = $hdlr.find('FullBoxInfo');

          it('size', () => expect(hdlr.byteLength).toBe(+$info.attr('Size')));
          it('version', () => expect(hdlr.version).toBe(+$fullinfo.attr('Version')));
          it('flags', () => expect(hdlr.flags).toBe(+$fullinfo.attr('Flags')));
          it('handler type', () => expect(hdlr.handlerType).toBe($hdlr.attr('Type')));
          it('name', () => expect(hdlr.name).toBe($hdlr.attr('Name')));

        });

        describe('MediaInformationBox', () => {
          var $minf = $mdia.find('MediaInformationBox');
          var minf = <Mp4.IMediaInformationBox>finder.findOne('minf');
          var $info = $minf.find('BoxInfo');

          it('size', () => expect(minf.byteLength).toBe(+$info.attr('Size')));

          /*
          describe('SoundMediaHeaderBox', () => {
            var $smhd = $minf.find('SoundMediaHeaderBox');
            var smhd = <mp4.ISoundMediaHeaderBox>finder.findOne('smhd');
            var $info = $smhd.find('BoxInfo');
            var $fullinfo = $smhd.find('FullBoxInfo');

            it('size', () => expect(smhd.byteLength).toBe(+$info.attr('Size')));
            it('version', () => expect(smhd.version).toBe(+$fullinfo.attr('Version')));
            it('flags', () => expect(smhd.flags).toBe(+$fullinfo.attr('Flags')));
          });
          */

          describe('DataInformationBox', () => {
            var $dinf = $minf.find('DataInformationBox');
            var dinf = <Mp4.IDataInformationBox>finder.findOne('dinf');
            var $info = $dinf.find('BoxInfo');

            it('size', () => expect(dinf.byteLength).toBe(+$info.attr('Size')));

            describe('DataReferenceBox', () => {
              var $dref = $dinf.find('DataReferenceBox');
              var dref = <Mp4.IDataReferenceBox>finder.findOne('dref');
              var $info = $dref.find('BoxInfo');
              var $fullinfo = $dref.find('FullBoxInfo');

              it('size', () => expect(dref.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(dref.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(dref.flags).toBe(+$fullinfo.attr('Flags')));

              describe('URLDataEntryBox', () => {
                var $url = $dref.find('URLDataEntryBox');
                var url = <Mp4.IDataEntryUrlBox>finder.findOne('url ');
                var $info = $url.find('BoxInfo');
                var $fullinfo = $url.find('FullBoxInfo');

                it('size', () => expect(url.byteLength).toBe(+$info.attr('Size')));
                it('version', () => expect(url.version).toBe(+$fullinfo.attr('Version')));
                it('flags', () => expect(url.flags).toBe(+$fullinfo.attr('Flags')));
              });
            });
          });

          describe('SampleTableBox', () => {
            var $stbl = $mdia.find('SampleTableBox');
            var stbl = <Mp4.ISampleTableBox>finder.findOne('stbl');
            var $info = $stbl.find('BoxInfo');

            it('size', () => expect(stbl.byteLength).toBe(+$info.attr('Size')));

            describe('SampleDescriptionBox', () => {
              var $stsd = $stbl.find('SampleDescriptionBox');
              var stsd = <Mp4.ISampleDescriptionBox>finder.findOne('stsd');
              var $info = $stsd.find('BoxInfo');
              var $fullinfo = $stsd.find('FullBoxInfo');

              it('size', () => expect(stsd.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsd.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsd.flags).toBe(+$fullinfo.attr('Flags')));
              /*
              describe('MP4AudioSampleEntry', () => {
                var $mp4a = $stsd.find('MPEGAudioSampleDescriptionBox');
                var mp4a = <mp4.IMP4AudioSampleEntry>finder.findOne('mp4a');
                var $info = $mp4a.find('BoxInfo');

                it('size', () => expect(mp4a.byteLength).toBe(+$info.attr('Size')));
                it('data reference index', () => expect(mp4a.dataReferenceIndex).toBe(+$mp4a.attr('DataReferenceIndex')));
                it('sample rate', () => expect(mp4a.samplerate).toBe(+$mp4a.attr('SampleRate')));
                it('channel count', () => expect(mp4a.channelcount).toBe(+$mp4a.attr('Channels')));
                it('sample size', () => expect(mp4a.samplesize).toBe(+$mp4a.attr('BitsPerSample')));

              });
              */
            });

            describe('TimeToSampleBox', () => {
              var $stts = $stbl.find('TimeToSampleBox');
              var stts = <Mp4.ITimeToSampleBox>finder.findOne('stts');
              var $info = $stts.find('BoxInfo');
              var $fullinfo = $stts.find('FullBoxInfo');

              it('size', () => expect(stts.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stts.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stts.flags).toBe(+$fullinfo.attr('Flags')));
              it('entries', () => {
                $stts.find('TimeToSampleEntry').map((i, el) => {
                  var $el = $(el);
                  expect(stts.entries[i].sampleCount).toBe(+$el.attr('SampleCount'));
                  expect(stts.entries[i].sampleDelta).toBe(+$el.attr('SampleDelta'));
                });
              });
            });

            describe('SampleToChunkBox', () => {
              var $stsc = $stbl.find('SampleToChunkBox');
              var stsc = <Mp4.ISampleToChunkBox>finder.findOne('stsc');
              var $info = $stsc.find('BoxInfo');
              var $fullinfo = $stsc.find('FullBoxInfo');

              it('size', () => expect(stsc.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsc.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsc.flags).toBe(+$fullinfo.attr('Flags')));
              it('entries', () => {
                $stsc.find('SampleToChunkEntry').map((i, el) => {
                  var $el = $(el);
                  expect(stsc.entries[i].firstChunk).toBe(+$el.attr('FirstChunk'));
                  expect(stsc.entries[i].samplesPerChunk).toBe(+$el.attr('SamplesPerChunk'));
                  expect(stsc.entries[i].sampleDescriptionIndex).toBe(+$el.attr('SampleDescriptionIndex'));
                });
              });
            });

            describe('SampleSizeBox', () => {
              var $stsz = $stbl.find('SampleSizeBox');
              var stsz = <Mp4.ISampleSizeBox>finder.findOne('stsz');
              var $info = $stsz.find('BoxInfo');
              var $fullinfo = $stsz.find('FullBoxInfo');

              it('size', () => expect(stsz.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsz.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsz.flags).toBe(+$fullinfo.attr('Flags')));
              it('sample sizes', () => {
                $stsz.find('SampleSizeEntry').map((i, el) => {
                  expect(stsz.sampleSizes[i]).toBe(+$(el).attr('Size'));
                });
              });
            });

            describe('ChunkOffsetBox', () => {
              var $stco = $stbl.find('ChunkOffsetBox');
              var stco = <Mp4.IChunkOffsetBox>finder.findOne('stco');
              var $info = $stco.find('BoxInfo');
              var $fullinfo = $stco.find('FullBoxInfo');

              it('size', () => expect(stco.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stco.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stco.flags).toBe(+$fullinfo.attr('Flags')));
              it('chunk offsets', () => {
                $stco.find('ChunkEntry').map((i, el) => {
                  expect(stco.chunkOffsets[i]).toBe(+$(el).attr('offset'));
                });
              });
            });

            describe('SyncSampleBox', () => {
              var $stss = $stbl.find('SyncSampleBox');
              var stss = <Mp4.ISyncSampleBox>finder.findOne('stss');
              var $info = $stss.find('BoxInfo');
              var $fullinfo = $stss.find('FullBoxInfo');

              it('size', () => expect(stss.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stss.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stss.flags).toBe(+$fullinfo.attr('Flags')));
              it('sample numbers', () => {
                $stss.find('SyncSampleEntry').map((i, el) => {
                  expect(stss.sampleNumbers[i]).toBe(+$(el).attr('sampleNumber'));
                });
              });
            });
          });
        });
      });
    });
  });


  describe('MediaDataBox', () => {
    var $mdat = $xml.find('MediaDataBox');
    var mdat = <Mp4.IMediaDataBox>finder.findOne('mdat');
    var $info = $mdat.find('BoxInfo');

    it('size', () => expect(mdat.byteLength).toBe(+$info.attr('Size')));
  });
});

describe('Builder', () => {
  var tree = Mp4.parse(m4v);
  var finder = new Mp4.Finder(tree);

  describe('FileTypeBox', () => {
    var ftyp1 = <Mp4.IFileTypeBox>finder.findOne(Mp4.BOX_TYPE_FILE_TYPE_BOX);
    ftyp1.bytes = null;
    var ftypBytes = new Mp4.Builder.FileTypeBoxBuilder(ftyp1).build();
    var ftyp2 = new Mp4.Parser.FileTypeBoxParser(ftypBytes).parse();

    it('major brand', () => expect(ftyp2.majorBrand).toBe(ftyp1.majorBrand));
    it('minor version', () => expect(ftyp2.minorVersion).toBe(ftyp2.minorVersion));
    it('compatible brands', () => {
      ftyp2.compatibleBrands.forEach((brand, i) => {
        expect(brand).toBe(ftyp1.compatibleBrands[i]);
      });
    });
  });

  describe('MovieHeaderBox', () => {
    var mvhd1 = <Mp4.IMovieHeaderBox>finder.findOne(Mp4.BOX_TYPE_MOVIE_HEADER_BOX);
    mvhd1.bytes = null;
    var mvhdBytes = new Mp4.Builder.MovieHeaderBoxBuilder(mvhd1).build();
    var mvhd2 = new Mp4.Parser.MovieHeaderBoxParser(mvhdBytes).parse();

    it('creation time', () => expect(mvhd2.creationTime).toBe(mvhd1.creationTime));
    it('modification time', () => expect(mvhd2.modificationTime).toBe(mvhd1.modificationTime));
    it('time scale', () => expect(mvhd2.timescale).toBe(mvhd1.timescale));
    it('duration', () => expect(mvhd2.duration).toBe(mvhd1.duration));
    it('next track id', () => expect(mvhd2.nextTrackID).toBe(mvhd1.nextTrackID));

  });
  
  var audioTrack = finder.findAll(Mp4.BOX_TYPE_TRACK_BOX)[0];
  finder = new Mp4.Finder(audioTrack);

  describe('TrackHeaderBox', () => {
    var tkhd1 = <Mp4.ITrackHeaderBox>finder.findOne(Mp4.BOX_TYPE_TRACK_HEADER_BOX);
    tkhd1.bytes = null;
    var tkhdBytes = new Mp4.Builder.TrackHeaderBoxBuilder(tkhd1).build();
    var tkhd2 = new Mp4.Parser.TrackHeaderBoxParser(tkhdBytes).parse();

    it('creation time', () => expect(tkhd2.creationTime).toBe(tkhd1.creationTime));
    it('modification time', () => expect(tkhd2.modificationTime).toBe(tkhd1.modificationTime));
    it('track id', () => expect(tkhd2.trackID).toBe(tkhd1.trackID));
    it('duration', () => expect(tkhd2.duration).toBe(tkhd1.duration));
    it('volume', () => expect(tkhd2.volume).toBe(tkhd1.volume));
  });
  
  describe('MediaHeaderBox', () => {
    var mdhd1 = <Mp4.IMediaHeaderBox>finder.findOne(Mp4.BOX_TYPE_MEDIA_HEADER_BOX);
    mdhd1.bytes = null;
    var mdhdBytes = new Mp4.Builder.MediaHeaderBoxBuilder(mdhd1).build();
    var mdhd2 = new Mp4.Parser.MediaHeaderBoxParser(mdhdBytes).parse();

    it('creation time', () => expect(mdhd2.creationTime).toBe(mdhd1.creationTime));
    it('modification time', () => expect(mdhd2.modificationTime).toBe(mdhd1.creationTime));
    it('timescale', () => expect(mdhd2.timescale).toBe(mdhd1.timescale));
    it('duration', () => expect(mdhd2.duration).toBe(mdhd1.duration));
    it('language', () => expect(mdhd2.language).toBe(mdhd1.language));
  });

  describe('HandlerBox', () => {
    var hdlr1 = <Mp4.IHandlerBox>finder.findOne(Mp4.BOX_TYPE_HANDLER_BOX);
    hdlr1.bytes = null;
    var hdlrBytes = new Mp4.Builder.HandlerBoxBuilder(hdlr1).build();
    var hdlr2 = new Mp4.Parser.HandlerBoxParser(hdlrBytes).parse();
    
    it('handler type', () => expect(hdlr2.handlerType).toBe(hdlr1.handlerType));
    it('name', () => expect(hdlr2.name).toBe(hdlr1.name));
  });

  describe('DataReferenceBox', () => {
    var dref1 = <Mp4.IDataReferenceBox>finder.findOne(Mp4.BOX_TYPE_DATA_REFERENCE_BOX);
    dref1.bytes = null;
    var drefBytes = new Mp4.Builder.DataReferenceBoxBuilder(dref1).build();
    var dref2 = new Mp4.Parser.DataReferenceBoxParser(drefBytes).parse();

    it('entry count', () => expect(dref2.entryCount).toBe(dref1.entryCount));
    
    describe('DataEntryUrlBox', () => {
      var url1 = <Mp4.IDataEntryUrlBox>dref1.entries[0];
      url1.bytes = null;
      var urlBytes = new Mp4.Builder.DataEntryUrlBoxBuilder(url1).build();
      var url2 = new Mp4.Parser.DataEntryUrlBoxParser(urlBytes).parse();

      it('location', () => expect(url2.location).toBe(url1.location));
    });
  });

  describe('SampleDescriptionBox', () => {
    var stsd1 = <Mp4.ISampleDescriptionBox>finder.findOne(Mp4.BOX_TYPE_SAMPLE_DESCRIPTION_BOX);
    stsd1.bytes = null;
    var stsdBytes = new Mp4.Builder.SampleDescriptionBoxBuilder(stsd1).build();
    var stsd2 = new Mp4.Parser.SampleDescriptionBoxParser(stsdBytes).parse();
    it('entry count', () => expect(stsd1.entryCount).toBe(stsd2.entryCount));
    
    describe('MP4AudioSampleEntry', () => {
      var mp4a1 = <Mp4.IMP4AudioSampleEntry>finder.findOne(Mp4.BOX_TYPE_MP4_AUDIO_SAMPLE_ENTRY);
      mp4a1.bytes = null;
      var mp4aBytes = new Mp4.Builder.MP4AudioSampleEntryBuilder(mp4a1).build();
      var mp4a2 = new Mp4.Parser.MP4AudioSampleEntryParser(mp4aBytes).parse();

      it('data reference index', () => expect(mp4a2.dataReferenceIndex).toBe(mp4a1.dataReferenceIndex));
      it('sample rate', () => expect(mp4a2.sampleRate).toBe(mp4a1.sampleRate));
      it('sample size', () => expect(mp4a2.sampleSize).toBe(mp4a1.sampleSize));

      describe('ESDescriptor', () => {
        var esDescr1 = mp4a1.esBox.esDescr;
        esDescr1.bytes = null;
        var esDescrBytes = new Mp4.Builder.ESDescriptorBuilder(esDescr1).build();
        var esDescr2 = new Mp4.Parser.ESDescriptorParser(esDescrBytes).parse();

        it('es ID', () => expect(esDescr2.esID).toBe(esDescr1.esID));

        describe('DecoderConfigDescriptor', () => {
          var decConfigDescr1 = esDescr1.decConfigDescr;
          decConfigDescr1.bytes = null;
          var decConfigDescrBytes = new Mp4.Builder.DecoderConfigDescriptorBuilder(decConfigDescr1).build();
          var decConfigDescr2 = new Mp4.Parser.DecoderConfigDescriptorParser(decConfigDescrBytes).parse();

          it('object type indication', () => expect(decConfigDescr2.objectTypeIndication).toBe(decConfigDescr1.objectTypeIndication));
          it('stream type', () => expect(decConfigDescr2.streamType).toBe(decConfigDescr1.streamType));
          it('buffer size DB', () => expect(decConfigDescr2.bufferSizeDB).toBe(decConfigDescr1.bufferSizeDB));
          it('max bitrate', () => expect(decConfigDescr2.maxBitrate).toBe(decConfigDescr1.maxBitrate));
          it('avg bitrate', () => expect(decConfigDescr2.avgBitrate).toBe(decConfigDescr1.avgBitrate));

          describe('DecoderSpecificInfo', () => {
            var decSpecificInfo1 = decConfigDescr1.decSpecificInfo;
            decSpecificInfo1.bytes = null;
            var decSpecificInfoBytes = new Mp4.Builder.DecoderSpecificInfoBuilder(decSpecificInfo1).build();
            var decSpecificInfo2 = new Mp4.Parser.DecoderSpecificInfoParser(decSpecificInfoBytes).parse();

            it('data', () => {
              expect(decSpecificInfo2.data.length).toBe(decSpecificInfo1.data.length);
              for (var i = 0; i < decSpecificInfo1.data.length; ++i) {
                expect(decSpecificInfo2.data[i]).toBe(decSpecificInfo1.data[i]);
              }
            });
          });
        });

        describe('SLConfigDescriptor', () => {
          var slConfigDescr1 = esDescr1.slConfigDescr;
          slConfigDescr1.bytes = null;
          var slConfigDescrBytes = new Mp4.Builder.SLConfigDescriptorBuilder(slConfigDescr1).build();
          var slConfigDescr2 = new Mp4.Parser.SLConfigDescriptorParser(slConfigDescrBytes).parse();

          it('pre defined', () => expect(slConfigDescr2.preDefined).toBe(slConfigDescr1.preDefined));
        });
      });
    });
  });

  describe('TimeToSampleBox', () => {
    var stts1 = <Mp4.ITimeToSampleBox>finder.findOne(Mp4.BOX_TYPE_TIME_TO_SAMPLE_BOX);
    stts1.bytes = null;
    var sttsBytes = new Mp4.Builder.TimeToSampleBoxBuilder(stts1).build();
    var stts2 = new Mp4.Parser.TimeToSampleBoxParser(sttsBytes).parse();

    it('entry count', () => expect(stts2.entryCount).toBe(stts1.entryCount));
    it('entries', () => {
      stts1.entries.forEach((entry, i) => {
        expect(stts2.entries[i].sampleDelta).toBe(entry.sampleDelta);
        expect(stts2.entries[i].sampleCount).toBe(entry.sampleCount);
      });
    });
  });

  describe('SampleToChunkBox', () => {
    var stsc1 = <Mp4.ISampleToChunkBox>finder.findOne(Mp4.BOX_TYPE_SAMPLE_TO_CHUNK_BOX);
    stsc1.bytes = null;
    var stscBytes = new Mp4.Builder.SampleToChunkBoxBuilder(stsc1).build();
    var stsc2 = new Mp4.Parser.SampleToChunkBoxParser(stscBytes).parse();

    it('entry count', () => expect(stsc2.entryCount).toBe(stsc1.entryCount));
    it('entries', () => {
      stsc1.entries.forEach((entry, i) => {
        var e = stsc2.entries[i];
        expect(e.firstChunk).toBe(entry.firstChunk);
        expect(e.samplesPerChunk).toBe(entry.samplesPerChunk);
        expect(e.sampleDescriptionIndex).toBe(entry.sampleDescriptionIndex);
      });
    });
  });

  describe('SampleSizeBox', () => {
    var stsz1 = <Mp4.ISampleSizeBox>finder.findOne(Mp4.BOX_TYPE_SAMPLE_SIZE_BOX);
    stsz1.bytes = null;
    var stszBytes = new Mp4.Builder.SampleSizeBoxBuilder(stsz1).build();
    var stsz2 = new Mp4.Parser.SampleSizeBoxParser(stszBytes).parse();
    it('sample size', () => expect(stsz2.sampleSize).toBe(stsz1.sampleSize));
    it('sample count', () => expect(stsz2.sampleCount).toBe(stsz1.sampleCount));
    it('sample sizes', () => {
      stsz2.sampleSizes.forEach((size, i) => {
        expect(size).toBe(stsz1.sampleSizes[i]);
      });
    });
  });

  describe('ChunkOffsetBox', () => {
    var stco1 = <Mp4.IChunkOffsetBox>finder.findOne(Mp4.BOX_TYPE_CHUNK_OFFSET_BOX);
    stco1.bytes = null;
    var stcoBytes = new Mp4.Builder.ChunkOffsetBoxBuilder(stco1).build();
    var stco2 = new Mp4.Parser.ChunkOffsetBoxParser(stcoBytes).parse();
    it('entry count', () => expect(stco2.entryCount).toBe(stco1.entryCount));
    it('entries', () => {
      stco2.chunkOffsets.forEach((chunkOffset, i) => {
        expect(chunkOffset).toBe(stco1.chunkOffsets[i]);
      });
    });
  });
});