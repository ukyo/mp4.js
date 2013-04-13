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