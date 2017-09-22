# Quantum Documentation

## Usage

TODO

## Core

### Quantum.exists(item)

Returns `true` if the item is not `null` or `undefined`

### Quantum.log(level, item1[, itemN])

Show a log on the Browser's Javascript Console, styled based on the given level. Levels are `debug`, `info`, `warn`, `error`. If the first parameter is not a valid level, then a simple unstyled log is shown.

Example:

```js
var myfunc = function (a, b, c) {
	Quantum.log('debug', 'myfunc', a, b, c);
};
```

### Quantum.error(error[, message])

Show a log on the Browser's Javascript Console with detailed infos on the given error.

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

### Quantum.query(selector)

Return a NodeList with the elements that matches the given CSS selector.

### Quantum.type(object)

Returns the given object's type.

### Quantum.guid()

Returns a random GUID, useful for identify objects and elements.

### Quantum.require(settings)

Load and execute CSS and JavaScript files. Files are loaded and executed in the given order, unless you use `async` or `defer` options. You can assign a function to be executed after every single script is loaded or when all scripts are loaded.

Example:

```js
Quantum.require({
	scripts: [
		{ type: 'css', path: 'path/to/file.css', onload: function () { console.info('Script 1 loaded.'); } },
		{ type: 'css', path: 'path/to/file.css', onload: function () { console.info('Script 2 loaded.'); } },
		{ type: 'js', path: 'path/to/file.js', async: false, defer: false, onload: function () { console.info('Script 3 loaded.'); } },
		{ type: 'js', path: 'path/to/file.js', async: false, defer: false, onload: function () { console.info('Script 4 loaded.'); } }
	],
	onload: function () {
		console.info('Every script has been loaded.');
	}
});
```

### Quantum.ajax(settings)

Execute an AJAX call.

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

### Quantum.isInteger(value)

Returns `true` if the given value is an integer number, `false` otherwise.

### Quantum.isFloat

Returns `true` if the given value is a floating point number, `false` otherwise.

### Quantum.isHex

Returns `true` if the given value is an hexadecimal value, `false` otherwise. Validates i.e. 12ADff, #12ADff, 0x12ADff

### Quantum.isEmail

Returns `true` if the given value is a valid email address, `false` otherwise.

### Quantum.isIPv4

Returns `true` if the given value is a valid IPv4 address, `false` otherwise.

## Table

TODO

## Crypto

TODO
