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

  hashStates = new HashStates();

  setValues();

  new Benchmark.Suite("set values:")
    .add("states", setValues)
    .add("_array", setValues_Array)
    .add("object", setValues_Object)
    .on("start", function () {
      console.log(this.name);
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });

  new Benchmark.Suite("get hash:")
    .add("states", getHash)
    .add("_array", getHash_Array)
    .add("object", getHash_Object)
    .on("start", function () {
      console.log(this.name);
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

  new Benchmark.Suite("get values:")
    .add("states", getValues)
    .add("_array", getValues_Array)
    .add("object", getValues_Object)
    .on("start", function () {
      console.log(this.name);
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });

  new Benchmark.Suite("all:")
    .add("states", all)
    .add("_array", all_Array)
    .add("object", all_Object)
    .on("start", function () {
      console.log(this.name);
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: false });
})();

//// Global

let hashStates = null,
  hash1Count = 0,
  hash2Count = 0;

//// HashStates - the original implementation

function setValues() {
  hashStates.clear();
  stringData.forEach(([key, value]) => hashStates.setString(key, value));
  numberData.forEach(([key, value]) => hashStates.setNumber(key, value));
  booleanData.forEach(([key, value]) => hashStates.setBoolean(key, value));
}

function getValues() {
  stringData.forEach(([key]) => hashStates.getString(key));
  numberData.forEach(([key]) => hashStates.getNumber(key));
  booleanData.forEach(([key]) => hashStates.getBoolean(key));
}

function getHash() {
  const hash = hashStates.getHash();
  hash1Count = hash.length;
}

function all() {
  setValues();
  getHash();
  getValues();
}

//// HashStates2 - use two arrays instead of a map
//// better performance for add, worse performance for get

class HashStates2 {
  constructor() {
    this._stringStates = new StringHashStates();
    this._numberStates = new NumberHashStates();
    this._booleanStates = new BooleanHashStates();
  }

  setString(name, value, check) {
    this._stringStates.setValue(name, value, check);
    return this;
  }

  setNumber(name, value, check) {
    this._numberStates.setValue(name, value, check);
    return this;
  }

  setBoolean(name, value, check) {
    this._booleanStates.setValue(name, value, check);
    return this;
  }

  getString(name) {
    return this._stringStates.getValue(name);
  }

  getNumber(name) {
    return this._numberStates.getValue(name);
  }

  getBoolean(name) {
    return this._booleanStates.getValue(name);
  }

  getHash() {
    return [
      this._stringStates.getHash(),
      this._numberStates.getHash(),
      this._booleanStates.getHash(),
    ].join("|");
  }

  clear() {
    this._stringStates.clear();
    this._numberStates.clear();
    this._booleanStates.clear();
    return this;
  }
}

class TypedHashStates {
  constructor() {
    this._values = [];
    this._names = [];
  }

  setValue(name, value, check = true) {
    if (check) {
      const index = this._names.indexOf(name);
      if (index >= 0) {
        this._values[index] = value;
        return;
      }
    }

    this._names.push(name);
    this._values.push(value);
  }

  getValue(name) {
    const index = this._names.indexOf(name);
    if (index >= 0) {
      return this._values[index];
    }
    return undefined;
  }

  getHash() {
    return this._values.join("_");
  }

  clear() {
    this._values = [];
    this._names = [];
  }
}

class StringHashStates extends TypedHashStates {}

// todo: implement a more efficient number hash?
class NumberHashStates extends TypedHashStates {}

class BooleanHashStates extends TypedHashStates {
  getHash() {
    // compress boolean values into a single number
    // todo: more than 32 booleans
    let mask = 0;
    for (let i = 0; i < this._values.length; i++) {
      if (this._values[i]) {
        mask |= 1 << i;
      }
    }
    return mask;
  }
}

const hashStates2 = new HashStates2();

function setValues_Array() {
  hashStates2.clear();
  stringData.forEach(([key, value]) => hashStates2.setString(key, value));
  numberData.forEach(([key, value]) => hashStates2.setNumber(key, value));
  booleanData.forEach(([key, value]) => hashStates2.setBoolean(key, value));
}

function getValues_Array() {
  stringData.forEach(([key]) => hashStates2.getString(key));
  numberData.forEach(([key]) => hashStates2.getNumber(key));
  booleanData.forEach(([key]) => hashStates2.getBoolean(key));
}

function getHash_Array() {
  const hash = hashStates2.getHash();
}

function all_Array() {
  setValues_Array();
  getHash_Array();
  getValues_Array();
}

//// Object - use an object simply for comparison

let object = {};

function setValues_Object() {
  object = {};
  stringData.forEach(([key, value]) => (object[key] = value));
  numberData.forEach(([key, value]) => (object[key] = value));
  booleanData.forEach(([key, value]) => (object[key] = value));
}

function getHash_Object() {
  const array = [];
  for (const key in object) {
    array.push(object[key]);
  }
  const hash = array.join("_");
  hash2Count = hash.length;
}

function getValues_Object() {
  stringData.forEach(([key]) => object[key]);
  numberData.forEach(([key]) => object[key]);
  booleanData.forEach(([key]) => object[key]);
}

function all_Object() {
  setValues_Object();
  getHash_Object();
  getValues_Object();
}
