# Quantum

![](https://img.shields.io/github/license/Venerons/quantum?style=for-the-badge)
![](https://img.shields.io/github/v/release/Venerons/quantum?style=for-the-badge)
![](https://img.shields.io/github/issues/Venerons/quantum?style=for-the-badge)

Quantum is a suite of JavaScript libraries.

## Libraries

![](https://img.shields.io/github/size/Venerons/quantum/src/quantum.utils.js?label=utils&style=for-the-badge)
![](https://img.shields.io/github/size/Venerons/quantum/src/quantum.validate.js?label=validate&style=for-the-badge)
![](https://img.shields.io/github/size/Venerons/quantum/src/quantum.table.js?label=table&style=for-the-badge)
![](https://img.shields.io/github/size/Venerons/quantum/src/quantum.crypto.js?label=crypto&style=for-the-badge)

## Usage

For each library you need, add the script to your page:

```html
<script src="quantum.validate.js"></script>
```

You can also use jsDelivr as CDN if you prefer:

[![](https://data.jsdelivr.com/v1/package/gh/Venerons/quantum/badge)](https://www.jsdelivr.com/package/gh/Venerons/quantum)

```html
<!-- latest relase -->
<script src="https://cdn.jsdelivr.net/gh/Venerons/quantum/src/quantum.validate.min.js"></script>

<!-- tagged relase -->
<script src="https://cdn.jsdelivr.net/gh/Venerons/quantum@2.0.0/src/quantum.validate.min.js"></script>
```

Then use the functions you need. Each library adds a module under `Quantum.<module_name>`:

```js
const my_email = 'test@gmail.com';
if (Quantum.validate.email(my_email) {
  ...
}
```

## Licensing

Copyright (c) 2017 – 2023 Daniele Veneroni

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
