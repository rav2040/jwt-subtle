import type { JWTAlgorithm } from "../src";

import assert from "assert/strict";
import { encode, decode } from "../src";

const ID = "scf88f6d8-d2f3-11ec-9d64-0242ac120002";
const SECRET = "secret";
const RSA_PRIVATE_KEY = `
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCd/mftZRkNpr4H
  ZCcUGGlMhq5xZYwwa60DMrRbnWi13ND2s/6qTpsfay+vEGLBdUBrv8oRikpdZuJw
  65UsP8lXLMWWTLmTK5i6c0n69aR3y00t6jtSXT1rRJTnvNa1RbGXfxTEJtsxv12O
  Yz9On0EitKTwtNaEzShT+FIP5bBvuMkouXK/aHcCkh29PZ4YB/sePQELyHxABEBG
  oF/ZM5/XuFYinXlhTGeo1IjyV3n0aThi42INVid2/n+3qla72wekd4Rt29Sn0jTM
  Bk48McH/GnGyO2ZY0gavmUqQK6qNsRnwM1dG/zvi36ovNa2Se/7kSE9zM7GFanVY
  i6MnKxpxAgMBAAECggEAD1M/F3rn/DgBVMw1MjDP/flOcHduKsA3DwlbD0vsfT+H
  EXcSK8jmKR0Hig6n1aYe8pSu8Bae8gJp0pQ3awxg5lDUdajJk2n2LZfDRFGRe4E/
  4kVHLc0XiREk9HmPxhOVj2FnTUOLnX63f3lHCcRO2CP3n9WavVT9JW//3cTk4WE/
  LllxmQLmrHD26Hb0C9em0epP40KRIF66idr8e99kiBbaJ+mTzpNpZa4GL0aLoUK7
  N4g6WAuWWSiIDrXF+o7YlD9ZbFNRDVBxHZ6S8VnabYO9Ca/YdeS2SB8wj4sah5Nn
  nWk+gqMvMNoEB3fHmMgdlfNacOZBw5r56I2ZDzOYsQKBgQDREDZB9ugIr+WD51Mt
  JRhbZiWNaG9wxhBeARyYwpal4MZEjzocrI3f5LTRT23xsOMy0EQTTCZJVL3A72Eg
  EvAGBoSqi7mzSDKsnzuoikHAm6VgWgtM0VX3WldmLtvCJFVXJLWOkafsVU0zVAa5
  32HqRPftCKnbcfPZKbGcHQq0hQKBgQDBdwCYYYzOg/rfcjYhGcTewo5/23d5S/gy
  TlAYzZE9zRbJGSMuoV2FBiaRm+AxfQ485NY93snjBEvkOWmvItL1koPCBBeGJTYB
  d6rFRSzIWb7SOS8q5XgbODQNQ/fp6hsoxHMdkC8Bv7NewUHBdakbWEd4CAItoTnm
  0sXTyH/X/QKBgQCG7km2hV74zF37pf9e8cQoqWKvQ6o5RPwnT9xfE6gbY1lTwoUl
  IJFo4bl6JiO1jA73KsflFI7ZYWIe9eDfzJkxql9Rm2C9P2nFU/gzLRiG8W3pI/SL
  Hci4HoyuHKwlP0H9PmoXnBafR+bNq/uzV2Ngyiahy6elRIS3sls5gNz56QKBgG/h
  bgqxf0h+sro9xmfmCx/3y4jNVo5jDKmq+E8fsnrW+/JYAyyYTQj8wZk7V6/G7lDw
  1aT6Di6m8WyOdzu9G9rAXEn7K897/XtjxPJIStmibOQOBeT8xzSWkCOLxvcTV5l/
  4kKae1S7k/OcN3a1oJIbv1j+6KOStXVzNsx/Cs/RAoGAbnl8w4xut97ZomqM/U/e
  FWP4zLssvzKqf7P7pBdY+QFCCxE9p/e/tL/fwdDT5+dyrb1tOa4MZ5mnKmdn8lU8
  WRknLIMMDO3fIVnCUiAjiL6nEVtAdwPS4AzS3uD38SaBrbIIJTguLAKNerPOHSPS
  ulebnZQJnurcB2YRVzu2F28=
  -----END PRIVATE KEY-----
`;

