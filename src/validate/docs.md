## Quantum.validate.integer

Returns `true` if the given value is an integer number, `false` otherwise.

Example:

```js
console.log(Quantum.validate.integer(1970)); // true
console.log(Quantum.validate.integer(-1970)); // true
console.log(Quantum.validate.integer(1970.5)); // false
console.log(Quantum.validate.integer(-1970.5)); // false
console.log(Quantum.validate.integer('1970')); // true
console.log(Quantum.validate.integer('-1970')); // true
console.log(Quantum.validate.integer('1970.5')); // false
console.log(Quantum.validate.integer('-1970.5')); // false
console.log(Quantum.validate.integer('hello')); // false
```

## Quantum.validate.float

Returns `true` if the given value is a floating point number, `false` otherwise.

Example:

```js
console.log(Quantum.validate.float(1970)); // true
console.log(Quantum.validate.float(-1970)); // true
console.log(Quantum.validate.float(1970.5)); // true
console.log(Quantum.validate.float(-1970.5)); // true
console.log(Quantum.validate.float('1970')); // true
console.log(Quantum.validate.float('-1970')); // true
console.log(Quantum.validate.float('1970.5')); // true
console.log(Quantum.validate.float('-1970.5')); // true
console.log(Quantum.validate.float('hello')); // false
```

## Quantum.validate.hex

Returns `true` if the given value is an hexadecimal value, `false` otherwise. Validates i.e. 12ADff, #12ADff, 0x12ADff

Example:

```js
console.log(Quantum.validate.hex('12ADff')); // true
console.log(Quantum.validate.hex('#12ADff')); // true
console.log(Quantum.validate.hex(0x12ADff)); // true
console.log(Quantum.validate.hex('0x12ADff')); // true
```

## Quantum.validate.email

Returns `true` if the given value is a valid email address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.email('john.doe@gmail.com')); // true
```

## Quantum.validate.ipv4

Returns `true` if the given value is a valid IPv4 address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.ipv4('192.168.0.1')); // true
```

## Quantum.validate.ipv6

Returns `true` if the given value is a valid IPv6 address, `false` otherwise.

Example:

```js
console.log(Quantum.validate.ipv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // true
```
