import { bench, do_not_optimize, run } from "mitata";

bench("for each random", () => {
  do_not_optimize(Math.random() * Math.round(Math.random()) + Math.random());
});

run();
