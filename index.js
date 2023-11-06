/**
 * HashStates is a class that enables the storage of key/value pairs,
 * and provides a method, getHash(), to retrieve a hash of all the values.
 */
export default class HashStates {
  constructor() {
    this._stringMap = new Map();
    this._numberMap = new Map();
    this._booleanMap = new Map();
  }

  setString(name, value) {
    this._stringMap.set(name, value);
    return this;
  }

  setNumber(name, value) {
    this._numberMap.set(name, value);
    return this;
  }

  setBoolean(name, value) {
    this._booleanMap.set(name, value);
    return this;
  }

  getString(name) {
    return this._stringMap.get(name);
  }

  getNumber(name) {
    return this._numberMap.get(name);
  }

  getBoolean(name) {
    return this._booleanMap.get(name);
  }

  getHash() {
    return [
      Array.from(this._stringMap.values()).join("_"),
      // todo: implement a more efficient number hash?
      Array.from(this._numberMap.values()).join("_"),
      getBooleanMaskHash(this._booleanMap),
    ].join("|");
  }

  clear() {
    this._stringMap.clear();
    this._numberMap.clear();
    this._booleanMap.clear();
    return this;
  }
}

// compress boolean values into a single number
// todo: more than 32 booleans
function getBooleanMaskHash(map) {
  let masks = [],
    mask = 0,
    index = 0;
  map.forEach((value) => {
    if (value) {
      mask |= 1 << index;
    }
    index++;
    if (index === 31) {
      masks.push(mask);
      mask = 0;
      index = 0;
    }
  });
  if (index > 0) {
    masks.push(mask);
  }
  return masks.join("_");
}
