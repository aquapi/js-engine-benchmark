import { bench, do_not_optimize, run } from "mitata";

// Map all possible char code before @
const firstPartCharset = [];

firstPartCharset[33] = null;
for (let i = 35; i < 40; i++) firstPartCharset[i] = null;

firstPartCharset[42] = null;
firstPartCharset[43] = null;

for (let i = 45; i < 58; i++) firstPartCharset[i] = null;

firstPartCharset[61] = null;
firstPartCharset[63] = null;

for (let i = 65; i < 91; i++) firstPartCharset[i] = null;
for (let i = 94; i < 127; i++) firstPartCharset[i] = null;

// Map domain chars
const domainFirstCharset = [];

for (let i = 48; i < 58; i++) domainFirstCharset[i] = null;
for (let i = 65; i < 91; i++) domainFirstCharset[i] = null;
for (let i = 97; i < 123; i++) domainFirstCharset[i] = null;

const domainNextCharset = domainFirstCharset.with(45, null);

// See https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address for more info
// This implementation is based on the regular expression provided on the spec page:
// /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
// Basically this is the equivalent behavior of `<input type='email'>`
const isEmail = (str) => {
  const strLen = str.length;
  // String cannot be empty and first char must be valid
  if (strLen === 0 || firstPartCharset[str.charCodeAt(0)] !== null)
    return false;

  // Need to check the first part
  for (let i = 1; i < strLen; i++) {
    const curCode = str.charCodeAt(i);

    // Reach @
    if (curCode === 64) {
      // First char after @ must be a char in domainFirstCharset
      const lastStringIdx = strLen - 1;
      if (
        i === lastStringIdx ||
        domainFirstCharset[str.charCodeAt(i + 1)] !== null
      )
        return false;

      // Skip to after @
      i += 2;
      if (i === strLen) return true;

      for (let matchCount = 1; ; ) {
        const code = str.charCodeAt(i);

        // Meet a dot
        if (code === 46) {
          // Dot must not ends the string
          // The first character after the dot must be valid
          // The character before the dot must not be -
          if (
            i === lastStringIdx ||
            str.charCodeAt(i - 1) === 45 ||
            domainFirstCharset[str.charCodeAt(i + 1)] !== null
          )
            return false;

          // Jump to the part after dot
          i += 2;
          if (i === strLen) return true;
          matchCount = 1;

          continue;
        }

        // Char cannot match domainFirstCharset if it
        // does not match domainNextCharset
        if (domainNextCharset[code] !== null) return false;

        // domainNextCharset cannot match more than 61 times
        if (matchCount === 61) {
          // Must not include - as last match
          if (code === 45) return false;

          // End of string is valid
          if (i === lastStringIdx) return true;

          // Must be followed by a dot
          // Dot must not ends the string
          // The first character after the dot must be valid
          if (
            str.charCodeAt(i + 1) !== 46 ||
            i + 1 === lastStringIdx ||
            domainFirstCharset[str.charCodeAt(i + 2)] !== null
          )
            return false;

          // Jump to the part after dot
          i += 3;
          if (i === strLen) return true;
          matchCount = 1;

          continue;
        } else if (i === lastStringIdx)
          // Domain must not end with -
          return code !== 45;
        else {
          matchCount++;
          i++;
        }
      }
    }

    if (firstPartCharset[curCode] !== null) return false;
  }

  return false;
};

bench("Email validation", function* () {
  const cases = [
    "test@io.com",
    "test.io@epam.com",
    "test.io.example+today@epam.com",
    "test-io@epam.com",
    "test@io-epam.com",
    "test-io@epam-usa.com",
    "123456789testio@epam2.com",

    "test.io.com",
    "test@io@epam.com",
    'test(io"epam)example]com',
    'test"io"epam.com',

    "email@example.com",
    "firstname.lastname@example.com",
    "email@subdomain.example.com",
    "firstname+lastname@example.com",
    "email@123.123.123.123",
    '"email"@example.com',
    "1234567890@example.com",
    "email@example-one.com",
    "_______@example.com",
    "email@example.name",
    "email@example.museum",
    "email@example.co.jp",
    "firstname-lastname@example.com",

    'much."more\ unusual"@example.com',
    'very.unusual."@".unusual.com@example.com',
    'very."(),:;<>[]".VERY."very@\\\\\\ \"very".unusual@strange.example.com',

    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Joe Smith <email@example.com>",
    "email.example.com",
    "email@example@example.com",
    ".email@example.com",
    "email.@example.com",
    "email..email@example.com",
    "あいうえお@example.com",
    "email@example.com (Joe Smith)",
    "email@example",
    "email@-example.com",
    "email@example.web",
    "email@111.222.333.44444",
    "email@example..com",
    "Abc..123@example.com",

    '"(),:;<>[\]@example.com',
    'just"not"right@example.com',
    'this\ is\"really\"not\\\\allowed@example.com',
  ];

  yield {
    [0]() {
      return cases;
    },
    bench(cases) {
      for (let i = 0; i < cases.length; i++) do_not_optimize(isEmail(cases[i]));
    },
  };
});

run();
