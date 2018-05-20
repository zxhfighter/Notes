# 解构

[TOC]

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

## 模式匹配

解构按照 "模式匹配" 来解构。

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

## 解构的实质

**如果等号右边的对象（或者转化后的对象）不具有 `Symbol.iterator` 接口，那么解构会报错。**

```js
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

上面的语句都会报错，因为等号右边的值，要么转为对象以后不具备 Iterator 接口（前五个表达式），要么本身就不具备 Iterator 接口（最后一个表达式）。

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```js
let [x, y, z] = new Set(['a', 'b', 'c']);
let [g, h, i] = 'ghi';

function* fibs() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 使用 generator 函数来结构
let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

## 默认值

解构可以指定默认值。

```js
let [x, y = 'b'] = ['a']; // x='a', y='b'
function toString({base = 10, num}) {
  console.log(base, num);
}
```

## 交换变量

```js
[a, b] = [b, a];
```

## 对象的解构

用的最多的是 `import` 语句了。

```js
import React, { Component } from 'react';

const { log, sin, cos } = Math;
```

其中 Component 就是对象解构赋值的变量。

对象解构也可以使用 rest 运算符（`...`），以及默认值。

```js
const { foo, boom = 5, ...others } = { foo: 1, bar: 2, baz: 3};
```

函数参数也可以很方便的使用对象解构，例如 React 函数组件。

```js
function Welcome({ name, age = 10 }) {

    return (
        <div>
            Welcome {name}, you are {age} years old!.
        </div>
    )
}
```

解构赋值对提取 JSON 对象中的数据，尤其有用。

```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

另外，如果变量名与属性名不一致，必须写成下面这样。

```js
// 实际的变量名为 baz
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
```

## 遍历 Map

可以用解构轻松来遍历 Map。

```js
for (let [key, value] of map) {
  console.log(key, value);
}
```

## 圆括号问题

ES6 的规则是，只要有可能导致解构的歧义，就不得使用圆括号。

```js
// 变量声明，报错
let [(a)] = [1];

// 报错
({ p: a }) = { p: 42 };
```

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。

```js
[(b)] = [3]; // 赋值，正确
({ p: (d) } = {}); // 正确
```