const RSA_PUBLIC_KEY = `
  -----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnf5n7WUZDaa+B2QnFBhp
  TIaucWWMMGutAzK0W51otdzQ9rP+qk6bH2svrxBiwXVAa7/KEYpKXWbicOuVLD/J
  VyzFlky5kyuYunNJ+vWkd8tNLeo7Ul09a0SU57zWtUWxl38UxCbbMb9djmM/Tp9B
  IrSk8LTWhM0oU/hSD+Wwb7jJKLlyv2h3ApIdvT2eGAf7Hj0BC8h8QARARqBf2TOf
  17hWIp15YUxnqNSI8ld59Gk4YuNiDVYndv5/t6pWu9sHpHeEbdvUp9I0zAZOPDHB
  /xpxsjtmWNIGr5lKkCuqjbEZ8DNXRv874t+qLzWtknv+5EhPczOxhWp1WIujJysa
  cQIDAQAB
  -----END PUBLIC KEY-----
`;

(["HS256", "HS384", "HS512"] as const).forEach((algorithm) => {
  test(algorithm, SECRET, SECRET);
});

(["RS256", "RS384", "RS512"] as const).forEach((algorithm) => {
  test(algorithm, RSA_PRIVATE_KEY, RSA_PUBLIC_KEY);
});

async function test(algorithm: JWTAlgorithm, privateKey: string, publicKey: string) {
  // Encodes a payload and decodes it successfully.
  {
    const payload = { id: ID };
    const token = await encode(payload, privateKey, algorithm);
    const result = await decode(token, publicKey, algorithm);
    assert.deepEqual(result, payload);
  }

  // Decodes an active token successfully.
  {
    const payload = { id: ID, nbf: Math.floor(Date.now() / 1000) - 1000 };
    const token = await encode(payload, privateKey, algorithm);
    const result = await decode(token, publicKey, algorithm);
    assert.deepEqual(result, payload);
  }

  // Decodes a token that has not expired successfully.
  {
    const payload = { id: ID, exp: Math.floor(Date.now() / 1000) + 1000 };
    const token = await encode(payload, privateKey, algorithm);
    const result = await decode(token, publicKey, algorithm);
    assert.deepEqual(result, payload);
  }

  // Rejects when decoding a token with an invalid format.
  {
    assert.rejects(decode("foo.bar", publicKey, algorithm), Error("Invalid token format."));
  }

  // Rejects when decoding a token without a matching "alg" value.
  {
    const alg1 = algorithm;
    const alg2 = algorithm === "HS256" ? "HS384" : "HS256";
    assert.notEqual(alg1, alg2);

    const payload = { id: ID };
    const token = await encode(payload, privateKey, alg1);
    assert.rejects(
      decode(token, publicKey, alg2),
      Error(`Token header "alg" value [${alg1}] does not match the expected algorithm [${alg2}].`)
    );
  }

  // Rejects when decoding a not yet active token.
  {
    const payload = { id: ID, nbf: Math.floor(Date.now() / 1000) + 1000 };
    const token = await encode(payload, privateKey, algorithm);
    assert.rejects(decode(token, publicKey, algorithm), Error("Token is not yet active."));
  }

  // Rejects when decoding an expired token.
  {
    const payload = { id: ID, exp: Math.floor(Date.now() / 1000) - 1000 };
    const token = await encode(payload, privateKey, algorithm);
    assert.rejects(decode(token, publicKey, algorithm), Error("Token has expired."));
  }

  // Rejects when decoding a token with an invalid signature.
  {
    const token = await encode({ id: ID }, privateKey, algorithm);
    const invalidSignature = token.slice(token.lastIndexOf(".") + 1).replace(/./g, "A");
    const invalidToken = token.slice(0, token.lastIndexOf(".") + 1) + invalidSignature;
    assert.rejects(decode(invalidToken, publicKey, algorithm), Error("Invalid signature."));
  }
}
