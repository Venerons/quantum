// Quantum Crypto
// Copyright (c) 2017 – 2022 Daniele Veneroni. All rights reserved.
// Licensed under the MIT License (X11 License)
(function () {
	
	var QuantumCrypto = Object.create(null);

	QuantumCrypto.ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
	QuantumCrypto.ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	QuantumCrypto.NUMBERS = '0123456789';
	QuantumCrypto.DASH = '-';
	QuantumCrypto.SYMBOLS = '!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';
	QuantumCrypto.SPACE = ' ';

	QuantumCrypto.random_buffer = function (bytes_number) {
		return (crypto || webkitCrypto || msCrypto).getRandomValues(new Uint8Array(bytes_number || 512));
	};

	QuantumCrypto.random_password = function (length, charset) {
		length = length || 16;
		charset = charset || QuantumCrypto.ALPHA_LOWER.concat(QuantumCrypto.ALPHA_UPPER).concat(QuantumCrypto.NUMBERS).concat(QuantumCrypto.DASH).concat(QuantumCrypto.SYMBOLS);
		const random_bytes = QuantumCrypto.random_buffer(length);
		const output_string = [];
		for (let i = 0; i < random_bytes.length; ++i) {
			output_string.push(charset.charAt(random_bytes[i] % charset.length));
		}
		return output_string.join('');
	};

	QuantumCrypto.buffer_to_string = function (buffer, encoding) {
		let data_view;
		if (buffer instanceof ArrayBuffer) {
			data_view = new DataView(buffer);
		} else if (buffer.buffer instanceof ArrayBuffer) {
			data_view = buffer;
		} else {
			return null;
		}
		if ('TextDecoder' in window) {
			const decoder = new TextDecoder(encoding || 'utf-8');
			return decoder.decode(data_view);
		} else if (String.fromCodePoint) {
			return String.fromCodePoint.apply(null, buffer);
		} else if (String.fromCharCode) {
			return String.fromCharCode.apply(null, buffer);
		}
		return null;
	};

	QuantumCrypto.string_to_buffer = function (string, encoding) {
		if (typeof string !== 'string') {
			return null;
		}
		if ('TextEncoder' in window) {
			const encoder = new TextEncoder(encoding || 'utf-8');
			return encoder.encode(string);
		} else if (String.fromCodePoint) {
			const buffer = new ArrayBuffer(string.length * 2); // 2 bytes for each char
			const buffer_view = new Uint16Array(buffer);
			for (let i = 0; i < string.length; ++i) {
				buffer_view[i] = string.codePointAt(i);
			}
			return new Uint8Array(buffer);
		} else if (String.fromCharCode) {
			const buffer = new ArrayBuffer(string.length * 2); // 2 bytes for each char
			const buffer_view = new Uint16Array(buffer);
			for (let i = 0; i < string.length; ++i) {
				buffer_view[i] = string.charCodeAt(i);
			}
			return new Uint8Array(buffer);
		}
		return null;
	};

	QuantumCrypto.buffer_to_hex = function (buffer) {
		//const array = Array.from(new Uint8Array(buffer));
		//return array.map(b => b.toString(16).padStart(2, '0')).join('');
		if (!(buffer instanceof ArrayBuffer)) {
			if (buffer.buffer instanceof ArrayBuffer) {
				buffer = buffer.buffer;
			} else {
				return null;
			}
		}
		const view = new DataView(buffer);
		const output = [];
		if (view.byteLength % 4 === 0) {
			// using Uint32
			for (let i = 0; i < view.byteLength; i += 4) {
				output.push(view.getUint32(i).toString(16).padStart(8, '0'));
			}
		} else {
			// using Uint8
			for (let i = 0; i < view.byteLength; ++i) {
				output.push(view.getUint8(i).toString(16).padStart(2, '0'));
			}
		}
		return output.join('');
	};

	QuantumCrypto.hex_to_buffer = function (string) {
		if (typeof string !== 'string') {
			return null;
		}
		const output = new Uint8Array(string.length / 2);
		for (let i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(string.substring(i * 2, i * 2 + 2), 16);
		}
		return output;
	};

	// supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
	QuantumCrypto.hash = function (algorithm, buffer) {
		return (crypto || webkitCrypto || msCrypto).subtle.digest(algorithm, buffer);
	};

	QuantumCrypto.xorcipher = function(input, key) {
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
		const output_buffer = new Uint8Array(input.byteLength);
		for (let i = 0; i < input.byteLength; ++i) {
			output_buffer[i] = input[i] ^ key[i % key.byteLength];
		}
		return output_buffer;
	};

	if (!window.Quantum) {
		window.Quantum = Object.create(null);
	}
	window.Quantum.crypto = QuantumCrypto;
})();
