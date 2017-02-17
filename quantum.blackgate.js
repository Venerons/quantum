// https://blog.jcoglan.com/2012/07/16/designing-vaults-generator-algorithm/
// https://www.marketingtechblog.com/javascript-password-strength/
// https://codereview.stackexchange.com/questions/40944/verifying-password-strength-using-javascript
// https://github.com/dropbox/zxcvbn
// http://www.openwall.com/
// http://pgs.ece.cmu.edu

// 12+ chars, letters, digits, symbols in unusual place
// best: 3class16
// ok: 2word16, 3class12

(function () {
	'use strict';

	var BlackGate = Object.create(null);

	/*
	** CHARSETS
	*/
	BlackGate.ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
	BlackGate.ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	BlackGate.NUMBERS = '0123456789';
	BlackGate.SPACE = ' ';
	BlackGate.SYMBOLS = '-_!"#$%&\'()*+,./:;<=>?@[\\]^{|}~';
	BlackGate.DEFAULTCHARSET = null;
	BlackGate.DEFAULTCHARSET = BlackGate.ALPHA_LOWER.concat(BlackGate.ALPHA_UPPER).concat(BlackGate.NUMBERS).concat(BlackGate.SYMBOLS);

	/*
	** RANDOM DATA BUFFER
	**
	** Return a Uint8Array of bytesNumber length filled with random values.
	** Useful to generate salts, random keys, etc.
	** The maximum allowed as bytesNumber is 65536.
	*/
	BlackGate.randomBuffer = function (bytesNumber) {
		return crypto.getRandomValues(new Uint8Array(bytesNumber || 512));
	};

	/*
	** BUFFER TO STRING
	**
	** Return a string representing the input buffer.
	*/
	BlackGate.bufferToString = 'TextDecoder' in window ? function (buffer, encoding) {
		var dataView;
		if (buffer instanceof ArrayBuffer) {
			dataView = new DataView(buffer);
		} else if (buffer.buffer instanceof ArrayBuffer) {
			dataView = buffer;
		} else {
			throw new Error('Invalid bufferToString buffer');
		}
		var decoder = new TextDecoder(encoding || 'utf-8');
		return decoder.decode(dataView);
	} : String.fromCodePoint ? function (buffer) {
		if (!(buffer instanceof Uint16Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint16Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint16Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToBitString buffer');
			}
		}
		return String.fromCodePoint.apply(null, buffer);
	} : function (buffer) {
		if (!(buffer instanceof Uint16Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint16Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint16Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToBitString buffer');
			}
		}
		return String.fromCharCode.apply(null, buffer);
	};

	/*
	** STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input string.
	*/
	BlackGate.stringToBuffer = 'TextEncoder' in window ? function (string, encoding) {
		if (typeof string !== 'string') {
			throw new Error('Invalid stringToBuffer string');
		}
		var encoder = new TextEncoder(encoding || 'utf-8');
		return encoder.encode(string);
	} : String.fromCodePoint ? function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid stringToBuffer string');
		}
		var buffer = new ArrayBuffer(string.length * 2), // 2 bytes for each char
			bufferView = new Uint16Array(buffer);
		for (var i = 0; i < string.length; ++i) {
			bufferView[i] = string.codePointAt(i);
		}
		return new Uint8Array(buffer);
	} : function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid stringToBuffer string');
		}
		var buffer = new ArrayBuffer(string.length * 2), // 2 bytes for each char
			bufferView = new Uint16Array(buffer);
		for (var i = 0; i < string.length; ++i) {
			bufferView[i] = string.charCodeAt(i);
		}
		return new Uint8Array(buffer);
	};

	/*
	** BUFFER TO BASE56
	**
	** Return a base64 string representing the input buffer.
	**
	** https://gist.github.com/jonleighton/958841
	*/
	BlackGate.bufferToBase64 = function (buffer) {
		return btoa(BlackGate.bufferToString(buffer));
	};

	/*
	** BASE64 TO BUFFER
	**
	** Return a Uint8Array buffer representing the input base64 string.
	*/
	BlackGate.base64ToBuffer = function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid base64ToBuffer string');
		}
		return BlackGate.stringToBuffer(atob(string));
	};

	/*
	** BUFFER TO HEX STRING
	**
	** Return a hex string representing the input buffer.
	*/
	BlackGate.bufferToHex = function (buffer) {
		if (!(buffer instanceof Uint8Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToHex buffer');
			}
		}
		var output = '';
		for (var i = 0; i < buffer.byteLength; ++i) {
			var hex = buffer[i].toString(16);
			output += '00'.substring(0, 2 - hex.length) + hex;
		}
		return output;
	};

	BlackGate.bufferToHex_2 = function (buffer) {
		if (!(buffer instanceof ArrayBuffer)) {
			if (buffer.buffer instanceof ArrayBuffer) {
				buffer = buffer.buffer;
			} else {
				throw new Error('Invalid bufferToHex buffer');
			}
		}
		var view = new DataView(buffer),
			output = [];
		if (view.byteLength % 4 === 0) {
			// using Uint32
			for (var i = 0; i < view.byteLength; i += 4) {
				output.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
			}
		} else {
			// using Uint8
			for (var i = 0; i < view.byteLength; ++i) {
				output.push(('00' + view.getUint8(i).toString(16)).slice(-2));
			}
		}
		return output.join('');
	};

	BlackGate.bufferToHex_3 = function (buffer) {
		if (!(buffer instanceof Uint8Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToHex buffer');
			}
		}
		var hex = '';
		for (var i = 0; i < b.length; ++i) {
			var zeropad = (b[i] < 0x10) ? '0' : '';
			hex += zeropad + b[i].toString(16);
		}
		return hex;
	};

	/*
	var buffer = Quantum.blackgate.randomBuffer(512);
	[
		{ name: 'bufferToHex',   func: Quantum.blackgate.bufferToHex,   input: buffer },
		{ name: 'bufferToHex_2', func: Quantum.blackgate.bufferToHex_2, input: buffer.buffer },
		{ name: 'bufferToHex_3', func: Quantum.blackgate.bufferToHex_3, input: buffer }
	].forEach(function (item) {
		console.time(item.name);
		var tmp = item.func(item.input);
		console.timeEnd(item.name);
		console.log(item.name, tmp);
	});
	*/

	/*
	** HEX STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input hex string.
	*/
	BlackGate.hexToBuffer = function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid hexToBuffer string');
		}
		var output = new Uint8Array(string.length / 2);
		for (var i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(string.substring(i * 2, i * 2 + 2), 16);
		}
		return output;
	};

	/*
	** BUFFER TO URI ENCODING STRING
	**
	** Return a URI Encoding string representing the input buffer.
	*/
	BlackGate.bufferToURIEncoding = function (buffer) {
		if (!(buffer instanceof Uint8Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToURIEncoding buffer');
			}
		}
		var output = '';
		for (var i = 0; i < buffer.byteLength; ++i) {
			var hex = buffer[i].toString(16);
			output += '%' + '00'.substring(0, 2 - hex.length) + hex;
		}
		return output;
	};

	/*
	** URI ENCODING STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input URI Encoding string.
	*/
	BlackGate.URIEncodingToBuffer = function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid URIEncodingToBuffer string');
		}
		var bytes = string.split('%');
		bytes.shift(); // remove first empty string element
		var output = new Uint8Array(bytes.length);
		for (var i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(bytes[i], 16);
		}
		return output;
	};

	/*
	** BUFFER TO BIT STRING
	**
	** Return a bit string representing the input buffer.
	*/
	BlackGate.bufferToBitString = function (buffer) {
		if (!(buffer instanceof Uint8Array)) {
			if (buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer);
			} else if (buffer.buffer instanceof ArrayBuffer) {
				buffer = new Uint8Array(buffer.buffer);
			} else {
				throw new Error('Invalid bufferToBitString buffer');
			}
		}
		var output = '';
		for (var i = 0; i < buffer.byteLength; ++i) {
			var bit = buffer[i].toString(2);
			output += '00000000'.substring(0, 8 - bit.length) + bit;
		}
		return output;
	};

	/*
	** BIT STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input bit string.
	*/
	BlackGate.bitStringToBuffer = function (string) {
		if (typeof string !== 'string') {
			throw new Error('Invalid bitStringToBuffer string');
		}
		var output = new Uint8Array(string.length / 8);
		for (var i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(string.substring(i * 8, i * 8 + 8), 2);
		}
		return output;
	};

	/*
	** RANDOM PASSWORD
	*/
	BlackGate.randomPassword = function (passwordLength, charset) {
		passwordLength = passwordLength || 16;
		charset = charset || BlackGate.DEFAULTCHARSET;
		var randomBytes = BlackGate.randomBuffer(passwordLength), //crypto.getRandomValues(new Uint8Array(passwordLength)),
			outputString = '';
		for (var i = 0; i < randomBytes.length; ++i) {
			outputString += charset.charAt(randomBytes[i] % charset.length);
		}
		return outputString;
	};

	/*
	** HASH DIGEST
	**
	** https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
	** Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
	**
	** BlackGate.hash('SHA-256', BlackGate.stringToBuffer('foobar')).then(function (bufferHash) {
	**     var hexDigest = BlackGate.bufferToHex(bufferHash);
	** });
	*/
	BlackGate.hash = function (algo, buffer) {
		return crypto.subtle.digest(algo, buffer);
	};

	/*
	** GENERATE VAULT PASSWORD
	*/
	BlackGate.vaultPassword = function (masterPassword, serviceID, passwordLength, charset) {
		passwordLength = passwordLength || 16;
		charset = charset || BlackGate.DEFAULTCHARSET;

		/*
		//console.time('vaultPassword');
		var masterHASH = masterPassword;
		for (var i = 0; i < 1000; ++i) {
			masterHASH = CryptoJS.MD5(masterHASH).toString();
		}
		var outputString = CryptoJS.MD5(serviceID).toString();
		for (var i = 0; i < 1000; ++i) {
			outputString = CryptoJS.MD5(masterHASH + outputString).toString();
		}
		//console.timeEnd('vaultPassword');
		return outputString;
		*/

		//console.time('vaultPassword');
		return Promise.all([
			BlackGate.hash('SHA-512', BlackGate.stringToBuffer(masterPassword)),
			BlackGate.hash('SHA-512', BlackGate.stringToBuffer(serviceID))
		]).then(function (values) {
			var masterHashBuffer = new Uint8Array(values[0]),
				serviceHashBuffer = new Uint8Array(values[1]),
				mix = new Uint8Array(masterHashBuffer.length + serviceHashBuffer.length);
			mix.set(masterHashBuffer);
			mix.set(serviceHashBuffer, masterHashBuffer.length);
			return BlackGate.hash('SHA-512', mix).then(function (mixHashBuffer) {
				mixHashBuffer = new Uint8Array(mixHashBuffer);
				var outputString = '';
				for (var i = 0; i < passwordLength; ++i) {
					outputString += charset.charAt(mixHashBuffer[i % mixHashBuffer.length] % charset.length);
				}
				//console.timeEnd('vaultPassword');
				return outputString;
			});
		});
	};

	/*
	** XORCIPHER
	**
	** Return a Uint8Array representing the input xor key.
	** The xor is applied on each byte (8bit) of the input using
	** the corresponding byte of the key (the key is circular).
	*/
	BlackGate.xorcipher = function(input, key) {
		if (!(input instanceof Uint8Array)) {
			if (input instanceof ArrayBuffer) {
				input = new Uint8Array(input);
			} else if (input.buffer instanceof ArrayBuffer) {
				input = new Uint8Array(input.buffer);
			} else {
				throw new Error('Invalid xorcipher input');
			}
		}
		if (!(key instanceof Uint8Array)) {
			if (key instanceof ArrayBuffer) {
				key = new Uint8Array(key);
			} else if (key.buffer instanceof ArrayBuffer) {
				key = new Uint8Array(key.buffer);
			} else {
				throw new Error('Invalid xorcipher key');
			}
		}
		var outputBuffer = new Uint8Array(input.byteLength);
		for (var i = 0; i < input.byteLength; ++i) {
			outputBuffer[i] = input[i] ^ key[i % key.byteLength];
		}
		return outputBuffer;
	};

	window.Quantum.blackgate = BlackGate;
})();
