# JS engine benchmark
Benchmark performances of different JS engines.

## Requirements
Install `bun` for scripts and `jsvu` to get JS engines.

```sh
# Install JS engine installer
bun i jsvu -g

# Select the JS engines you want to benchmark
jsvu
```

Then you can start running the benchmark:
```sh
bun start
```

## Config
- Change JS engine commands at [run.js](./config/run.js).
- Change tests and engines filter at [filter.js](./config/filter.js).
