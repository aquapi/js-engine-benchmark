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

bench("backtracking regex", function* () {
  const cases = [
    "test@example.com",
    "user123@domain.net",
    "simple@site.org",
    "a_user@test.info",
    "test@example",
    "test.example.com",
    "@example.com",
    "test@.com",
  ];

  yield {
    [0]() {
      return cases;
    },

    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            cases[i],
          ),
        );
    },
  };
});

run();
