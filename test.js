import HashStates from "./index.js";

const states = new HashStates();

states
  .clear()
  .setString("name", "Shawn")
  .setNumber("age", 30)
  .setBoolean("human", true)
  .setBoolean("male", true)
  .setBoolean("awesome", true)
  .setBoolean("sad", false);

console.log(states.getHash()); // Shawn|30|7 (all boolean values are stored as binary)
console.log(states.getString("name")); // Shawn
console.log(states.getBoolean("awesome")); // true

states.clear();

for (let i = 0; i < 35; i++) {
  states.setBoolean(`boolean${i}`, i % 2 === 0);
}

console.log(states.getHash());
