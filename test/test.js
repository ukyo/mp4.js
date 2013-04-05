// JavaScript source code

asyncTest('read m4a', function () {
    var xhr = new XMLHttpRequest;
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', '01 Hyperventilate.m4a');
    xhr.onloadend = function () {
        ok(xhr.response instanceof ArrayBuffer);
        var result = Mp4.parse(new Uint8Array(xhr.response));
        finder = new Mp4.Finder(result);
        console.log(result);
        start();
    };
    xhr.send();
});