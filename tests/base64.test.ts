import assert from "assert/strict";
import { uint8ArrayToBase64, base64ToUint8Array } from "../src/base64";

const params = [
  {
    utf8: "a",
    base64: "YQ==",
    base64url: "YQ",
  },
  {
    utf8: "ab",
    base64: "YWI=",
    base64url: "YWI",
  },
  {
    utf8: "abc",
    base64: "YWJj",
    base64url: "YWJj",
  },
  {
    utf8: "abcd",
    base64: "YWJjZA==",
    base64url: "YWJjZA",
  },
  {
    utf8: "abcde",
    base64: "YWJjZGU=",
    base64url: "YWJjZGU",
  },
  {
    utf8: "abcdef",
    base64: "YWJjZGVm",
    base64url: "YWJjZGVm",
  },
  {
    utf8: `{"id":"scf88f6d8-d2f3-11ec-9d64-0242ac120002","exp":1652227419,"iat":1652481178}`,
    base64:
      "eyJpZCI6InNjZjg4ZjZkOC1kMmYzLTExZWMtOWQ2NC0wMjQyYWMxMjAwMDIiLCJleHAiOjE2NTIyMjc0MTksImlhdCI6MTY1MjQ4MTE3OH0=",
    base64url:
      "eyJpZCI6InNjZjg4ZjZkOC1kMmYzLTExZWMtOWQ2NC0wMjQyYWMxMjAwMDIiLCJleHAiOjE2NTIyMjc0MTksImlhdCI6MTY1MjQ4MTE3OH0",
  },
  {
    utf8: "✓ à la mode",
    base64: "4pyTIMOgIGxhIG1vZGU=",
    base64url: "4pyTIMOgIGxhIG1vZGU",
  },
  {
    utf8: "🧐🤔😋😄",
    base64: "8J+nkPCfpJTwn5iL8J+YhA==",
    base64url: "8J-nkPCfpJTwn5iL8J-YhA",
  },
  {
    utf8: "👩🏻‍🚀👩🏼‍🚀👩🏽‍🚀👩🏾‍🚀👩🏿‍🚀",
    base64: "8J+RqfCfj7vigI3wn5qA8J+RqfCfj7zigI3wn5qA8J+RqfCfj73igI3wn5qA8J+RqfCfj77igI3wn5qA8J+RqfCfj7/igI3wn5qA",
    base64url: "8J-RqfCfj7vigI3wn5qA8J-RqfCfj7zigI3wn5qA8J-RqfCfj73igI3wn5qA8J-RqfCfj77igI3wn5qA8J-RqfCfj7_igI3wn5qA",
  },
  {
    utf8: "好久不见",
    base64: "5aW95LmF5LiN6KeB",
    base64url: "5aW95LmF5LiN6KeB",
  },
  {
    utf8: "\u0000\u0001\u0002\u0003",
    base64: "AAECAw==",
    base64url: "AAECAw",
  },
  {
    utf8: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non orci lobortis, accumsan est eu, dignissim
      nisi. Quisque sed vehicula nulla. Nullam pretium ex vel molestie lobortis. Cras gravida ultrices est, eu dictum
      ligula lacinia et. Integer accumsan dolor ac nisl eleifend vestibulum. Pellentesque auctor gravida porttitor.
      Phasellus eu felis sodales, commodo felis vel, convallis diam. In venenatis tincidunt nunc, et vestibulum neque
      pellentesque non. Sed ac leo sed nunc tempus dapibus nec eget felis. Phasellus vestibulum tellus tortor, sed
      maximus mi sagittis malesuada. Quisque non mi non justo vestibulum lacinia ac a turpis. Curabitur hendrerit leo
      leo, quis tempus augue consequat ac.
    `,
    base64:
      "CiAgICAgIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEZ1c2NlIG5vbiBvcmNpIGxvYm9ydGlzLCBhY2N1bXNhbiBlc3QgZXUsIGRpZ25pc3NpbQogICAgICBuaXNpLiBRdWlzcXVlIHNlZCB2ZWhpY3VsYSBudWxsYS4gTnVsbGFtIHByZXRpdW0gZXggdmVsIG1vbGVzdGllIGxvYm9ydGlzLiBDcmFzIGdyYXZpZGEgdWx0cmljZXMgZXN0LCBldSBkaWN0dW0KICAgICAgbGlndWxhIGxhY2luaWEgZXQuIEludGVnZXIgYWNjdW1zYW4gZG9sb3IgYWMgbmlzbCBlbGVpZmVuZCB2ZXN0aWJ1bHVtLiBQZWxsZW50ZXNxdWUgYXVjdG9yIGdyYXZpZGEgcG9ydHRpdG9yLgogICAgICBQaGFzZWxsdXMgZXUgZmVsaXMgc29kYWxlcywgY29tbW9kbyBmZWxpcyB2ZWwsIGNvbnZhbGxpcyBkaWFtLiBJbiB2ZW5lbmF0aXMgdGluY2lkdW50IG51bmMsIGV0IHZlc3RpYnVsdW0gbmVxdWUKICAgICAgcGVsbGVudGVzcXVlIG5vbi4gU2VkIGFjIGxlbyBzZWQgbnVuYyB0ZW1wdXMgZGFwaWJ1cyBuZWMgZWdldCBmZWxpcy4gUGhhc2VsbHVzIHZlc3RpYnVsdW0gdGVsbHVzIHRvcnRvciwgc2VkCiAgICAgIG1heGltdXMgbWkgc2FnaXR0aXMgbWFsZXN1YWRhLiBRdWlzcXVlIG5vbiBtaSBub24ganVzdG8gdmVzdGlidWx1bSBsYWNpbmlhIGFjIGEgdHVycGlzLiBDdXJhYml0dXIgaGVuZHJlcml0IGxlbwogICAgICBsZW8sIHF1aXMgdGVtcHVzIGF1Z3VlIGNvbnNlcXVhdCBhYy4KICAgIA==",
    base64url:
      "CiAgICAgIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEZ1c2NlIG5vbiBvcmNpIGxvYm9ydGlzLCBhY2N1bXNhbiBlc3QgZXUsIGRpZ25pc3NpbQogICAgICBuaXNpLiBRdWlzcXVlIHNlZCB2ZWhpY3VsYSBudWxsYS4gTnVsbGFtIHByZXRpdW0gZXggdmVsIG1vbGVzdGllIGxvYm9ydGlzLiBDcmFzIGdyYXZpZGEgdWx0cmljZXMgZXN0LCBldSBkaWN0dW0KICAgICAgbGlndWxhIGxhY2luaWEgZXQuIEludGVnZXIgYWNjdW1zYW4gZG9sb3IgYWMgbmlzbCBlbGVpZmVuZCB2ZXN0aWJ1bHVtLiBQZWxsZW50ZXNxdWUgYXVjdG9yIGdyYXZpZGEgcG9ydHRpdG9yLgogICAgICBQaGFzZWxsdXMgZXUgZmVsaXMgc29kYWxlcywgY29tbW9kbyBmZWxpcyB2ZWwsIGNvbnZhbGxpcyBkaWFtLiBJbiB2ZW5lbmF0aXMgdGluY2lkdW50IG51bmMsIGV0IHZlc3RpYnVsdW0gbmVxdWUKICAgICAgcGVsbGVudGVzcXVlIG5vbi4gU2VkIGFjIGxlbyBzZWQgbnVuYyB0ZW1wdXMgZGFwaWJ1cyBuZWMgZWdldCBmZWxpcy4gUGhhc2VsbHVzIHZlc3RpYnVsdW0gdGVsbHVzIHRvcnRvciwgc2VkCiAgICAgIG1heGltdXMgbWkgc2FnaXR0aXMgbWFsZXN1YWRhLiBRdWlzcXVlIG5vbiBtaSBub24ganVzdG8gdmVzdGlidWx1bSBsYWNpbmlhIGFjIGEgdHVycGlzLiBDdXJhYml0dXIgaGVuZHJlcml0IGxlbwogICAgICBsZW8sIHF1aXMgdGVtcHVzIGF1Z3VlIGNvbnNlcXVhdCBhYy4KICAgIA",
  },
];

params.forEach(({ utf8, base64: expected }) => {
  const result = uint8ArrayToBase64(new TextEncoder().encode(utf8), false);
  assert.equal(result, expected);
});

params.forEach(({ utf8, base64url: expected }) => {
  const result = uint8ArrayToBase64(new TextEncoder().encode(utf8));
  assert.equal(result, expected);
});

params.forEach(({ base64, utf8: expected }) => {
  const result = new TextDecoder().decode(base64ToUint8Array(base64 + "  ĴŪŃĶ  ", false));
  assert.equal(result, expected);
});

params.forEach(({ base64url, utf8: expected }) => {
  const result = new TextDecoder().decode(base64ToUint8Array(base64url + "  ĴŪŃĶ  "));
  assert.equal(result, expected);
});
