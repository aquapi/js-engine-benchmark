import fs from "fs";
import commands from "./config/run";
import * as filter from "./config/filter";

const ROOT = import.meta.dir + "/";
const TESTS = ROOT + "tests/";
const DIST = ROOT + "dist/";

if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });

await Bun.build({
  entrypoints: [
    ...new Bun.Glob("**/*.js").scanSync({
      cwd: TESTS,
      absolute: true,
    }),
  ],
  outdir: DIST,
  target: "bun",
});

Bun.$.nothrow();

for (const test of new Bun.Glob("**/*.js").scanSync(DIST)) {
  const name = test.substring(0, test.lastIndexOf("."));
  if (!filter.includeTest(name) || filter.excludeTest(name)) continue;
  console.log("*", name);

  for (const engine in commands) {
    if (!filter.includeEngine(engine) || filter.excludeEngine(engine)) continue;

    console.log("+", engine);
    await Bun.$`${{ raw: commands[engine] }} ${DIST + test}`;
  }
}
