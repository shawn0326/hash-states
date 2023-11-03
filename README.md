# hash-states

High-performance collection of states for easy generation of hash strings.

Usage:

```javascript
import { HashStates } from 'hash-states';

const states = new HashStates();

states
  .clear()
  .setString("name", "Shawn")
  .setNumber("age", 30)
  .setBoolean("human", true)
  .setBoolean("male", true)
  .setBoolean("awesome", true)
  .setBoolean("sad", false);

console.log(states.getHash()); // Shawn|30|7
console.log(states.getString("name")); // Shawn
console.log(states.getBoolean("awesome")); // true
```

For space efficiency, all boolean values are stored in binary form. Therefore, the aforementioned example would be stored as 111, which is equivalent to 7 in decimal notation. So if numerous Boolean values are set, HashStates will significantly shorten the length of the resulting hash string.