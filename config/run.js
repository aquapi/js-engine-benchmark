export default {
  // Engines
  JSC: "jsc -m --useRecursiveJSONParse=false",
  V8: "v8 --expose-gc --allow-natives-syntax --module",

  // Runtimes
  //Bun: "BUN_JSC_useGlobalGC=true bun run",
  //Node: "node --expose-gc --allow-natives-syntax",
  //Deno: "deno run -A --v8-flags=--expose-gc,--allow-natives-syntax",
};
