import { bench, do_not_optimize, run } from "mitata";

bench("simple regex", function* () {
  const cases = [
    "cat",
    "dog",
    "sun",
    "sky",
    "red",
    "ca",
    "cats",
    "Cat",
    "123",
    "c@t",
  ];

  yield {
    [0]() {
      return cases;
    },
    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(/^[a-z]{3}$/.test(cases[i]));
    },
  };
});

bench("simple regex 2", function* () {
  const cases = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#1a2b3c",
    "#A1B2C3",
    "FFFFFF",
    "#FFFFF",
    "#FFFFFFF",
    "#FFFFFG",
    "#FFFFF ",
  ];

  yield {
    [0]() {
      return cases;
    },

    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(/^#[0-9a-fA-F]{6}$/.test(cases[i]));
    },
  };
});

bench("ip regex", function* () {
  const cases = [
    "192.168.1.1",
    "10.0.0.5",
    "172.16.0.100",
    "8.8.8.8",
    "1.1.1.1",
    "255.255.255.255",
    "0.0.0.0",
    "192.0.2.0",
    "198.51.100.0",
    "203.0.113.0",
    "169.254.1.1",
    "127.0.0.1",
    "192.168.0.254",
    "10.10.10.10",
    "172.31.255.255",
    "64.233.160.0",
    "130.211.0.0",
    "256.0.0.1",
    "10.0.0",
    "10.0.0.1.1",
  ];

  yield {
    [0]() {
      return cases;
    },

    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(
          /(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)(?:\\.(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)){3}/.test(
            cases[i],
          ),
        );
    },
  };
});

bench("email regex", function* () {
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

    '"(),:;<>[\]@example.com',
    'just"not"right@example.com',
    'this\ is\"really\"not\\\\allowed@example.com',
  ];

  yield {
    [0]() {
      return cases;
    },

    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            cases[i],
          ),
        );
    },
  };
});

run();
