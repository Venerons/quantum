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
			q._renderGrid();
			return q;
		}
	}

	QuantumTable.prototype._renderGrid = function () {
		var q = this;

		var caption, colgroup, thead, tbody, tfoot;

		// CAPTION
		if (q.settings.caption) {
			caption = document.createElement('caption');
			caption.textContent = q.settings.caption;
		}

		// COLGROUP
		colgroup = document.createElement('colgroup');
		q.settings.columns.forEach(function (column) {
			var col = document.createElement('col');
			if (column.size) {
				col.style.width = column.size;
			}
			if (column.hidden) {
				col.hidden = true; // th.setAttribute('hidden', true);
			}
			colgroup.appendChild(col);
		});

		// THEAD
		var tr;
		q.settings.columns.forEach(function (column) {
			if (column.caption || column.hidden) {
				var th = document.createElement('th');
				if (column.caption) {
					th.textContent = column.caption;
				}
				/*
				if (column.size) {
					th.style.width = column.size;
				}
				*/
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
			groups['No Group'] = q.settings.records;
		} else {
			q.settings.records.forEach(function (record) {
				var g = record[q.settings.group.field];
				if (!g) {
					g = 'No Group';
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
				} else if (s.direction === 'desc') {
					if (a[s.field] > b[s.field]) {
						return -1;
					} else if (a[s.field] < b[s.field]) {
						return 1;
					} else {
						return chainSort(index + 1, a, b);
					}
				} else { // s.direction === 'asc'
					if (a[s.field] < b[s.field]) {
						return -1;
					} else if (a[s.field] > b[s.field]) {
						return 1;
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

		(q.settings.group && q.settings.group.sort ? Object.keys(groups).sort(q.settings.group.sort) : Object.keys(groups)).forEach(function (groupID) {
			var group = groups[groupID];
			if (q.settings.group) {
				var tr = document.createElement('tr'),
					td = document.createElement('td');
				td.setAttribute('colspan', q.settings.columns.length);
				if (q.settings.group.render) {
					td.innerHTML = q.settings.group.render.call(q, groupID);
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
					try {
						td.dataset.value = record[column.field].toString();
					} catch (e) {}
					if (column.render) {
						td.innerHTML = column.render.call(q, record[column.field], record);
					} else {
						td.textContent = record[column.field];
					}
					if (column.hidden) {
						td.hidden = true; // td.setAttribute('hidden', true);
					}
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});
		});

		// TFOOT
		//tfoot = document.createElement('tfoot');
		// TODO

		var element = q.element || document.querySelector(q.selector);
		if (element) {
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

		if (q.settings.onRenderCompleted) {
			q.settings.onRenderCompleted.call(q);
		}
		return q;
	};

	if (!window.Quantum) {
		window.Quantum = Object.create(null);
	}
	window.Quantum.table = QuantumTable;
})();

/*
console.time('render');
var qt = Quantum.table('#my-table', {
	width: 400, // number of px, or string with specific unit (i.e. '100%')
	height: 200, // number of px, or string with specific unit (i.e. '100%')
	caption: 'Teams',
	records: [
		{ id: 1, team: 'Red', firstname: 'Mario', lastname: 'Rossi' },
		{ id: 2, team: 'Blue', firstname: 'Daniele', lastname: 'Pino' },
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
			render: function (value, record) { return '<em>' + value + '</em>'; }
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
		sort: function (a, b) { return a < b ? -1 : 1; },
		render: function (value) { return '<strong>' + value + '</strong>'; }
	},
	sort: [
		{ field: 'firstname', direction: 'asc' },
		{ field: 'lastname', direction: 'desc' }
	],
	onRenderCompleted: function () {
		console.timeEnd('render');
	}
});
*/
