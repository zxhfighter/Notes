# Set

[TOC]

Set 提供一个集合，集合中的值都是唯一的。

## 构造函数

```
new Set([iterable])
```

注意，**Set 构造函数接收的参数必须是实现了迭代器接口的对象**，可以不指定，此时集合为空。

## 属性和方法

- `size`：返回 Set 实例的成员总数
- `add(value)`：添加某个值，返回 Set 结构本身
- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功
- `clear()`：清除所有成员，没有返回值
- `has(value)`：返回一个布尔值，表示该值是否为 Set 的成员。

## 数组转 Set

由于数组可迭代（具有 `Symbol.iterator` 属性），因此直接用构造函数即可。

```js
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // => 5

// 类数组也具有迭代器接口，因此也可以作为参数传入，这里的 NodeList 也可传入
const set = new Set(document.querySelectorAll('div'));
set.size // 56
```

## Set 转数组

方法一是使用扩展运算符 `...`。

```js
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
[...items] // => [1, 2, 3, 4, 5]
```

方法二是使用数组方法 `Array.from()`。

```js
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
Array.from(items) // => [1, 2, 3, 4, 5]
```

## 例子：使用 Set 数组去重

先用 Set 去重，然后在转化为数组即可。

```js
const dedupe = array => [...new Set(array)];
const dedupe2 = array => Array.from(new Set(array));
dedupe([1, 2, 3, 4, 5, 5, 5, 5])
dedupe2([1, 2, 3, 4, 5, 5, 5, 5])
```

## Set 区分值是否唯一的比较算法

使用 Set 添加值时，使用的是 `Object.is()` 比较算法，主要区别在 `NaN` 等于自身以及 `+0` 和 `-0` 不等。

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // => Set {NaN}
```

## 遍历 Set

遍历 Set 有四种方式（迭代器方法有三种：`keys`, `values`, `entries`）：

### `keys()`

返回遍历器对象。

```js
const s = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
for (let item of s.keys()) {
    console.log(item); // => 1
}
```

### `values()`

由于 Set 键名和键值是同一个值，因此 `values()` 和 `keys()` 行为完全一致。

另外，Set 结构实例默认可以遍历，因为默认迭代器生成函数就是它的 `values` 方法。

```js
const s = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
for (let item of s) {
    console.log(item);
}
```

最后，**扩展运算符 `...` 内部调用了 `for...of` 循环**，因此效果如上。

### `entries()`

返回遍历器对象，遍历后的值格式为 `[key, value]`，此处 `key` 和 `value` 完全一致。

```js
const s = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
for (let item of s.entries()) {
    console.log(item); // => [1, 1]...
}
```

### `forEach()`

Set 结构类似数组，也有 `forEach()` 方法。

```js
const s = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
s.forEach((value, key) => console.log(key, value));
```

## 例子：实现交集、并集、差集

使用 Set 可以很轻松实现集合算法。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 实现并集
let union = new Set([...a, ...b]);

// 实现交集
let intersect = new Set([...a].filter(x => b.has(x)));

// 实现差集
let difference = new Set([...a].filter(x => !b.has(x)));
```
