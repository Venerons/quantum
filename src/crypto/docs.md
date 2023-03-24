## Quantum.crypto.random_buffer(bytes_number)

Return a Uint8Array of `bytes_number` length filled with random values. Useful to generate salts, random keys, etc. The maximum allowed as `bytes_number` is `65536`.

Example:

```js
console.log(Quantum.crypto.random_buffer(128));
```

## Quantum.crypto.random_password(length, charset)

Returns a random password of the given `length` (default 16) with characters taken from the given `charset` (default `Quantum.crypto.DEFAULTCHARSET`).

## Quantum.crypto.hash(algorithm, buffer)

Returns a promise with the hash digest of the given buffer. Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512

Example:

```js
Quantum.crypto.hash('SHA-256', Quantum.crypto.string_to_buffer('foobar')).then(function (buffer_hash) {
    const hex_digest = Quantum.crypto.buffer_to_hex(buffer_hash);
});
```
