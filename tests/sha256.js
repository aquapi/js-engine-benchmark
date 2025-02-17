import { bench, do_not_optimize, run } from "mitata";

// Code modified from https://gist.github.com/rumkin/fa728e5a6b28625f53db

// constants [§4.2.2]
let K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

/**
 * Rotates right (circular right shift) value x by n positions [§3.2.4].
 * @private
 */
const ROTR = (n, x) => (x >>> n) | (x << (32 - n));

/**
 * Logical functions [§4.1.2].
 * @private
 */
const _0 = (x) => ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x);
const _1 = (x) => ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x);
const __0 = (x) => ROTR(7, x) ^ ROTR(18, x) ^ (x >>> 3);
const __1 = (x) => ROTR(17, x) ^ ROTR(19, x) ^ (x >>> 10);
const Ch = (x, y, z) => (x & y) ^ (~x & z);
const Maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);

/**
 * Generates SHA-256 hash of string.
 *
 * @param   {string} msg - String to be hashed
 * @returns {string} Hash of msg as hex character string
 */
const hash = (msg) => {
  // PREPROCESSING
  msg += "\x80"; // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

  // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
  let l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
  let N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
  let M = new Array(N);

  for (let i = 0, tmp; i < N; i++) {
    tmp = new Array(16);
    for (let j = 0; j < 16; j++) {
      // encode 4 chars per integer, big-endian encoding
      tmp[j] =
        (msg.charCodeAt(i * 64 + j * 4) << 24) |
        (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
        (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) |
        msg.charCodeAt(i * 64 + j * 4 + 3);
    } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    M[i] = tmp;
  }
  // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
  // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
  // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
  M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

  // initial hash value [§5.3.1]
  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];

  // HASH COMPUTATION [§6.1.2]
  for (let i = 0, a, b, c, d, e, f, g, h, W = new Array(64); i < N; i++) {
    // 1 - prepare message schedule 'W'
    for (let t = 0; t < 16; t++) W[t] = M[i][t];
    for (let t = 16; t < 64; t++)
      W[t] =
        (__1(W[t - 2]) + W[t - 7] + __0(W[t - 15]) + W[t - 16]) & 0xffffffff;

    // 2 - initialise working letiables a, b, c, d, e, f, g, h with previous hash value
    a = H[0];
    b = H[1];
    c = H[2];
    d = H[3];
    e = H[4];
    f = H[5];
    g = H[6];
    h = H[7];

    // 3 - main loop (note 'addition modulo 2^32')
    for (let t = 0, T1; t < 64; t++) {
      T1 = h + _1(e) + Ch(e, f, g) + K[t] + W[t];
      h = g;
      g = f;
      f = e;
      e = (d + T1) & 0xffffffff;
      d = c;
      c = b;
      b = a;
      a = (T1 + _0(a) + Maj(a, b, c)) & 0xffffffff;
    }
    // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
    H[0] = (H[0] + a) & 0xffffffff;
    H[1] = (H[1] + b) & 0xffffffff;
    H[2] = (H[2] + c) & 0xffffffff;
    H[3] = (H[3] + d) & 0xffffffff;
    H[4] = (H[4] + e) & 0xffffffff;
    H[5] = (H[5] + f) & 0xffffffff;
    H[6] = (H[6] + g) & 0xffffffff;
    H[7] = (H[7] + h) & 0xffffffff;
  }

  return (
    H[0].toString(16) +
    H[1].toString(16) +
    H[2].toString(16) +
    H[3].toString(16) +
    H[4].toString(16) +
    H[5].toString(16) +
    H[6].toString(16) +
    H[7].toString(16)
  );
};

bench("sha256 - $size items", function* (state) {
  const keys = new Array(state.get("size")).fill(0).map(Math.random).join("");

  yield {
    [0]() {
      return keys;
    },

    bench(arr) {
      return do_not_optimize(hash(arr));
    },
  };
}).range("size", 100, 5000, 400);

await run();
