# Symbol

[TOC]

## 目的

类似 uuid，提供独一无二的值，可以避免值之间冲突。

`Symbol` 也是一种新的原始数据类型，前六种分别是：`string`, `number`, `boolean`, `undefined`, `null`, `Object`。

## 用法

- 不需要使用 `new`，直接使用 `Symbol` 字面量来创建一个 `Symbol`
- 可以传入一个描述字符串，用来区分不同的 `Symbol`
- `Symbol` 的值都是独一无二的，与描述字符串无关

```ts
const s1 = Symbol();
const s2 = Symbol();

s1 === s2 // => false

const s3 = Symbol('foo');
const s4 = Symbol('foo');

s3 === s4 // => false
```

- 作为属性名时，只能通过方括号 `[]` 或者 `Object.defineProperty` 来使用，不能使用 `.` 引用

```ts
const methodName = Symbol('sayHello');
const propName = Symbol('name');

class Hello {
    constructor() {
        this[methodName]('hello, world!');
    }

    [methodName](msg) {
        console.log(msg);
    }
}

let a = {};
Object.defineProperty(a, propName, { value: 'Hello!' });
```

- Symbol 可以用来消除代码中的魔术字符串，起到类似枚举的效果

```ts
const COLOR_RED    = Symbol();
const COLOR_GREEN  = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error('Undefined color');
    }
}
```

- `Symbol.for()` 可以做到重新使用同一个 Symbol 值，比如，如果你调用 `Symbol.for("cat")` 30 次，每次都会返回同一个 Symbol 值，但是调用 `Symbol("cat")` 30 次，会返回 30 个不同的 Symbol 值


## 内置的 Symbol 值

- 除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法
- 最著名的是对象的迭代器：`Symbol.iterator`，指向该对象的默认迭代器方法

```ts
var a = [];

// 获取数组对象的默认迭代器方法
a[Symbol.iterator];

const myIterable = {};

// 指定自定义对象的迭代器接口
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

// for...of 或扩展运算符会调用 Symbol.iterator 方法
[...myIterable] // [1, 2, 3]
```
