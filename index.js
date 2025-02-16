import fs from "fs";
import commands from "./run";

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

for (const test of new Bun.Glob("**/*.js").scanSync(DIST)) {
  console.log("*", test.substring(0, test.lastIndexOf(".")));

  for (const runtime in commands) {
    console.log("+", runtime);
    await Bun.$`${{ raw: commands[runtime] }} ${DIST + test}`;
  }
}
