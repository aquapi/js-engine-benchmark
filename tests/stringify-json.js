import { bench, do_not_optimize, run } from "mitata";

bench("stringify json", function* () {
  const cases = [
    1,
    "hello",
    true,
    null,
    [1, 2, 3],
    { name: "John", age: 30 },
    { address: { street: "123 Main St", city: "Anytown" } },
    [
      { item: "apple", quantity: 2 },
      { item: "banana", quantity: 3 },
    ],
    {
      details: {
        color: "blue",
        size: "large",
        material: "cotton",
      },
    },
    [true, false, true],
    {
      numbers: [4, 5, 6],
      strings: ["a", "b", "c"],
    },
    {
      nestedArray: [
        [7, 8, 9],
        [10, 11, 12],
      ],
    },
    {
      person: {
        firstName: "Jane",
        lastName: "Doe",
        contact: {
          email: "jane.doe@example.com",
          phone: "555-1234",
        },
      },
    },
    [
      { id: 1, value: "one" },
      { id: 2, value: "two" },
      { id: 3, value: "three" },
    ],
    {
      data: {
        values: [100, 200, 300],
        labels: ["A", "B", "C"],
      },
    },
    [
      ["x", "y", "z"],
      ["p", "q", "r"],
    ],
    {
      config: {
        settings: {
          theme: "dark",
          fontSize: 12,
        },
      },
    },
    [
      { name: "Product A", price: 25.99, inStock: true },
      { name: "Product B", price: 10.5, inStock: false },
    ],
    {
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    },
  ];

  yield {
    [0]() {
      return cases;
    },
    bench(cases) {
      for (let i = 0; i < cases.length; i++)
        do_not_optimize(JSON.stringify(cases[i]));
    },
  };
});

run();
