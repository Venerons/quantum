(function () {

const log = function () {
	try {
		const arg = Array.prototype.slice.call(arguments);
		const level = arg.shift();
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

const error = function (error, message) {
	log('error',
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

const guid = function () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

const require = function (settings) {
	let pending = settings.scripts.length;
	const errors = [];
	settings.scripts.forEach(function (script) {
		if (script.type === 'js') {
			const element = document.createElement('script');
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
			const element = document.createElement('link');
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

// exports
if (!window.Quantum) {
	window.Quantum = Object.create(null);
}
window.Quantum.utils = {
	log,
	error,
	guid,
	require
};
})();
