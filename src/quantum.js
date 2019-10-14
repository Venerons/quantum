// Quantum | Copyright (c) 2017-2019 Daniele Veneroni | Blue Oak Model License 1.0.0 | https://github.com/Venerons/quantum
(function () {
	'use strict';

	var Quantum = Object.create(null);

	Quantum.exists = function (item) {
		try {
			return item !== null && item !== undefined && typeof item !== 'undefined';
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

	Quantum.query = function (selector) {
		return document.querySelectorAll(selector);
	};

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

	Quantum.require = function (settings) {
		var pending = settings.scripts.length,
			requests = settings.scripts.length,
			errors = [];
		settings.scripts.forEach(function (script) {
			if (script.type === 'js') {
				var element = document.createElement('script');
				element.type = 'application/javascript';
				element.async = script.async ? true : false;
				element.defer = script.defer ? true : false;
				element.onerror = function (e) {
					pending--;
					if (script.onerror) {
						script.onerror.call(null, e);
					}
					errors.push(e);
					if (pending === 0 && settings.onload) {
						settings.onload.call(null, errors);
					}
				};
				element.onload = function () {
					pending--;
					if (script.onload) {
						script.onload.call(null);
					}
					if (pending === 0 && settings.onload) {
						settings.onload.call(null, errors);
					}
				};
				element.src = script.path;
				(document.body || document.head).appendChild(element);
			} else if (script.type === 'css') {
				var element = document.createElement('link');
				element.rel = 'stylesheet';
				element.type = 'text/css';
				element.onerror = function (e) {
					pending--;
					if (script.onerror) {
						script.onerror.call(null, e);
					}
					errors.push(e);
					if (pending === 0 && settings.onload) {
						settings.onload.call(null, errors);
					}
				};
				element.onload = function () {
					pending--;
					if (script.onload) {
						script.onload.call(null);
					}
					if (pending === 0 && settings.onload) {
						settings.onload.call(null, errors);
					}
				};
				element.href = script.path;
				(document.head || document.body).appendChild(element);
			}
		});
	};

	Quantum.ajax = function (settings) {
		if (!settings.url) {
			return false;
		}
		settings.type = settings.type.toUpperCase() || 'GET';
		settings.async = settings.async === undefined ? true : settings.async;
		settings.contentType = settings.contentType || 'application/x-www-form-urlencoded';
		settings.responseType = settings.responseType || 'text';
		settings.uploadProgress = settings.uploadProgress || function (p) { console.log('XMLHttpRequest Upload ' + p + '%'); };
		settings.progress = settings.progress || function (p) { console.log('XMLHttpRequest Response ' + p + '%'); };
		settings.success = settings.success || function (data) { console.log(data); };
		settings.error = settings.error || function (error) { console.error(error); };

		// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

		try {
			var xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					settings.uploadProgress(Math.round((e.loaded * 100) / e.total));
				} else {
					console.log('upload progress - not computable');
				}
			}, false);

			xhr.upload.addEventListener('error', function (e) {
				settings.error(new Error('XMLHttpRequest Upload Error'));
			}, false);

			xhr.upload.addEventListener('abort', function (e) {
				settings.error(new Error('XMLHttpRequest Upload Aborted'));
			}, false);
			
			xhr.upload.addEventListener('load', function (e) {
				settings.uploadProgress(100);
				console.log('xhr upload load - xhr upload completed');
			}, false);

			xhr.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					settings.progress(Math.round((e.loaded * 100) / e.total));
				} else {
					console.log('xhr progress - not computable');
				}
			}, false);

			xhr.addEventListener('error', function (e) {
				settings.error(new Error('XMLHttpRequest Error - Connection error of some sort'));
			}, false);

			xhr.addEventListener('abort', function (e) {
				settings.error(new Error('XMLHttpRequest Abort'));
			}, false);
			
			xhr.addEventListener('load', function (e) {
				if (xhr.status >= 200 && xhr.status < 400 || xhr.status === 0) {
					var response;
					// TODO - responseType 'xml' is permitted?
					if (settings.responseType.toLowerCase() === 'xml') {
						response = xhr.responseXML;
					} else if (settings.responseType.toLowerCase() === 'arraybuffer') {
						response = xhr.response;
					} else {
						response = xhr.responseText;
					}
					if (settings.responseType.toLowerCase() === 'json') {
						response = JSON.parse(response);
					}
					settings.success(response);
				} else {
					settings.error(new Error('XMLHttpRequest Error - Server reached, but it returned an error'));
				} 
			}, false);

			if (settings.type === 'GET') {
				if (settings.data) {
					settings.url += '?' + settings.data;
				}
				xhr.open(settings.type, settings.url, settings.async);
				xhr.responseType = settings.responseType;
				xhr.send(null);
			} else if (settings.type === 'POST') {
				xhr.open(settings.type, settings.url, settings.async);
				xhr.responseType = settings.responseType;
				xhr.setRequestHeader('Content-Type', settings.contentType);
				var data = null;
				if (settings.data) {
					// about content type: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Submitting_forms_and_uploading_files
					if (settings.contentType === 'application/x-www-form-urlencoded') {
						data = settings.data;
					} else if (settings.contentType === 'text/plain') {
						// TODO - check if data is already a well formatted text contentype and convert it otherwise
						data = settings.data;
					} else if (settings.contentType === 'multipart/form-data') {
						// https://developer.mozilla.org/en-US/docs/Web/API/FormData
						if (settings.data.toString() === '[object HTMLFormElement]') {
							data = new FormData(settings.data);
						} else {
							data = new FormData()
							if (typeof settings.data === 'string') {
								// TODO - convert string and then append
							} else {
								for (var key in settings.data) {
									if (settings.data.hasOwnProperty(key)) {
										data.append(key.toString(), settings.data[key]);
									}
								}
							}
						}
					}
				}
				xhr.send(data);
			}
		} catch (e) {
			settings.error(e);
		}
	};

	Quantum.is_integer = function (value) {
		return !isNaN(value) && Quantum.is_integer.regex.test(value);
	};
	Quantum.is_integer.regex = /^[-+]?[0-9]+$/;

	Quantum.is_float = function (value) {
		return !isNaN(value) && Quantum.is_float.regex.test(value);
	};
	Quantum.is_float.regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

	// validate i.e. 12ADff, #12ADff, 0x12ADff
	Quantum.is_hex = function (string) {
		return Quantum.is_hex.regex.test(string);
	};
	Quantum.is_hex.regex = /^((0x|0X)?|#?)[a-fA-F0-9]+$/;

	Quantum.is_email = function (string) {
		return Quantum.is_email.regex.test(string);
	};
	Quantum.is_email.regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	//Quantum.is_email.regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	Quantum.is_IPv4 = function (string) {
		return Quantum.is_IPv4.regex.test(string);
	};
	Quantum.is_IPv4.regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

	Quantum.is_IPv6 = function (string) {
		return Quantum.is_IPv6.regex.test(string);
	};
	Quantum.is_IPv6.regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

	window.Quantum = Quantum;
})();
