# Quantum.utils

Quantum Utils is a module that contains many useful functions.

## Quantum.utils.log

Show a log on the Browser's Javascript Console, styled based on the given level. Levels are `debug`, `info`, `warn`, `error`. If the first parameter is not a valid level, then a simple unstyled log is shown.

Example:

```js
var myfunc = function (a, b, c) {
	Quantum.utils.log('debug', 'myfunc', a, b, c);
};
```

## Quantum.utils.error

Show a log on the browser's JavaScript console with detailed infos on the given error.

Example 1:

```js
try {
	// some code
} catch (e) {
	Quantum.utils.error(e, 'Oh no! An error!');
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
	Quantum.utils.error(error, 'Uncatched Exception');
};
```

## Quantum.utils.guid

Returns a random GUID, useful for identify objects and elements.

Example:

```js
console.log(Quantum.utils.guid()); // i.e. "1db1fef5-5e88-46d7-8a71-5a5c9d7ae880"
```

## Quantum.utils.require

Load and execute CSS and JavaScript files. Files are loaded and executed in the given order, unless you use `async` or `defer` options. You can assign a function to be executed after every single script is loaded or when all scripts are loaded.

Example:

```js
Quantum.utils.require({
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

# Quantum.validate

Quantum Validate is a module that contains many validation functions.

## Quantum.validate.integer

Returns `true` if the given value is an integer number, `false` otherwise.

Example:

```js
console.log(Quantum.validate.integer(1970)); // true
console.log(Quantum.validate.integer(-1970)); // true
console.log(Quantum.validate.integer(1970.5)); // false
console.log(Quantum.validate.integer(-1970.5)); // false
console.log(Quantum.validate.integer('1970')); // true
console.log(Quantum.validate.integer('-1970')); // true
console.log(Quantum.validate.integer('1970.5')); // false
console.log(Quantum.validate.integer('-1970.5')); // false
console.log(Quantum.validate.integer('hello')); // false
```

## Quantum.validate.float

Returns `true` if the given value is a floating point number, `false` otherwise.

Example:

```js
console.log(Quantum.validate.float(1970)); // true
console.log(Quantum.validate.float(-1970)); // true
console.log(Quantum.validate.float(1970.5)); // true
console.log(Quantum.validate.float(-1970.5)); // true
console.log(Quantum.validate.float('1970')); // true
console.log(Quantum.validate.float('-1970')); // true
console.log(Quantum.validate.float('1970.5')); // true
console.log(Quantum.validate.float('-1970.5')); // true
console.log(Quantum.validate.float('hello')); // false
```

## Quantum.validate.hex

Returns `true` if the given value is an hexadecimal value, `false` otherwise. Validates i.e. 12ADff, #12ADff, 0x12ADff

Example:

```js
console.log(Quantum.validate.hex('12ADff')); // true
console.log(Quantum.validate.hex('#12ADff')); // true
console.log(Quantum.validate.hex(0x12ADff)); // true
console.log(Quantum.validate.hex('0x12ADff')); // true
```

## Quantum.validate.email

Returns `true` if the given value is a valid email address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.email('john.doe@gmail.com')); // true
```

## Quantum.validate.ipv4

Returns `true` if the given value is a valid IPv4 address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.ipv4('192.168.0.1')); // true
```

## Quantum.validate.ipv6

Returns `true` if the given value is a valid IPv6 address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.ipv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // true
```

# Quantum.table

Quantum Table is a module that let you create standard HTML5 tables with ease.

## Quantum.table

Create and render a table, and returns an object that let you update it later. The first parameter can be either a CSS3 selector (i.e. `'#my-table'`) that resolves to a `<table>` element, or directly an `HTMLTableElement` element. The second parameter is an object that contains all the settings of the table. You can find documentation about settings on the **Table Settings** section.

Examples:

```js
// selector resolves to a <table> element, given that an element like <table id="my-table"></table> exists.
const qt = Quantum.table('#my-table', { ... });

// selector is an HTMLTableElement element, given that an element like <table id="my-table"></table> exists.
const qt = Quantum.table(document.getElementById('my-table'), { ... });

// selector is an HTMLTableElement element created on the fly, rendered on memory and then later added to the DOM.
const table = document.createElement('table');
const qt = Quantum.table(table, { ... });
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
const qt = Quantum.table('#my-table', {
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
	on_row_click: function (record, tr) {
		Quantum.utils.log('debug', 'Quantum.table', 'on_row_click', record, tr);
	},
	on_render_completed: function () {
		Quantum.utils.log('debug', 'Quantum.table', 'on_render_completed');
	}
});
```

## update

The update method let you change or add some of the settings of the table and re-render the table. Just call the method passing an object with the new settings (you don't need to pass all the settings again, you just need to pass the changed or added settings) and the table will be re-rendered with the new settings updated.

Example:

```js
const qt = Quantum.table('#my-table', {
	width: 400,
	// other settings here
});

qt.update({ width: 500 });
```

## destroy

Destroy the table, that will leave the original table element empty.

# Quantum.crypto

Quantum Crypto is a module that contains many crypto functions.

## Quantum.crypto.random_buffer(bytes_number)

Return a Uint8Array of `bytes_number` length filled with random values. Useful to generate salts, random keys, etc. The maximum allowed as `bytes_number` is `65536`.

Example:

```js
console.log(Quantum.crypto.random_buffer(128));
```

## Quantum.crypto.random_password(length, charset)

Returns a random password of the given `length` (default 16) with characters taken from the given `charset` (default `Quantum.crypto.DEFAULTCHARSET`).

## Quantum.crypto.buffer_to_string(buffer)

Return a string representing the input buffer.

## Quantum.crypto.string_to_buffer(string)

Return a Uint8Array buffer representing the input string.

## Quantum.crypto.buffer_to_hex(buffer)

Return a hex string representing the input buffer.

## Quantum.crypto.hex_to_buffer(string)

Return a Uint8Array buffer representing the input hex string.

## Quantum.crypto.hash(algorithm, buffer)

Returns a promise with the hash digest of the given buffer. Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512

Example:

```js
Quantum.crypto.hash('SHA-256', Quantum.crypto.string_to_buffer('foobar')).then(function (buffer_hash) {
    const hex_digest = Quantum.crypto.buffer_to_hex(buffer_hash);
});
```

## Quantum.crypto.xorcipher(input, key)

Return a Uint8Array representing the input xor key. The xor is applied on each byte (8bit) of the input using the corresponding byte of the key (the key is circular).

```js
const encrypted = Quantum.crypto.xorcipher(Quantum.crypto.string_to_buffer('My secret message'), Quantum.crypto.string_to_buffer('My secret key'));
const decrypted = Quantum.crypto.xorcipher(encrypted, Quantum.crypto.string_to_buffer('My secret key'));
```
