(function () {
	'use strict';

	var Quantum = Object.create(null);

	Quantum.version = '1.0.0';

	Quantum.exists = function (item) {
		try {
			return item !== null && item !== 'null' && item !== undefined && item !== 'undefined' && typeof item !== 'undefined';
		} catch (e) {
			return false;
		}
	};

	Quantum.log = function () {
		try {
			var arg = Array.prototype.slice.call(arguments);
			var level = arg.shift();
			if (level === 'debug') {
				arg.unshift('color: lightgreen');
				arg.unshift('🔧 %c[Debug]');
				console.log.apply(console, arg);
			} else if (level === 'info') {
				arg.unshift('color: dodgerblue');
				arg.unshift('🔧 %c[Info]');
				console.info.apply(console, arg);
			} else if (level === 'warn') {
				arg.unshift('color: orange');
				arg.unshift('🔧 %c[Warning]');
				console.warn.apply(console, arg);
			} else if (level === 'error') {
				arg.unshift('color: crimson');
				arg.unshift('🔧 %c[Error]');
				console.error.apply(console, arg);
			} else {
				arg.unshift(level);
				console.log.apply(console, arg);
			}
		} catch (e) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};

	Quantum.error = function (error, message) {
		Quantum.log(
			'error',
			(message ? message : '') +
			'\n\n' +
			(error.toString()   ? 'Error:\t\t' + error.toString() : '') +
			(error.name         ? '\nName:\t\t' + error.name : '') +
			(error.message      ? '\nMessage:\t' + error.message : '') +
			(error.fileName     ? '\nFile:\t\t' + error.fileName : '') +
			(error.toSource     ? '\nSource:\t\t' + error.toSource() : '') +
			(error.lineNumber   ? '\nLine #:\t\t' + error.lineNumber : '') +
			(error.columnNumber ? '\nColumn #:\t' + error.columnNumber : '') +
			(error.stack        ? '\n\nStack:\n\n' + error.stack : ''));
	};

	/*
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
	*/

	Quantum.type = function (object) {
		return Object.prototype.toString.call(object).replace(/^\[object (.+)\]$/, '$1');
	};

	Quantum.guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	/*
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
	*/

	Quantum.require = function (settings) {
		var pending = settings.scripts.length,
			requests = settings.scripts.length;
		settings.scripts.forEach(function (script) {
			var element, node;
			var callback = function () {
				pending--;
				//console.log('Quantum.require: ' + (100 - (100 * pending / requests)).toFixed(2) + '% - Loaded: ' + script.path + ' - Pending: ' + pending);
				if (script.onload) {
					script.onload.call();
				}
				if (pending === 0 && settings.onload) {
					settings.onload.call();
				}
			};
			if (script.type === 'js') {
				element = document.createElement('script');
				element.type = 'application/javascript';
				element.async = script.async ? true : false;
				element.defer = script.defer ? true : false;
				element.onload = callback;
				element.src = script.path;
				node = document.body || document.head;
			} else if (script.type === 'css') {
				element = document.createElement('link');
				element.rel = 'stylesheet';
				element.type = 'text/css';
				element.onload = callback;
				element.href = script.path;
				node = document.head || document.body;
			}
			if (element && node) {
				node.appendChild(element);
			}
		});
	};

	Quantum.isInteger = function (value) {
		return !isNaN(value) && Quantum.isInteger.regex.test(value);
	};
	Quantum.isInteger.regex = /^[-+]?[0-9]+$/;

	Quantum.isFloat = function (value) {
		return !isNaN(value) && Quantum.isFloat.regex.test(value);
	};
	Quantum.isFloat.regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

	// validate i.e. 12ADff, #12ADff, 0x12ADff
	Quantum.isHex = function (string) {
		return Quantum.isHex.regex.test(string);
	};
	Quantum.isHex.regex = /^((0x|0X)?|#?)[a-fA-F0-9]+$/;

	Quantum.isEmail = function (string) {
		return Quantum.isEmail.regex.test(string);
	};
	Quantum.isEmail.regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	//Quantum.isEmail.regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	Quantum.isIPv4 = function (string) {
		return Quantum.isIPv4.regex.test(string);
	};
	Quantum.isIPv4.regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

	window.Quantum = Quantum;
})();
