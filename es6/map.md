# Map

## 对象键值对

JavaScript 对象本身就是键值对的集合，但是只能用字符串当做键（如果不是字符串，会先转化为字符串，详见对象转字符串的算法）。

```ts
class A { toString() { return 'A'} }
class B {}
var a = new A();
var b1 = new B();
var b2 = new B();
var obj = new Object();
obj[a] = true;
obj[b1] = true;
obj[b2] = false;

// obj 为：
// { A: true, [object Object]: false }
```

`obj` 有一个键 `A`，这是对象 `a` 转化为字符串后的键名。但是很多对象（`b1`, `b2`）都会转化为 `[object Object]`
之类的，并且后出现的 `b2` 覆盖掉了 `b1` 属性的值。

## 增强的 Map

为了解决这个问题，提出了 Map 实现增强的键值对功能，主要是 _键名不再局限于字符串，各种类型的值和对象都可以当做键！_，也
就是说，Object 结构提供了 _字符串—>值_ 的对应，Map 结构提供了 _值->值_ 的对应，是一种更完善的 Hash 结构实现。

```ts
const m = new Map();
class A { }
const cls = new A();

m.set(1, true);
m.set('1', false);
m.set(Symbol('secret'), true)
m.set({}, true)
m.set(cls, true)

m.get(1) // true
m.get('1') // false
m.get(Symbol('secret')) // undefined
m.get({}) // undefined
m.get(cls) // true
```

上面的代码演示了使用 `Symbol`，以及各种对象用作键。同时可以看到，_只有对同一个对象的引用，Map 结构才将其视为同一个键_。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 0 和 -0 就是
一个键，布尔值 true 和字符串 true 则是两个不同的键。另外，undefined 和 null 也是两个不同的键。虽然 NaN 不严格相等
于自身，但 Map 将其视为同一个键。

```ts
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

## 实例的属性和操作方法

- size 属性

返回成员总数。

- set(key, value)

设置键值对。

- get(key)

获取键索引对象。

- has(key)

某个键是否存在当前 Map 对象中。

- delete(key)

删除某个键值对。成功返回 true，失败返回 false。

- clear()

清空所有成员。

## 遍历方法

除了迭代器的三个遍历方法（`keys`, `values`, `entries`），还有 `forEach` 方法。

并且和 Set 一样，遍历的顺序就是插入的顺序。

```ts
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});

// 等同于使用 map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

上面代码最后的那个例子，表示 Map 结构的默认遍历器接口（Symbol.iterator 属性），就是 entries 方法。

```ts
map[Symbol.iterator] === map.entries
```

## 与其他数据结构转化

### Map 转数组
Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。

```ts
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

### 数组转 Map

将数组传入构造函数即可，Map 支持可迭代的数据结构。

```ts
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
```

### Map 转对象

借助一个辅助方法。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

```ts
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
```

### 对象转 Map

借助一个辅助方法。

```ts
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
```

```ts
class A { hello() { console.log('hello'); } }
var a1 = new A()
var a2 = new A()

// 修改原型方法，在 hello 方法前边开始和结束分别输出 enter 和 exit
hack(A)

a1.hello() // 输出 enter hello exit
a2.hello() // 输出 enter hello exit
```