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
