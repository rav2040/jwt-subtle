/**
 * Base64 encoding and decoding.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
 */

export function uint8ArrayToBase64(bytes: Uint8Array, urlSafe = true) {
  const str = Array.from(bytes).reduce((prev, _, i, arr) => {
    if (i % 3 !== 2 && i < arr.length - 1) return prev;

    const segment = (() => {
      const nUint24 = new Array((i % 3) + 1).fill(0).reduce<number>((prev, _, j, { length }) => {
        const byteIndex = j - i + length - 1 + Math.floor(i / 3) * 6;
        return prev | (arr[byteIndex] << ((16 >>> j % 3) & 24));
      }, 0);

      return [18, 12, 6, 0].reduce((prev, bits) => {
        const codePoint = ((n) => {
          if (n >= 26 && n < 52) return n + 71;
          if (n >= 52 && n < 62) return n - 4;
          if (n === 62) return urlSafe ? 45 : 43;
          if (n === 63) return urlSafe ? 95 : 47;
          return n + 65;
        })((nUint24 >>> bits) & 63);

        return prev + String.fromCodePoint(codePoint);
      }, "");
    })();

    return prev + segment;
  }, "");

  return str.slice(0, str.length - 2 + ((bytes.length - 1) % 3)).padEnd(str.length, urlSafe ? "" : "=");
}

export function base64ToUint8Array(str: string, urlSafe = true) {
  return Uint8Array.from(
    str
      .replace(urlSafe ? /[^A-Za-z0-9-_]/g : /[^A-Za-z0-9+/]/g, "")
      .split("")
      .flatMap((_, i, arr) => {
        if ((i & 3) !== 3 && i < arr.length - 1) return [];

        const nUint24 = new Array((i & 3) + 1).fill(0).reduce<number>((prev, _, j, { length }) => {
          const nInIndex = j - i + length - 1 + Math.floor(i / 4) * 8;
          const uInt6 = ((n) => {
            if (n > 96 && n < 123) return n - 71;
            if (n > 47 && n < 58) return n + 4;
            if (n === (urlSafe ? 45 : 43)) return 62;
            if (n === (urlSafe ? 95 : 47)) return 63;
            return n - 65;
          })(arr[nInIndex].charCodeAt(0));

          return prev | (uInt6 << (6 * (3 - (nInIndex & 3))));
        }, 0);

        return new Array(i & 3).fill(0).map((_, j) => (nUint24 >>> ((16 >>> j) & 24)) & 255);
      })
  );
}
