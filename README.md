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

## Benchmark

here is the benchmark result of HashStates compared to Object:

```bash
set values:
states x 57,623 ops/sec ±3.01% (74 runs sampled)
_array x 13,929 ops/sec ±0.24% (95 runs sampled)
object x 72,747 ops/sec ±0.41% (93 runs sampled)
Fastest is object
get hash:        
states x 147,151 ops/sec ±0.23% (97 runs sampled)
_array x 184,957 ops/sec ±0.18% (95 runs sampled)
object x 45,221 ops/sec ±0.16% (96 runs sampled)
Fastest is _array
hash1Count 1114  
hash2Count 1629  
get values:      
states x 1,101,099 ops/sec ±0.68% (90 runs sampled)
_array x 63,943 ops/sec ±0.42% (93 runs sampled)
object x 359,494 ops/sec ±0.19% (95 runs sampled)
Fastest is states
all:
states x 42,122 ops/sec ±0.96% (88 runs sampled)
_array x 24,750 ops/sec ±0.19% (95 runs sampled)
object x 23,366 ops/sec ±0.30% (95 runs sampled)
Fastest is states
```

While HashStates is marginally slower in setting values, it exhibits significant performance advantages in getHash and getValue operations. Overall, its performance is nearly twice as efficient as a standard Object.
