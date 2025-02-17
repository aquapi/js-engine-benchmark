import { bench, do_not_optimize, run } from "mitata";

bench("random & round", () => {
  do_not_optimize(Math.random() * Math.round(Math.random()) + Math.random());
});

bench("random & floor", () => {
  do_not_optimize(
    Math.floor(Math.random()) * Math.random() +
      Math.random() / Math.floor(Math.random() + 1),
  );
});

run();
