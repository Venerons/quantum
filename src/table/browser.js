(function () {
	function QuantumTable(selector, settings) {
		const q = this;
		if (!(this instanceof QuantumTable)) {
			return new QuantumTable(selector, settings);
		} else {
			if (typeof(selector) === 'string') {
				q.selector = selector;
			} else {
				q.element = selector;
			}
			q.settings = settings;
			q.render();
			return q;
		}
	}

	QuantumTable.prototype.render = function () {
		const q = this;
		let caption, colgroup, thead, tbody, tfoot;

		// CAPTION
		if (q.settings.caption) {
			caption = document.createElement('caption');
			caption.textContent = q.settings.caption;
		}

		// COLGROUP
		/*
		colgroup = document.createElement('colgroup');
		q.settings.columns.forEach(function (column) {
			const col = document.createElement('col');
			if (column.size) {
				col.style.width = typeof column.size === 'number' ? column.size + 'px' : column.size;
			}
			colgroup.appendChild(col);
		});
		*/

		// THEAD
		let tr;
		q.settings.columns.forEach(function (column) {
			if (column.caption || column.hidden) {
				const th = document.createElement('th');
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
		const groups = {};
		if (!q.settings.group) {
			groups['undefined'] = q.settings.records;
		} else {
			q.settings.records.forEach(function (record) {
				let g = record[q.settings.group.field];
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
				const s = q.settings.sort[index];
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
					const ret = s.direction(a[s.field], b[s.field]);
					if (ret !== 0) {
						return ret;
					} else {
						return chainSort(index + 1, a, b);
					}
				}
			};
			Object.keys(groups).forEach(function (groupID) {
				const group = groups[groupID];
				group.sort(function (a, b) {
					return chainSort(0, a, b);
				});
			});
		}

		let array;
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
			const group = groups[groupID];
			if (q.settings.group) {
				const tr = document.createElement('tr');
				const td = document.createElement('td');
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
				const tr = document.createElement('tr');
				q.settings.columns.forEach(function (column) {
					const td = document.createElement('td');
					if (column.style) {
						td.setAttribute('style', column.style); // td.style = column.style;
					}
					if (column.hidden) {
						td.hidden = true; // td.setAttribute('hidden', true);
					}
					const value = record[column.field];
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
				const row_click_func = q.settings.on_row_click || q.settings.onRowClick;
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

		const element = q.element || document.querySelector(q.selector);
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

		const render_completed_func = q.settings.on_render_completed || q.settings.onRenderCompleted;
		if (render_completed_func) {
			render_completed_func.call(q);
		}
		return q;
	};

	QuantumTable.prototype.update = function (settings) {
		const q = this;
		if (settings) {
			Object.keys(settings).forEach(function (prop) {
				q.settings[prop] = settings[prop];
			});
			q.render();
		}
		return q;
	};

	QuantumTable.prototype.destroy = function () {
		const q = this;
		const element = q.element || document.querySelector(q.selector);
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
