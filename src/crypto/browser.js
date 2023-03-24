(function () {
	
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const DASH = '-';
const SYMBOLS = '!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';

const random_buffer = function (bytes_number) {
	return (crypto || webkitCrypto || msCrypto).getRandomValues(new Uint8Array(bytes_number || 512));
};

// supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
const hash = function (algorithm, buffer) {
	return (crypto || webkitCrypto || msCrypto).subtle.digest(algorithm, buffer);
};

const random_password = function (length, charset) {
	length = length || 16;
	charset = charset || ALPHA_LOWER.concat(ALPHA_UPPER).concat(NUMBERS).concat(DASH).concat(SYMBOLS);
	const random_bytes = random_buffer(length);
	const output_string = [];
	for (let i = 0; i < random_bytes.length; ++i) {
		output_string.push(charset.charAt(random_bytes[i] % charset.length));
	}
	return output_string.join('');
};

// exports
if (!window.Quantum) {
	window.Quantum = Object.create(null);
}
window.Quantum.crypto = {
	random_buffer,
	hash,
	random_password
};
})();
