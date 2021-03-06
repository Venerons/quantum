// Quantum | Copyright (c) 2017-2020 Daniele Veneroni | Blue Oak Model License 1.0.0 | https://github.com/Venerons/quantum
(function () {
	'use strict';

	function QuantumTable(selector, settings) {
		var q = this;
		if (!(this instanceof QuantumTable)) {
			return new QuantumTable(selector, settings);
		} else {
			if (typeof(selector) === 'string') {
				q.selector = selector;
			} else {
				q.element = selector;
			}
			q.settings = settings;
			q._render();
			return q;
		}
	}

	QuantumTable.prototype._render = function () {
		var q = this;

		var caption, colgroup, thead, tbody, tfoot;

		// CAPTION
		if (q.settings.caption) {
			caption = document.createElement('caption');
			caption.textContent = q.settings.caption;
		}

		// COLGROUP
		/*
		colgroup = document.createElement('colgroup');
		q.settings.columns.forEach(function (column) {
			var col = document.createElement('col');
			if (column.size) {
				col.style.width = typeof column.size === 'number' ? column.size + 'px' : column.size;
			}
			colgroup.appendChild(col);
		});
		*/

		// THEAD
		var tr;
		q.settings.columns.forEach(function (column) {
			if (column.caption || column.hidden) {
				var th = document.createElement('th');
				if (column.caption) {
					th.textContent = column.caption;
				}
				if (column.size) {
					th.style.width = typeof column.size === 'number' ? column.size + 'px' : column.size;
				}
				if (column.hidden) {
					th.hidden = true; // th.setAttribute('hidden', true);
				}
				if (!tr) {
					tr = document.createElement('tr');
				}
				tr.appendChild(th);
			}
		});
		if (tr) {
			thead = document.createElement('thead');
			thead.appendChild(tr);
		}

		// TBODY
		tbody = document.createElement('tbody');
		var groups = {};
		if (!q.settings.group) {
			groups['undefined'] = q.settings.records;
		} else {
			q.settings.records.forEach(function (record) {
				var g = record[q.settings.group.field];
				if (g === null || g === undefined) {
					g = 'undefined';
				}
				if (!groups[g]) {
					groups[g] = [];
				}
				groups[g].push(record);
			});
		}

		if (q.settings.sort) {
			var chainSort = function (index, a, b) {
				var s = q.settings.sort[index];
				if (!s) {
					return 0;
				} else if (s.direction === 'asc') {
					if (a[s.field] < b[s.field]) {
						return -1;
					} else if (a[s.field] > b[s.field]) {
						return 1;
					} else {
						return chainSort(index + 1, a, b);
					}
				} else if (s.direction === 'desc') {
					if (a[s.field] > b[s.field]) {
						return -1;
					} else if (a[s.field] < b[s.field]) {
						return 1;
					} else {
						return chainSort(index + 1, a, b);
					}
				} else {
					var ret = s.direction(a[s.field], b[s.field]);
					if (ret !== 0) {
						return ret;
					} else {
						return chainSort(index + 1, a, b);
					}
				}
			};
			Object.keys(groups).forEach(function (groupID) {
				var group = groups[groupID];
				group.sort(function (a, b) {
					return chainSort(0, a, b);
				});
			});
		}

		var array;
		if (q.settings.group && q.settings.group.sort) {
			if (q.settings.group.sort === 'asc') {
				array = Object.keys(groups).sort(function (a, b) { return a < b ? -1 : 1; });
			} else if (q.settings.group.sort === 'desc') {
				array = Object.keys(groups).sort(function (a, b) { return a > b ? -1 : 1; });
			} else {
				array = Object.keys(groups).sort(q.settings.group.sort);
			}
		} else {
			array = Object.keys(groups);
		}
		array.forEach(function (groupID) {
			var group = groups[groupID];
			if (q.settings.group) {
				var tr = document.createElement('tr'),
					td = document.createElement('td');
				td.setAttribute('colspan', q.settings.columns.length);
				try {
					td.dataset.quantumGroup = typeof groupID === 'string' ? groupID : JSON.stringify(groupID); // data-quantum-group
				} catch (e) {}
				if (q.settings.group.render) {
					td.innerHTML = q.settings.group.render.call(q, groupID, td);
				} else {
					td.textContent = groupID;
				}
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
			group.forEach(function (record) {
				var tr = document.createElement('tr');
				q.settings.columns.forEach(function (column) {
					var td = document.createElement('td');
					if (column.style) {
						td.setAttribute('style', column.style); // td.style = column.style;
					}
					if (column.hidden) {
						td.hidden = true; // td.setAttribute('hidden', true);
					}
					var value = record[column.field];
					try {
						td.dataset.quantumField = column.field; // data-quantum-field
						td.dataset.quantumValue = typeof value === 'string' ? value : JSON.stringify(value); // data-quantum-value
					} catch (e) {}
					if (column.render) {
						td.innerHTML = column.render.call(q, value, record, td);
					} else if (value !== null && value !== undefined) {
						td.textContent = value.toString();
					}
					tr.appendChild(td);
				});
				var row_click_func = q.settings.on_row_click || q.settings.onRowClick;
				if (row_click_func) {
					tr.addEventListener('click', function () {
						row_click_func.call(q, record, tr);
					}, false);
				}
				tbody.appendChild(tr);
			});
		});

		// TFOOT
		//tfoot = document.createElement('tfoot');
		// TODO

		var element = q.element || document.querySelector(q.selector);
		if (element) {
			q.destroy();
			if (q.settings.width) {
				element.style.width = typeof q.settings.width === 'number' ? q.settings.width + 'px' : q.settings.width;
			}
			if (q.settings.height) {
				element.style.height = typeof q.settings.height === 'number' ? q.settings.height + 'px' : q.settings.height;
			}
			if (caption) {
				element.appendChild(caption);
			}
			if (colgroup) {
				element.appendChild(colgroup);
			}
			if (thead) {
				element.appendChild(thead);
			}
			if (tbody) {
				element.appendChild(tbody);
			}
			if (tfoot) {
				element.appendChild(tfoot);
			}
		}

		var render_completed_func = q.settings.on_render_completed || q.settings.onRenderCompleted;
		if (render_completed_func) {
			render_completed_func.call(q);
		}
		return q;
	};

	QuantumTable.prototype.update = function (settings) {
		var q = this;
		if (settings) {
			Object.keys(settings).forEach(function (prop) {
				q.settings[prop] = settings[prop];
			});
			q._render();
		}
		return q;
	};

	QuantumTable.prototype.destroy = function () {
		var q = this,
			element = q.element || document.querySelector(q.selector);
		if (element) {
			try {
				while (element.firstChild) {
					element.firstChild.remove();
				}
			} catch (e) {
				element.innerHTML = '';
			}
		}
		return q;
	};

	if (!window.Quantum) {
		window.Quantum = Object.create(null);
	}
	window.Quantum.table = QuantumTable;
})();
