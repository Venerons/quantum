# Table of Contents

* [Core](#core)
	* [exists](#exists)
	* [log](#log)
	* [error](#error)
	* [query](#query)
	* [type](#type)
	* [guid](#guid)
	* [require](#require)
	* [ajax](#ajax)
	* [isInteger](#isinteger)
	* [isFloat](#isfloat)
	* [isHex](#ishex)
	* [isEmail](#isemail)
	* [isIPv4](#isipv4)
	* [isIPv6](#isipv6)
* [Table](#table)
	* [table](#table-1)
		* [Table Settings](#table-settings)
		* [Columns Settings](#columns-settings)
		* [Table Example](#table-example)
	* [update](#update)
	* [destroy](#destroy)
* [Crypto](#crypto)
	* [randomBuffer(bytesNumber)](#randombufferbytesnumber)
	* [bufferToString(buffer)](#buffertostringbuffer)
	* [stringToBuffer(string)](#stringtobufferstring)
	* [bufferToBase64(buffer)](#buffertobase64buffer)
	* [base64ToBuffer(string)](#base64tobufferstring)
	* [bufferToHex(buffer)](#buffertohexbuffer)
	* [hexToBuffer(string)](#hextobufferstring)
	* [bufferToURIEncoding(buffer)](#buffertouriencodingbuffer)
	* [URIEncodingToBuffer(string)](#uriencodingtobufferstring)
	* [bufferToBitString(buffer)](#buffertobitstringbuffer)
	* [bitStringToBuffer(string)](#bitstringtobufferstring)
	* [randomPassword(passwordLength, charset)](#randompasswordpasswordlength-charset)
	* [hash(algo, buffer)](#hashalgo-buffer)
	* [vaultPassword(masterPassword, serviceID, passwordLength, charset)](#vaultpasswordmasterpassword-serviceid-passwordlength-charset)
	* [xorcipher(input, key)](#xorcipherinput-key)

# Core

Just include or load the `quantum.js` file to load the core features. You can do directly on your HTML page by doing so:

```html
<script src="quantum.js"></script>
```

## exists

Returns `true` if the item is not `null` or `undefined`, `false` otherwise.

Example:

```js
var a = {
	prop1: 'stringvalue'
};
console.log(Quantum.exists(a.prop1)); // true
console.log(Quantum.exists(a.prop2)); // false
```

## log

Show a log on the Browser's Javascript Console, styled based on the given level. Levels are `debug`, `info`, `warn`, `error`. If the first parameter is not a valid level, then a simple unstyled log is shown.

Example:

```js
var myfunc = function (a, b, c) {
	Quantum.log('debug', 'myfunc', a, b, c);
};
```

## error

Show a log on the browser's JavaScript console with detailed infos on the given error.

Example 1:

```js
try {
	// some code
} catch (e) {
	Quantum.error(e, 'Oh no! An error!');
}
```

Example 2:

```js
window.onerror = function (message, filename, lineno, colno, error) {
	if (error) {
		error.fileName = error.fileName || filename || null;
		error.lineNumber = error.lineNumber || lineno || null;
		error.columnNumber = error.columnNumber || colno || null;
	} else {
		error = {
			message: message,
			fileName: filename,
			lineNumber: lineno,
			columnNumber: colno
		};
	}
	Quantum.error(error, 'Uncatched Exception');
};
```

## query

Return a NodeList with the elements that matches the given CSS selector.

Example:

```js
var items = Quantum.query('.item');
```

## type

Returns the given object's type.

Example:

```js
console.log(Quantum.type('this is a string')); // "String"
```

## guid

Returns a random GUID, useful for identify objects and elements.

Example:

```js
console.log(Quantum.guid()); // i.e. "1db1fef5-5e88-46d7-8a71-5a5c9d7ae880"
```

## require

Load and execute CSS and JavaScript files. Files are loaded and executed in the given order, unless you use `async` or `defer` options. You can assign a function to be executed after every single script is loaded or when all scripts are loaded.

Example:

```js
Quantum.require({
	scripts: [
		{
			type: 'css',
			path: 'path/to/file.css',
			onload: function () {
				console.info('Script 1 loaded.');
			}
		},
		{
			type: 'css',
			path: 'path/to/file.css',
			onload: function () {
				console.info('Script 2 loaded.');
			}
		},
		{
			type: 'js',
			path: 'path/to/file.js',
			async: false,
			defer: false,
			onload: function () {
				console.info('Script 3 loaded.');
			}
		},
		{
			type: 'js',
			path: 'path/to/file.js',
			async: false,
			defer: false,
			onload: function () {
				console.info('Script 4 loaded.');
			}
		}
	],
	onload: function () {
		console.info('Every script has been loaded.');
	}
});
```

## ajax

Execute an AJAX (XMLHttpRequest) request.

Note:

- url is mandatory
- HTMLFormElement as data only if type == 'POST' and contentType == 'multipart/form-data'
- if resonseType == 'json', the response will be the JSON already parsed

Example:

```js
Quantum.ajax({
	type: <'GET' || 'POST'>,
	url: <string>,
	async: <true || false>,
	contentType: <'application/x-www-form-urlencoded' || 'text/plain' || 'multipart/form-data'>,
	data: <string || object || HTMLFormElement>,
	responseType: <'text' || 'json' || 'document' || 'arraybuffer' || 'blob'>,
	uploadProgress: <function(percentage)>,
	progress: <function(percentage)>,
	success: <function(response)>,
	error: <function(error)>
});
```

## isInteger

Returns `true` if the given value is an integer number, `false` otherwise.

Example:

```js
console.log(Quantum.isInteger(1970)); // true
console.log(Quantum.isInteger(-1970)); // true
console.log(Quantum.isInteger(1970.5)); // false
console.log(Quantum.isInteger(-1970.5)); // false
console.log(Quantum.isInteger('1970')); // true
console.log(Quantum.isInteger('-1970')); // true
console.log(Quantum.isInteger('1970.5')); // false
console.log(Quantum.isInteger('-1970.5')); // false
console.log(Quantum.isInteger('hello')); // false
```

## isFloat

Returns `true` if the given value is a floating point number, `false` otherwise.

Example:

```js
console.log(Quantum.isFloat(1970)); // true
console.log(Quantum.isFloat(-1970)); // true
console.log(Quantum.isFloat(1970.5)); // true
console.log(Quantum.isFloat(-1970.5)); // true
console.log(Quantum.isFloat('1970')); // true
console.log(Quantum.isFloat('-1970')); // true
console.log(Quantum.isFloat('1970.5')); // true
console.log(Quantum.isFloat('-1970.5')); // true
console.log(Quantum.isFloat('hello')); // false
```

## isHex

Returns `true` if the given value is an hexadecimal value, `false` otherwise. Validates i.e. 12ADff, #12ADff, 0x12ADff

Example:

```js
console.log(Quantum.isHex('12ADff')); // true
console.log(Quantum.isHex('#12ADff')); // true
console.log(Quantum.isHex(0x12ADff)); // true
console.log(Quantum.isHex('0x12ADff')); // true
```

## isEmail

Returns `true` if the given value is a valid email address, `false` otherwise.

Example:

```js
console.log(Quantum.isEmail('john.doe@gmail.com')); // true
```

## isIPv4

Returns `true` if the given value is a valid IPv4 address, `false` otherwise.

Example:

```js
console.log(Quantum.isIPv4('192.168.0.1')); // true
```

## isIPv6

Returns `true` if the given value is a valid IPv6 address, `false` otherwise.

Example:

```js
console.log(Quantum.isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // true
```

# Table

Quantum Table is a module that let you create standard HTML5 tables with ease.

In order to use this module you need to include the `quantum.table.js` file. Be aware that you need to load the core module first to use this module.

```html
<script src="quantum.js"></script>
<script src="quantum.table.js"></script>
```

## table

Create and render a table, and returns an object that let you update it later. The first parameter can be either a CSS3 selector (i.e. `'#my-table'`) that resolves to a `<table>` element, or directly an `HTMLTableElement` element. The second parameter is an object that contains all the settings of the table. You can find documentation about settings on the **Table Settings** section.

Examples:

```js
// selector resolves to a <table> element, given that an element like <table id="my-table"></table> exists.
var qt = Quantum.table('#my-table', { ... });

// selector is an HTMLTableElement element, given that an element like <table id="my-table"></table> exists.
var qt = Quantum.table(document.getElementById('my-table'), { ... });

// selector is an HTMLTableElement element created on the fly, rendered on memory and then later added to the DOM.
var table = document.createElement('table');
var qt = Quantum.table(table, { ... });
document.body.appendChild(table);
```

### Table Settings

Key               | Values                   | Description
---               | ---                      | ---
width             | `<number>` or `<string>` | Optional. The table width. It can be number of px, or string with specific unit (i.e. '100%', '5rem', etc.)
height            | `<number>` or `<string>` | Optional. The table height. It can be number of px, or string with specific unit (i.e. '100%', '5rem', etc.)
caption           | `<string>`               | Optional. Text caption of the table. If not given, no caption is created.
records           | `<array>`                | Mandatory. Array of objects containing the data that will be rendered on the table.
columns           | `<array>`                | Mandatory. Array of objects containing the columns settings of the table. More documentation about columns settings on the **Columns Settings** section.
group             | `<object>`               | Optional. If available, will activate data grouping. Data will be grouped by the `field` key, sorted with the `sort` given function and you can give a custom render for the group header with the `render` function.
sort              | `<array>`                | Optional. If available, will activate data sorting. If also grouping is activate, the data are sorted inside each separate group. Each sorting has a `field` key and a `direction` (`asc`, `desc`, or sorting function).
onRowClick        | `<function>`             | Optional. Function executed each time the user clicks on a row of the table. Parameters of the function are `record` that is the corresponding record and `tr` that is the corresponding HTMLTableRowElement element.
onRenderCompleted | `<function>`             | Optional. Function executed when redering of the table is completed.

### Columns Settings

Key     | Values                   | Description
---     | ---                      | ---
field   | `<string>`               | Mandatory. The corresponding field in each record object.
caption | `<string>`               | Optional. The column caption that will be showed on the table header. If no caption is given for every column, no table header is shown.
size    | `<number>` or `<string>` | Optional. The column width. It can be number of px, or string with specific unit (i.e. '100%', '5rem', etc.)
hidden  | `true` or `false`        | Optional. Default `false`. Whenever the column is shown or hidden.
style   | `<string>`               | Optional. CSS style string applyed on each cell of the column.
render  | `<function>`             | Optional. Custom function to render each cell of the column. The given function will have the parameters `value` that is the corresponding value that should be rendered, `record` that is the full corresponding record and `td` that is the corresponding HTMLTableCellElement element.

### Table Example

```js
var qt = Quantum.table('#my-table', {
	width: 400, // same as '400px'
	height: 200, // same as '200px'
	caption: 'Teams',
	records: [
		{ id: 1, team: 'Red', firstname: 'Mario', lastname: 'Rossi' },
		{ id: 2, team: 'Blue', firstname: 'Marco', lastname: 'Bianchi' },
		{ id: 3, team: 'Red', firstname: 'Giuseppe', lastname: 'Verdi' },
		{ id: 4, team: 'Blue', firstname: 'Daniele', lastname: 'Veneroni' }
	],
	columns: [
		{
			field: 'id',
			caption: 'ID',
			size: '10%',
			hidden: true
		},
		{
			field: 'firstname',
			caption: 'First Name',
			size: '45%',
			hidden: false,
			render: function (value, record, td) { return '<em>' + value + '</em>'; }
		},
		{
			field: 'lastname',
			caption: 'Last Name',
			size: '45%',
			hidden: false
		}
	],
	group: {
		field: 'team',
		sort: 'asc', // 'asc', 'desc' or sorting function
		render: function (value) { return '<strong>' + value + '</strong>'; }
	},
	sort: [
		{ field: 'firstname', direction: 'asc' }, // sort by firstname first
		{ field: 'lastname', direction: 'desc' },  // and then by lastname
		{ field: 'id', direction: function (a, b) { return a < b ? -1 : 1; } } // finally sort by id using the given function
	],
	onRowClick: function (record, tr) {
		Quantum.log('debug', 'Quantum Table', 'onRowClick', record, tr);
	},
	onRenderCompleted: function () {
		Quantum.log('debug', 'Quantum Table', 'onRenderCompleted');
	}
});
```

## update

The update method let you change or add some of the settings of the table and re-render the table. Just call the method passing an object with the new settings (you don't need to pass all the settings again, you just need to pass the changed or added settings) and the table will be re-rendered with the new settings updated.

Example:

```js
var qt = Quantum.table('#my-table', {
	width: 400,
	// other settings here
});

qt.update({ width: 500 });
```

## destroy

Destroy the table, that will leave the original table element empty.

# Crypto

Quantum Crypto is a module that provides useful cryptographic functions and binary data manipulation.

In order to use this module you need to include the `quantum.crypto.js` file. Be aware that you need to load the core module first to use this module.

```html
<script src="quantum.js"></script>
<script src="quantum.crypto.js"></script>
```

## randomBuffer(bytesNumber)

Return a Uint8Array of `bytesNumber` length filled with random values. Useful to generate salts, random keys, etc. The maximum allowed as `bytesNumber` is `65536`.

Example:

```js
console.log(Quantum.crypto.randomBuffer(128));
```

## bufferToString(buffer)

Return a string representing the input buffer.

## stringToBuffer(string)

Return a Uint8Array buffer representing the input string.

## bufferToBase64(buffer)

Return a base64 string representing the input buffer.

## base64ToBuffer(string)

Return a Uint8Array buffer representing the input base64 string.

## bufferToHex(buffer)

Return a hex string representing the input buffer.

## hexToBuffer(string)

Return a Uint8Array buffer representing the input hex string.

## bufferToURIEncoding(buffer)

Return a URI Encoding string representing the input buffer.

## URIEncodingToBuffer(string)

Return a Uint8Array buffer representing the input URI Encoding string.

## bufferToBitString(buffer)

Return a bit string representing the input buffer.

## bitStringToBuffer(string)

Return a Uint8Array buffer representing the input bit string.

## randomPassword(passwordLength, charset)

Returns a random password of the given `passwordLength` length (default 16) with characters taken from the given `charset` (default `Quantum.crypto.DEFAULTCHARSET`).

## hash(algo, buffer)

Returns a promise with the hash digest of the given buffer. Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512

Example:

```js
Quantum.crypto.hash('SHA-256', Quantum.crypto.stringToBuffer('foobar')).then(function (bufferHash) {
    var hexDigest = Quantum.crypto.bufferToHex(bufferHash);
});
```

## vaultPassword(masterPassword, serviceID, passwordLength, charset)

TODO

## xorcipher(input, key)

Return a Uint8Array representing the input xor key. The xor is applied on each byte (8bit) of the input using the corresponding byte of the key (the key is circular).

```js
var encrypted = Quantum.crypto.xorcipher(Quantum.crypto.stringToBuffer('My secret message'), Quantum.crypto.stringToBuffer('My secret key'));

var decrypted = Quantum.crypto.xorcipher(encrypted, Quantum.crypto.stringToBuffer('My secret key'));
```
