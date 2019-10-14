// Quantum | Copyright (c) 2017-2019 Daniele Veneroni | Blue Oak Model License 1.0.0 | https://github.com/Venerons/quantum
(function () {
	'use strict';
	
	var Crypto = Object.create(null);

	/*
	** CHARSETS
	*/
	Crypto.ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
	Crypto.ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	Crypto.NUMBERS = '0123456789';
	Crypto.DASH = '-';
	Crypto.SYMBOLS = '!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';
	Crypto.SPACE = ' ';
	Crypto.DEFAULTCHARSET = Crypto.ALPHA_LOWER.concat(Crypto.ALPHA_UPPER).concat(Crypto.NUMBERS).concat(Crypto.DASH).concat(Crypto.SYMBOLS);

	/*
	** RANDOM DATA BUFFER
	**
	** Return a Uint8Array of bytes_number length filled with random values.
	** Useful to generate salts, random keys, etc.
	** The maximum allowed as bytes_number is 65536.
	*/
	Crypto.random_buffer = function (bytes_number) {
		return (crypto || webkitCrypto || msCrypto).getRandomValues(new Uint8Array(bytes_number || 512));
	};

	/*
	** RANDOM PASSWORD
	*/
	Crypto.random_password = function (length, charset) {
		length = length || 16;
		charset = charset || Crypto.DEFAULTCHARSET;
		var random_bytes = Crypto.random_buffer(length),
			output_string = [];
		for (var i = 0; i < random_bytes.length; ++i) {
			output_string.push(charset.charAt(random_bytes[i] % charset.length));
		}
		return output_string.join('');
	};

	/*
	** BUFFER TO STRING
	**
	** Return a string representing the input buffer.
	*/
	Crypto.buffer_to_string = function (buffer, encoding) {
		var data_view;
		if (buffer instanceof ArrayBuffer) {
			data_view = new DataView(buffer);
		} else if (buffer.buffer instanceof ArrayBuffer) {
			data_view = buffer;
		} else {
			return null;
		}
		if ('TextDecoder' in window) {
			var decoder = new TextDecoder(encoding || 'utf-8');
			return decoder.decode(data_view);
		} else if (String.fromCodePoint) {
			return String.fromCodePoint.apply(null, buffer);
		} else if (String.fromCharCode) {
			return String.fromCharCode.apply(null, buffer);
		}
		return null;
	};

	/*
	** STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input string.
	*/
	Crypto.string_to_buffer = function (string, encoding) {
		if (typeof string !== 'string') {
			return null;
		}
		if ('TextEncoder' in window) {
			var encoder = new TextEncoder(encoding || 'utf-8');
			return encoder.encode(string);
		} else if (String.fromCodePoint) {
			var buffer = new ArrayBuffer(string.length * 2), // 2 bytes for each char
				buffer_view = new Uint16Array(buffer);
			for (var i = 0; i < string.length; ++i) {
				buffer_view[i] = string.codePointAt(i);
			}
			return new Uint8Array(buffer);
		} else if (String.fromCharCode) {
			var buffer = new ArrayBuffer(string.length * 2), // 2 bytes for each char
				bufferView = new Uint16Array(buffer);
			for (var i = 0; i < string.length; ++i) {
				bufferView[i] = string.charCodeAt(i);
			}
			return new Uint8Array(buffer);
		}
		return null;
	};

	/*
	** BUFFER TO HEX STRING
	**
	** Return a hex string representing the input buffer.
	*/
	Crypto.buffer_to_hex = function (buffer) {
		//var array = Array.from(new Uint8Array(buffer));
		//return array.map(b => b.toString(16).padStart(2, '0')).join('');
		if (!(buffer instanceof ArrayBuffer)) {
			if (buffer.buffer instanceof ArrayBuffer) {
				buffer = buffer.buffer;
			} else {
				return null;
			}
		}
		var view = new DataView(buffer),
			output = [];
		if (view.byteLength % 4 === 0) {
			// using Uint32
			for (var i = 0; i < view.byteLength; i += 4) {
				output.push(view.getUint32(i).toString(16).padStart(8, '0'));
			}
		} else {
			// using Uint8
			for (var i = 0; i < view.byteLength; ++i) {
				output.push(view.getUint8(i).toString(16).padStart(2, '0'));
			}
		}
		return output.join('');
	};

	/*
	** HEX STRING TO BUFFER
	**
	** Return a Uint8Array buffer representing the input hex string.
	*/
	Crypto.hex_to_buffer = function (string) {
		if (typeof string !== 'string') {
			return null;
		}
		var output = new Uint8Array(string.length / 2);
		for (var i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(string.substring(i * 2, i * 2 + 2), 16);
		}
		return output;
	};

	/*
	** HASH DIGEST
	**
	** https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
	** Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
	**
	** Crypto.hash('SHA-256', Crypto.string_to_buffer('foobar')).then(function (bufferHash) {
	**     var hexDigest = Crypto.buffer_to_hex(bufferHash);
	** });
	*/
	Crypto.hash = function (algorithm, buffer) {
		return (crypto || webkitCrypto || msCrypto).subtle.digest(algorithm, buffer);
	};

	/*
	** XORCIPHER
	**
	** Return a Uint8Array representing the input xor key.
	** The xor is applied on each byte (8bit) of the input using
	** the corresponding byte of the key (the key is circular).
	*/
	Crypto.xorcipher = function(input, key) {
		if (!(input instanceof Uint8Array)) {
			if (input instanceof ArrayBuffer) {
				input = new Uint8Array(input);
			} else if (input.buffer instanceof ArrayBuffer) {
				input = new Uint8Array(input.buffer);
			} else {
				return null;
			}
		}
		if (!(key instanceof Uint8Array)) {
			if (key instanceof ArrayBuffer) {
				key = new Uint8Array(key);
			} else if (key.buffer instanceof ArrayBuffer) {
				key = new Uint8Array(key.buffer);
			} else {
				return null;
			}
		}
		var output_buffer = new Uint8Array(input.byteLength);
		for (var i = 0; i < input.byteLength; ++i) {
			output_buffer[i] = input[i] ^ key[i % key.byteLength];
		}
		return output_buffer;
	};

	if (!window.Quantum) {
		window.Quantum = Object.create(null);
	}
	window.Quantum.crypto = Crypto;
})();
