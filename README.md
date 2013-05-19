# mp4.js

mp4 parser and composer.

## Hige level API

### Mp4.parse

```javascript
var tree = Mp4.parse(u8arr);
Array.isArray(tree);
```

### Mp4.extractAudio

```javascript
var m4aBytes = Mp4.extractAudio(u8arr);
```

### Mp4.extractRawAudio

```javascript
var audio = Mp4.extractRawAudio(u8arr);
audio.type; // 'aac' or 'mp3'
audio.data; // audio data as Uint8Array
```

### Mp4.aacToM4a

```javascript
var m4aBytes = Mp4.aacToM4a(aacBytes);
```

## utils

### Mp4.DataView2

A `DataView` wrapper.

```javascript
var v1 = new Mp4.DataView2(new ArrayBuffer(100));
var v3 = new Mp4.DataView2(100);
var v2 = new Mp4.DataView2(new Uint8Array([1, 2, 3, 4]));
```

### Mp4.Finder

```javascript
var tree = Mp4.parse(u8arr);
var finder = new Mp4.Finder(tree);
var ftyp = finder.findOne(Mp4.BOX_TYPE_FILE_TYPE_BOX);
var traks = new finder.findAll(Mp4.BOX_TYPE_TRACK_BOX);
```

### Mp4.BitReader

```javascript
var bitReader = new Mp4.BitReader(u8arr);
bitReader.readBits(2);
bitReader.bitOffset === 2;
bitReader.skipBits(6);
```

### Mp4.BitWriter

todo
