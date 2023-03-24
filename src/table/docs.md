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
