/// <reference path="../src/mp4.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jasmine.d.ts" />


var m4v: Uint8Array;
var xml: string;

describe('Parser', () => {
  var tree = mp4.parse(m4v);
  var finder = new mp4.Finder(tree);
  var $xml = $(xml);


  describe('FileTypeBox', () => {
    var $ftyp = $xml.find('FileTypeBox');
    var ftyp = <mp4.IFileTypeBox>finder.findOne('ftyp');
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
    var moov = <mp4.IMovieBox>finder.findOne('moov');
    var $info = $moov.find('BoxInfo');

    it('size', () => expect(moov.byteLength).toBe(+$info.attr('Size')));

    describe('MovieHeaderBox', () => {
      var $mvhd = $moov.find('MovieHeaderBox');
      var mvhd = <mp4.IMovieHeaderBox>finder.findOne('mvhd');
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

    describe('TrackBox 1', () => {
      var $trak = $moov.find('TrackBox:nth(0)');
      var trak = <mp4.ITrackBox>finder.findOne('trak');
      var $info = $trak.find('BoxInfo');

      it('size', () => expect(trak.byteLength).toBe(+$info.attr('Size')));

      var _finder = new mp4.Finder(trak);

      describe('TrackHeaderBox', () => {
        var finder = _finder;
        var $tkhd = $trak.find('TrackHeaderBox');
        var tkhd = <mp4.ITrackHeaderBox>finder.findOne('tkhd');
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
        var mdia = <mp4.IMediaBox>finder.findOne('mdia');
        var $info = $mdia.find('BoxInfo');

        it('size', () => expect(mdia.byteLength).toBe(+$info.attr('Size')));

        describe('MediaHeaderBox', () => {
          var $mdhd = $mdia.find('MediaHeaderBox');
          var mdhd = <mp4.IMediaHeaderBox>finder.findOne('mdhd');
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
          var hdlr = <mp4.IHandlerBox>finder.findOne('hdlr');
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
          var minf = <mp4.IMediaInformationBox>finder.findOne('minf');
          var $info = $minf.find('BoxInfo');

          it('size', () => expect(minf.byteLength).toBe(+$info.attr('Size')));

          describe('SoundMediaHeaderBox', () => {
            var $smhd = $minf.find('SoundMediaHeaderBox');
            var smhd = <mp4.ISoundMediaHeaderBox>finder.findOne('smhd');
            var $info = $smhd.find('BoxInfo');
            var $fullinfo = $smhd.find('FullBoxInfo');

            it('size', () => expect(smhd.byteLength).toBe(+$info.attr('Size')));
            it('version', () => expect(smhd.version).toBe(+$fullinfo.attr('Version')));
            it('flags', () => expect(smhd.flags).toBe(+$fullinfo.attr('Flags')));
          });

          describe('DataInformationBox', () => {
            var $dinf = $minf.find('DataInformationBox');
            var dinf = <mp4.IDataInformationBox>finder.findOne('dinf');
            var $info = $dinf.find('BoxInfo');

            it('size', () => expect(dinf.byteLength).toBe(+$info.attr('Size')));
            
            describe('DataReferenceBox', () => {
              var $dref = $dinf.find('DataReferenceBox');
              var dref = <mp4.IDataReferenceBox>finder.findOne('dref');
              var $info = $dref.find('BoxInfo');
              var $fullinfo = $dref.find('FullBoxInfo');

              it('size', () => expect(dref.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(dref.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(dref.flags).toBe(+$fullinfo.attr('Flags')));

              describe('URLDataEntryBox', () => {
                var $url = $dref.find('URLDataEntryBox');
                var url = <mp4.IDataEntryUrlBox>finder.findOne('url ');
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
            var stbl = <mp4.ISampleTableBox>finder.findOne('stbl');
            var $info = $stbl.find('BoxInfo');

            it('size', () => expect(stbl.byteLength).toBe(+$info.attr('Size')));

            describe('SampleDescriptionBox', () => {
              var $stsd = $stbl.find('SampleDescriptionBox');
              var stsd = <mp4.ISampleDescriptionBox>finder.findOne('stsd');
              var $info = $stsd.find('BoxInfo');
              var $fullinfo = $stsd.find('FullBoxInfo');

              it('size', () => expect(stsd.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(stsd.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(stsd.flags).toBe(+$fullinfo.attr('Flags')));

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
            });

            describe('TimeToSampleBox', () => {
              var $stts = $stbl.find('TimeToSampleBox');
              var stts = <mp4.ITimeToSampleBox>finder.findOne('stts');
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
              var stsc = <mp4.ISampleToChunkBox>finder.findOne('stsc');
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
              var stsz = <mp4.ISampleSizeBox>finder.findOne('stsz');
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
              var stco = <mp4.IChunkOffsetBox>finder.findOne('stco');
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


    describe('TrackBox 2', () => {
      var $trak = $moov.find('TrackBox:nth(0)');
      var trak = <mp4.ITrackBox>finder.findOne('trak');
      var $info = $trak.find('BoxInfo');

      it('size', () => expect(trak.byteLength).toBe(+$info.attr('Size')));

      var _finder = new mp4.Finder(trak);

      describe('TrackHeaderBox', () => {
        var finder = _finder;
        var $tkhd = $trak.find('TrackHeaderBox');
        var tkhd = <mp4.ITrackHeaderBox>finder.findOne('tkhd');
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
        var mdia = <mp4.IMediaBox>finder.findOne('mdia');
        var $info = $mdia.find('BoxInfo');

        it('size', () => expect(mdia.byteLength).toBe(+$info.attr('Size')));

        describe('MediaHeaderBox', () => {
          var $mdhd = $mdia.find('MediaHeaderBox');
          var mdhd = <mp4.IMediaHeaderBox>finder.findOne('mdhd');
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
          var hdlr = <mp4.IHandlerBox>finder.findOne('hdlr');
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
          var minf = <mp4.IMediaInformationBox>finder.findOne('minf');
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
            var dinf = <mp4.IDataInformationBox>finder.findOne('dinf');
            var $info = $dinf.find('BoxInfo');

            it('size', () => expect(dinf.byteLength).toBe(+$info.attr('Size')));

            describe('DataReferenceBox', () => {
              var $dref = $dinf.find('DataReferenceBox');
              var dref = <mp4.IDataReferenceBox>finder.findOne('dref');
              var $info = $dref.find('BoxInfo');
              var $fullinfo = $dref.find('FullBoxInfo');

              it('size', () => expect(dref.byteLength).toBe(+$info.attr('Size')));
              it('version', () => expect(dref.version).toBe(+$fullinfo.attr('Version')));
              it('flags', () => expect(dref.flags).toBe(+$fullinfo.attr('Flags')));

              describe('URLDataEntryBox', () => {
                var $url = $dref.find('URLDataEntryBox');
                var url = <mp4.IDataEntryUrlBox>finder.findOne('url ');
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
            var stbl = <mp4.ISampleTableBox>finder.findOne('stbl');
            var $info = $stbl.find('BoxInfo');

            it('size', () => expect(stbl.byteLength).toBe(+$info.attr('Size')));

            describe('SampleDescriptionBox', () => {
              var $stsd = $stbl.find('SampleDescriptionBox');
              var stsd = <mp4.ISampleDescriptionBox>finder.findOne('stsd');
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
              var stts = <mp4.ITimeToSampleBox>finder.findOne('stts');
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
              var stsc = <mp4.ISampleToChunkBox>finder.findOne('stsc');
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
              var stsz = <mp4.ISampleSizeBox>finder.findOne('stsz');
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
              var stco = <mp4.IChunkOffsetBox>finder.findOne('stco');
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
  });


  describe('MediaDataBox', () => {
    var $mdat = $xml.find('MediaDataBox');
    var mdat = <mp4.IMediaDataBox>finder.findOne('mdat');
    var $info = $mdat.find('BoxInfo');

    it('size', () => expect(mdat.byteLength).toBe(+$info.attr('Size')));
  });
});