// Quantum Crypto
// Copyright (c) 2017 – 2023 Daniele Veneroni. All rights reserved.
// Licensed under the MIT License (X11 License)
(function () {
	
	const QuantumCrypto = Object.create(null);

	QuantumCrypto.ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
	QuantumCrypto.ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	QuantumCrypto.NUMBERS = '0123456789';
	QuantumCrypto.DASH = '-';
	QuantumCrypto.SYMBOLS = '!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';
	QuantumCrypto.SPACE = ' ';

	QuantumCrypto.random_buffer = function (bytes_number) {
		return (crypto || webkitCrypto || msCrypto).getRandomValues(new Uint8Array(bytes_number || 512));
	};

	// supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
	QuantumCrypto.hash = function (algorithm, buffer) {
		return (crypto || webkitCrypto || msCrypto).subtle.digest(algorithm, buffer);
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

	QuantumCrypto.string_to_buffer = function (string, encoding) {
		return new TextEncoder(encoding || 'utf-8').encode(string).buffer;
	};

	QuantumCrypto.buffer_to_string = function (buffer, encoding) {
		return new TextDecoder(encoding || 'utf-8').decode(buffer);
	};

	QuantumCrypto.buffer_to_hex = function (buffer) {
		const array = new Uint8Array(buffer);
		const output = [];
		array.forEach((byte) => {
			output.push(byte.toString(16).padStart(2, '0'));
		});
		return output.join('');
	};

	QuantumCrypto.hex_to_buffer = function (string) {
		const output = new Uint8Array(string.length / 2);
		for (let i = 0; i < output.byteLength; ++i) {
			output[i] = parseInt(string.substring(i * 2, i * 2 + 2), 16);
		}
		return output.buffer;
	};

	QuantumCrypto.xor = function(buffer_1, buffer_2) {
		const array_1 = new Uint8Array(buffer_1);
		const array_2 = new Uint8Array(buffer_2);
		const array_3 = new Uint8Array(buffer_1.byteLength || buffer_1.length);
		for (let i = 0; i < array_1.byteLength; ++i) {
			array_3[i] = array_1[i] ^ array_2[i % array_2.byteLength];
		}
		return array_3.buffer;
	};

	if (!window.Quantum) {
		window.Quantum = Object.create(null);
	}
	window.Quantum.crypto = QuantumCrypto;
})();
