import { base64ToUint8Array, uint8ArrayToBase64 } from "./base64";

export type JWTAlgorithm = keyof typeof ALGORITHM_PARAMS;
export type JWTHeader = { typ: "JWT"; alg: JWTAlgorithm };
export type JWTPayload = Record<string, unknown> & { exp?: number; nbf?: number };

const PRIVATE_KEY_HEADER = "-----BEGIN PRIVATE KEY-----";
const PRIVATE_KEY_FOOTER = "-----END PRIVATE KEY-----";

const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
const PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";

export const ALGORITHM_PARAMS = {
  HS256: { name: "HMAC", hash: "SHA-256" },
  HS384: { name: "HMAC", hash: "SHA-384" },
  HS512: { name: "HMAC", hash: "SHA-512" },
  RS256: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
  RS384: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" },
  RS512: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
} as const;

const subtle =
  typeof crypto === "undefined"
    ? (require("crypto").webcrypto as Crypto | undefined)?.subtle
    : /* c8 ignore next */
      (crypto as Crypto | undefined)?.subtle;

/* c8 ignore next */
if (!subtle) throw Error("SubtleCrypto is not supported in the current environment.");

export const encode = async (payload: JWTPayload, secret: string, alg: JWTAlgorithm = "HS256") => {
  const algorithm = ALGORITHM_PARAMS[alg];
  const isSymmetric = algorithm.name === "HMAC";

  const keyData = isSymmetric
    ? new TextEncoder().encode(secret)
    : base64ToUint8Array(secret.trim().slice(PRIVATE_KEY_HEADER.length, -PRIVATE_KEY_FOOTER.length), false);
  const key = await subtle.importKey(isSymmetric ? "raw" : "pkcs8", keyData, algorithm, false, ["sign"]);

  const encodedHeader = b64UrlEncode(`{"typ":"JWT","alg":"${alg}"}`);
  const encodedHeaderAndPayload = encodedHeader + "." + b64UrlEncode(JSON.stringify(payload));

  const signature = await subtle.sign(algorithm, key, new TextEncoder().encode(encodedHeaderAndPayload));

  return encodedHeaderAndPayload + "." + uint8ArrayToBase64(new Uint8Array(signature));
};

export const decode = async (token: string, secret: string, alg: JWTAlgorithm = "HS256") => {
  if (token.split(".").length !== 3) throw Error("Invalid token format.");

  const header = decodeHeader(token);
  const payload = decodePayload(token);
  const now = Date.now() / 1000;

  if (header.alg !== alg) {
    throw Error(`Token header "alg" value [${header.alg}] does not match the expected algorithm [${alg}].`);
  }

  if (payload.nbf && payload.nbf > now) {
    throw Error("Token is not yet active.");
  }

  if (payload.exp && payload.exp < now) {
    throw Error("Token has expired.");
  }

  const algorithm = ALGORITHM_PARAMS[alg];
  const isSymmetric = algorithm.name === "HMAC";
  const keyData = isSymmetric
    ? new TextEncoder().encode(secret)
    : base64ToUint8Array(secret.trim().slice(PUBLIC_KEY_HEADER.length, -PUBLIC_KEY_FOOTER.length), false);

  const key = await subtle.importKey(isSymmetric ? "raw" : "spki", keyData, algorithm, false, ["verify"]);
  const signature = base64ToUint8Array(token.slice(token.lastIndexOf(".") + 1));
  const data = new TextEncoder().encode(token.slice(0, token.lastIndexOf(".")));
  const isVerified = await subtle.verify(algorithm, key, signature, data);

  if (!isVerified) throw Error("Invalid signature.");

  return payload;
};

function decodeHeader(token: string): JWTHeader {
  return JSON.parse(new TextDecoder().decode(base64ToUint8Array(token.slice(0, token.indexOf(".")))));
}

function decodePayload(token: string): JWTPayload {
  const start = token.indexOf(".") + 1;
  const end = token.lastIndexOf(".");
  return JSON.parse(new TextDecoder().decode(base64ToUint8Array(token.slice(start, end))));
}

function b64UrlEncode(utf8: string) {
  return uint8ArrayToBase64(new TextEncoder().encode(utf8));
}
