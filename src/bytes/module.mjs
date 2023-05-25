// 1 bit boolean
const u1_dec_to_hex = (value) => {
	return `${value}`;
};
const u1_hex_to_dec = (value) => {
	return parseInt(value, 16);
};

// 8 bit unsigned
const u8_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(1);
	const view = new DataView(buffer);
	view.setUint8(0, value);
	return buffer_to_hex(view.buffer);
};
const u8_hex_to_dec = (value) => {
	return parseInt(value, 16);
};

// 8 bit signed
const i8_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(1);
	const view = new DataView(buffer);
	view.setInt8(0, value);
	return buffer_to_hex(view.buffer);
};
const i8_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(1);
	const view = new DataView(buffer);
	view.setUint8(0, parseInt(value, 16));
	return view.getInt8(0);
};

// 16 bit unsigned
const u16_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(2);
	const view = new DataView(buffer);
	view.setUint16(0, value);
	return buffer_to_hex(view.buffer);
};
const u16_hex_to_dec = (value) => {
	return parseInt(value, 16);
};

// 16 bit signed
const i16_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(2);
	const view = new DataView(buffer);
	view.setInt16(0, value);
	return buffer_to_hex(view.buffer);
};
const i16_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(2);
	const view = new DataView(buffer);
	view.setUint16(0, parseInt(value, 16));
	return view.getInt16(0);
};

// 32 bit unsigned
const u32_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setUint32(0, value);
	return buffer_to_hex(view.buffer);
};
const u32_hex_to_dec = (value) => {
	return parseInt(value, 16);
};

// 32 bit signed
const i32_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setInt32(0, value);
	return buffer_to_hex(view.buffer);
};
const i32_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setUint32(0, parseInt(value, 16));
	return view.getInt32(0);
};

// 64 bit unsigned
const u64_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setBigUint64(0, value);
	return buffer_to_hex(view.buffer);
};
const u64_hex_to_dec = (value) => {
	return parseInt(value, 16);
};

// 64 bit signed
const i64_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setBigInt64(0, value);
	return buffer_to_hex(view.buffer);
};
const i64_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setBigUint64(0, parseInt(value, 16));
	return view.getBigInt64(0);
};

// 32 bit floating point
const f32_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setFloat32(0, value);
	return buffer_to_hex(view.buffer);
};
const f32_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setUint32(0, parseInt(value, 16));
	return view.getFloat32(0);
};

// 64 bit floating point
const f64_dec_to_hex = (value) => {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setFloat64(0, value);
	return buffer_to_hex(view.buffer);
};
const f64_hex_to_dec = (value) => {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setBigUint64(0, parseInt(value, 16));
	return view.getFloat64(0);
};

// universal functions
const dec_to_hex = (format, value) => {
	switch (format) {
		case 'u1':
			return u1_dec_to_hex(value);
		case 'u8':
			return u8_dec_to_hex(value);
		case 'i8':
			return i8_dec_to_hex(value);
		case 'u16':
			return u16_dec_to_hex(value);
		case 'i16':
			return i16_dec_to_hex(value);
		case 'u32':
			return u32_dec_to_hex(value);
		case 'i32':
			return i32_dec_to_hex(value);
		case 'u64':
			return u64_dec_to_hex(value);
		case 'i64':
			return i64_dec_to_hex(value);
		case 'f32':
			return f32_dec_to_hex(value);
		case 'f64':
			return f64_dec_to_hex(value);
		default:
			return null;
	}
};
const hex_to_dec = (format, value) => {
	switch (format) {
		case 'u1':
			return u1_hex_to_dec(value);
		case 'u8':
			return u8_hex_to_dec(value);
		case 'i8':
			return i8_hex_to_dec(value);
		case 'u16':
			return u16_hex_to_dec(value);
		case 'i16':
			return i16_hex_to_dec(value);
		case 'u32':
			return u32_hex_to_dec(value);
		case 'i32':
			return i32_hex_to_dec(value);
		case 'u64':
			return u64_hex_to_dec(value);
		case 'i64':
			return i64_hex_to_dec(value);
		case 'f32':
			return f32_hex_to_dec(value);
		case 'f64':
			return f64_hex_to_dec(value);
		default:
			return null;
	}
};

// buffer
const buffer_to_array = (buffer) => {
	const output = [];
	const view = new Uint8Array(buffer);
	view.map((x) => output.push(x));
	return output;
};
const buffer_to_hex = (buffer) => {
	const array = new Uint8Array(buffer);
	const output = [];
	array.forEach((byte) => {
		output.push(byte.toString(16).padStart(2, '0'));
	});
	return output.join('');
};
const buffer_to_base64 = (buffer) => {
	return btoa(buffer_to_string(buffer));
};
const buffer_to_string = (buffer, encoding) => {
	return new TextDecoder(encoding || 'utf-8').decode(buffer);
};

// array
const array_to_buffer = (array) => {
	const output = new Uint8Array(array.length);
	for (let i = 0; i < output.byteLength; ++i) {
		output[i] = array[i];
	}
	return output.buffer;
};
const array_to_hex = (array) => {
	return buffer_to_hex(array_to_buffer(array));
};
const array_to_base64 = (array) => {
	return buffer_to_base64(array_to_buffer(array));
};
const array_to_string = (array) => {
	return buffer_to_string(array_to_buffer(array));
};

// hex
const hex_to_buffer = (hex) => {
	hex = hex.replace(/^0x/, '');
	const output = new Uint8Array(hex.length / 2);
	for (let i = 0; i < output.byteLength; ++i) {
		output[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
	}
	return output.buffer;
};
const hex_to_array = (hex) => {
	return buffer_to_array(hex_to_buffer(hex.replace(/^0x/, '')));
};
const hex_to_base64 = (hex) => {
	return buffer_to_base64(hex_to_buffer(hex.replace(/^0x/, '')));
};
const hex_to_string = (hex) => {
	return buffer_to_string(hex_to_buffer(hex.replace(/^0x/, '')));
};

// base64
const base64_to_buffer = (base64) => {
	return string_to_buffer(base64_to_string(base64));
};
const base64_to_array = (base64) => {
	return string_to_array(base64_to_string(base64));
};
const base64_to_hex = (base64) => {
	return string_to_hex(base64_to_string(base64));
};
const base64_to_string = (base64) => {
	const decode = atob(base64).replace(/[\x80-\uffff]/g, (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`)
	return decodeURIComponent(decode);
};

// string
const string_to_buffer = (string) => {
	return new TextEncoder().encode(string).buffer;
};
const string_to_array = (string) => {
	return buffer_to_array(string_to_buffer(string));
};
const string_to_hex = (string) => {
	return buffer_to_hex(string_to_buffer(string));
};
const string_to_base64 = (string) => {
	const encode = encodeURIComponent(string).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)));
	return btoa(encode);
};

// exports
export default {
	dec_to_hex,
	hex_to_dec,

	buffer_to_array,
	buffer_to_hex,
	buffer_to_base64,
	buffer_to_string,

	array_to_buffer,
	array_to_hex,
	array_to_base64,
	array_to_string,

	hex_to_buffer,
	hex_to_array,
	hex_to_base64,
	hex_to_string,

	base64_to_buffer,
	base64_to_array,
	base64_to_hex,
	base64_to_string,

	string_to_buffer,
	string_to_array,
	string_to_hex,
	string_to_base64
};
