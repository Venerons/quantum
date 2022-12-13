# Quantum

Quantum is a suite of JavaScript libraries.

## Usage

For each library you need, add the script to your page:

```html
<script src="quantum.validate.js"></script>
```

You can also use jsDelivr as CDN if you prefer:

[![](https://data.jsdelivr.com/v1/package/gh/Venerons/quantum/badge)](https://www.jsdelivr.com/package/gh/Venerons/quantum)

```html
<!-- latest relase -->
<script src="https://cdn.jsdelivr.net/gh/Venerons/quantum/src/quantum.table.min.js"></script>

<!-- tagged relase -->
<script src="https://cdn.jsdelivr.net/gh/Venerons/quantum@2.0.0/src/quantum.table.min.js"></script>
```

Then use the functions you need. Each library adds a module under `Quantum.<module_name>`:

```js
const my_email = 'test@gmail.com';
if (Quantum.validate.email(my_email) {
  ...
}
```

[Read the full documentation](docs.md). 

## Licensing

Quantum is released under MIT License (X11 License). [Read the full license](LICENSE.md). 

## Credits

Created and maintained by [Daniele Veneroni](https://venerons.github.io).
