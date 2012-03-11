asyncTest('mp4->aac, aac->m4a', function(){
	mp4js.utils.load('../resource/c11.m4a', function(buffer){
		ok(buffer, 'load buffer');
		start();
		
		var mp4 = new mp4js.Mp4(buffer);
		ok(mp4, 'create instance');
		
		var aacBuff = mp4.extractAACAsArrayBuffer();
		ok(aacBuff, 'extract aac');
		
		mp4js.utils.load('../resource/c11extract.aac', function(buffer){
			var extracted = new Uint8Array(aacBuff);
			var correct = new Uint8Array(buffer);
			
			equal(extracted.length, correct.length, 'check length');
			
			var eq = true;
			for(var i = 0, n = extracted.length; i < n; ++i) {
				if(extracted[i] !== correct[i]) {
					eq = false;
					break;
				}
			}
			ok(eq, 'diff');
			
			var m4aBuff = mp4js.aacToM4a(aacBuff);
			ok(m4aBuff, 'aac to m4a');
			
			mp4js.utils.load('../resource/c11rebuild.m4a', function(buffer){
				var rebuild = new Uint8Array(m4aBuff);
				var correct = new Uint8Array(buffer);
				
				equal(rebuild.length, correct.length, 'check length');
				
				var eq = true;
				var createModificate = [
					0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
					0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf, 0xc0,
					0x11d, 0x11e, 0x11f, 0x120, 0x121, 0x122, 0x123, 0x124
				];
				
				for(var i = 0, n = rebuild.length; i < n; ++i) {
					if(createModificate.indexOf(i) !== -1) continue;
					
					if(rebuild[i] !== correct[i]) {
						eq = false;
						console.log(i);
						break;
					}
				}
				ok(eq, 'diff');
			});
		});
	});
});
