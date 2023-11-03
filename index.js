/**
 * HashStates is a class that enables the storage of key/value pairs,
 * and provides a method, getHash(), to retrieve a hash of all the values.
 */
export default class HashStates {
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

/**
 * Abstract class for string/number/boolean hash states
 */
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
    // todo: get value is slow, need to optimize
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
