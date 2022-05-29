# jwt-subtle

JWT encoding/decoding using the WebCrypto API for [Cloudflare Workers](https://workers.cloudflare.com/) and Node.js.

![build](https://img.shields.io/github/workflow/status/rav2040/jwt-subtle/unit-tests?style=for-the-badge)
![coverage](https://img.shields.io/coveralls/github/rav2040/jwt-subtle?style=for-the-badge)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/rav2040/jwt-subtle?style=for-the-badge)
![npm](https://img.shields.io/npm/v/jwt-subtle?style=for-the-badge)

### ⚠️ Note

> The WebCrypto API is currently supported in experimental form in Node v15 and greater.

## Basic usage

```js
// Encoding

import { encode } from "jwt-subtle";

const payload = {
  sub: "1234567890",
  name: "John Doe",
  admin: true,
};

const token = await encode(payload, "secret"); // "eyJ0eXAiOiJKV1QiL..."
```

```js
// Decoding

import { decode } from "jwt-subtle";

const token = "eyJ0eXAiOiJKV1QiL...";

const payload = await decode(token, "secret"); // { sub: "1234567890", ... }
```

## API

```ts
// Supported algorithms

type JWTAlgorithm =
  | "HS256" // Default
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512";
```

```ts
encode(payload: object, secret: string, alg?: JWTAlgorithm): Promise<string>
```

```ts
decode(token: string, secret: string, alg?: JWTAlgorithm): Promise<object>
```

## Algorithms

The following two algorithms are supported:

- HMAC
  - `HS256`, `HS384`, and `HS512`
  - Symmetric algorithm; i.e. utilizes the same secret for both encoding and decoding.
- RSASSA-PKCS1-v1_5
  - `RS256`, `RS384`, and `RS512`
  - Assymetric algorithm; the _private_ key must be used for encoding (in PKCS#8 format) and the _public_ key for decoding.

## More examples

### Encoding/decoding with RSA

```js
const privateKey = ... // Get private key from somewhere secure
const token = await encode(payload, privateKey, "RS256")
```

```js
const publicKey = ... // Get public key
const payload = await decode(token, publicKey, "RS256")
```

### Using `nbf` and/or `exp` claims

```js
const payload = {
  id: "c9d22de2d450",
  nbf: Date.now() / 1000 + 86_400,      // Not valid until one day from now
  exp: Date.now() / 1000 + 86_400 * 7,  // Expires in seven days
}

const token = encode(payload, "secret")

...

// Attempting to decode the token before it becomes valid
try {
  await decode(token, "secret")
} catch {
  // Error: Token is not yet active.
}

...

// Attempting to decode the token after it expires
try {
  await decode(token, "secret")
} catch {
  // Error: Token has expired.
}
```

### Decoding with a different algorithm

```js
const token = encode(payload, "secret", "HS256");

try {
  await decode(token, "secret", "HS512");
} catch {
  // Error: Token header "alg" value [HS256] does not match
  // the expected algorithm [HS512].
}
```

## License

[MIT](https://github.com/rav2040/jwt-simple/blob/master/LICENSE)
