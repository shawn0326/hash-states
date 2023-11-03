const Benchmark = require("benchmark");

const stringData = [];
const numberData = [];
const booleanData = [];
for (let i = 0; i < 100; i++) {
  stringData.push([`string${i}`, `value${i}`]);
}
for (let i = 0; i < 100; i++) {
  numberData.push([`number${i}`, i]);
}
for (let i = 0; i < 100; i++) {
  booleanData.push([`boolean${i}`, i % 2 === 0]);
}

(async () => {
  const { default: HashStates } = await import("./index.js");

  const hashStates = new HashStates();
  let object = {};

  let hash1Count = 0,
    hash2Count = 0;

  function setStatesValues(check = true) {
    hashStates.clear();
    stringData.forEach(([key, value]) =>
      hashStates.setString(key, value, check)
    );
    numberData.forEach(([key, value]) =>
      hashStates.setNumber(key, value, check)
    );
    booleanData.forEach(([key, value]) =>
      hashStates.setBoolean(key, value, check)
    );
  }

  function getStatesHash() {
    const hash = hashStates.getHash();
    hash1Count = hash.length;
  }

  function getStatesValues() {
    stringData.forEach(([key]) => hashStates.getString(key));
    numberData.forEach(([key]) => hashStates.getNumber(key));
    booleanData.forEach(([key]) => hashStates.getBoolean(key));
  }

  function setObjectValues() {
    object = {};
    stringData.forEach(([key, value]) => (object[key] = value));
    numberData.forEach(([key, value]) => (object[key] = value));
    booleanData.forEach(([key, value]) => (object[key] = value));
  }

  function getObjectHash() {
    let array = [];
    for (const key in object) {
      array.push(object[key]);
    }
    const hash = array.join("_");
    hash2Count = hash.length;
  }

  function getObjectValues() {
    stringData.forEach(([key]) => object[key]);
    numberData.forEach(([key]) => object[key]);
    booleanData.forEach(([key]) => object[key]);
  }

  setStatesValues();
  setObjectValues();

  new Benchmark.Suite("add-check")
    .add("states", () => {
      setStatesValues();
    })
    .add("object", () => {
      setObjectValues();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });

  new Benchmark.Suite("add-no-check")
    .add("states", () => {
      setStatesValues(false);
    })
    .add("object", () => {
      setObjectValues();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });

  new Benchmark.Suite("get-hash")
    .add("states", () => {
      getStatesHash();
    })
    .add("object", () => {
      getObjectHash();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
      console.log("hash1Count " + hash1Count);
      console.log("hash2Count " + hash2Count);
    })
    .run({ async: false });

  new Benchmark.Suite("get-values")
    .add("states", () => {
      getStatesValues();
    })
    .add("object", () => {
      getObjectValues();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });

  new Benchmark.Suite("all")
    .add("states", () => {
      setStatesValues(false);
      getStatesHash();
      getStatesValues();
    })
    .add("object", () => {
      setObjectValues();
      getObjectHash();
      getObjectValues();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });
})();
