import { bench, do_not_optimize, run } from "mitata";

bench("random math", () => {
  do_not_optimize(Math.random() * Math.round(Math.random()) + Math.random());
});

run();
