// JavaScript source code

function load(url) {
    var d = $.Deferred();
    var xhr = new XMLHttpRequest;
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url);
    xhr.onloadend = function () {
        d.resolve(new Uint8Array(xhr.response));
    };
    xhr.send();
    return d.promise();
}

asyncTest('test parser', function () {
    $.when(load('sample_iPod.m4v'), $.get('sample_iPod.xml'))
    .then(function (m4v, xml) {
        var tree = Mp4.parse(m4v);
        var finder = new Mp4.Finder(tree);
        $xml = $(xml);

        var $ftyp = $xml.find('FileTypeBox');
        var ftyp = finder.findOne('ftyp');
        var $info = $ftyp.find('BoxInfo');
        equal(ftyp.byteLength, $info.attr('Size'), 'ftyp: size');
        equal(ftyp.majorBrand, $ftyp.attr('MajorBrand'), 'ftyp: major brand');
        $ftyp.find('BrandEntry').map(function (i) {
            var brand = $(this).attr('AlternateBrand');
            equal(ftyp.compatibleBrands[i], brand, 'ftyp: compatible brands ' + i);
        });

        var $moov = $xml.find('MovieBox');
        var moov = finder.findOne('moov');
        $info = $moov.find('BoxInfo');
        equal(moov.byteLength, $info.attr('Size'), 'moov: size');
        
        var $mdat = $xml.find('MediaDataBox');
        var mdat = finder.findOne('mdat');
        $info = $mdat.find('BoxInfo');
        equal(mdat.byteLength, $info.attr('Size'), 'mdat: size');

        finder = new Mp4.Finder(moov);
        var $mvhd = $moov.find('MovieHeaderBox');
        var mvhd = finder.findOne('mvhd');
        $info = $mvhd.find('BoxInfo');
        var $fullinfo = $mvhd.find('FullBoxInfo');
        equal(mvhd.byteLength, $info.attr('Size'), 'mvhd: size');
        equal(mvhd.version, $fullinfo.attr('Version'), 'mvhd: version');
        equal(mvhd.flags, $fullinfo.attr('Flags'), 'mvhd: flags');
        equal(mvhd.creationTime, $mvhd.attr('CreationTime'), 'mvhd: creation time');
        equal(mvhd.modificationTime, $mvhd.attr('ModificationTime'), 'mvhd: modification time');
        equal(mvhd.timescale, $mvhd.attr('TimeScale'), 'mvhd: time scale');
        equal(mvhd.duration, $mvhd.attr('Duration'), 'mvhd: duration');
        equal(mvhd.nextTrackID, $mvhd.attr('NextTrackID'), 'mvhd: next track id');

        var $trak1 = $moov.find('TrackBox:nth(0)');
        var trak = finder.findAll('trak')[0];
        $info = $trak1.find('BoxInfo');
        equal(trak.byteLength, $info.attr('Size'), 'trak1: size');

        finder = new Mp4.Finder(trak);
        var $tkhd = $trak1.find('TrackHeaderBox');
        var tkhd = finder.findOne('tkhd');
        $info = $tkhd.find('BoxInfo');
        $fullinfo = $tkhd.find('FullBoxInfo');
        equal(tkhd.byteLength, $info.attr('Size'), 'tkhd: size');
        equal(tkhd.version, $fullinfo.attr('Version'), 'tkhd: version');
        equal(tkhd.flags, $fullinfo.attr('Flags'), 'tkhd: flags');
        equal(tkhd.creationTime, $tkhd.attr('CreationTime'), 'tkhd: creation time');
        equal(tkhd.modificationTime, $tkhd.attr('ModificationTime'), 'tkhd: modification time');
        equal(tkhd.trackID, $tkhd.attr('TrackID'), 'tkhd: track id');
        equal(tkhd.duration, $tkhd.attr('Duration'), 'tkhd: duration');
        equal(tkhd.volume, +$tkhd.attr('Volume'), 'tkhd: volume');

        var $mdia = $trak1.find('MediaBox');
        var mdia = finder.findOne('mdia');
        $info = $mdia.find('BoxInfo');
        equal(mdia.byteLength, $info.attr('Size'), 'mdia: size');
        
        finder = new Mp4.Finder(mdia);
        var $mdhd = $mdia.find('MediaHeaderBox');
        var mdhd = finder.findOne('mdhd');
        $info = $mdhd.find('BoxInfo');
        $fullinfo = $mdhd.find('FullBoxInfo');
        equal(mdhd.byteLength, $info.attr('Size'), 'mdhd: size');
        equal(mdhd.version, $fullinfo.attr('Version'), 'mdhd: version');
        equal(mdhd.flags, $fullinfo.attr('Flags'), 'mdhd: flags');
        equal(mdhd.creationTime, $mdhd.attr('CreationTime'), 'mdhd: creation time');
        equal(mdhd.modificationTime, $mdhd.attr('ModificationTime'), 'mdhd: modification time');
        equal(mdhd.timescale, $mdhd.attr('TimeScale'), 'mdhd: time scale');
        equal(mdhd.duration, $mdhd.attr('Duration'), 'mdhd: duration');
        equal(mdhd.language, $mdhd.attr('LanguageCode'), 'mdhd; language code');

        start();
    });
});