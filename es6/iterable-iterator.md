# 迭代器

## 为什么引入迭代

ES6 引入了一种新的遍历数据的方式：迭代。我们知道，遍历数据可以使用语言层面的实现，例如 `for/for...in/while/do...
while`，也可以使用对象的一些遍历方法，例如数组的 `forEach()` 方法，为什么还要引入迭代呢？

原因在于：在 JS 中表示类似 "集合" 的数据结构之前有 `Array` 和 `Object`，现在 ES6 新增了 `Map` 和 `Set`，原有
的遍历方式不适合新增的对象类型，因此引入了迭代。它是一种接口协议，为各种不同的数据结构提供统一的访问机制。

## 默认可迭代对象

以下类型的对象默认是可以迭代的。

- Arrays（TypedArrays）
- Strings
- Maps（WeakMap 无法迭代）
- Sets（WeakSet 无法迭代）
- DOM data structures（NodeList, HTMLCollection）

## 迭代的消费者

以下操作底层使用了迭代器。

- 数组解构
- for...of
- Array.from()
- 扩展运算符 ...
- Map 和 Set 的构造函数
- Promise.all() 和 Promise.race()
- yield*

## 理解 Iterables 和 Iterators

迭代中的两个重要概念：

### 可迭代（Iterables）

不是所有的对象都是可迭代的，需要部署了 Iterable 接口才能进行迭代，也就是说有一个属性为 `Symbol.iterator` 的函数，
该函数返回一个具有 `next()` 方法的对象（即下文提到的 Iterator）。

`Symbol.iterator` 属于一个全局的 Symbol 常量值，访问 Symbol 变量，需要使用大括号括起来。

```ts
interface Iterable {
    [Symbol.iterator](): Iterator;
}
```

上文说了，数组和字符串默认是可迭代的，可以在控制台实验一下。

```ts
var arr = ['a', 'b', 'c']; // 数组实现了迭代器接口，也即可以访问 Symbol.iterator 属性
var arrIterator = arr[Symbol.iterator](); // 获取 iterator 对象
arrIterator.next() // {value: "a", done: false}
arrIterator.next() // {value: "b", done: false}
arrIterator.next() // {value: "c", done: false}
arrIterator.next() // {value: undefined, done: true}

var str = 'abc';
var strIterator = str[Symbol.iterator]();
strIterator.next() // {value: "a", done: false}
strIterator.next() // {value: "b", done: false}
strIterator.next() // {value: "c", done: false}
strIterator.next() // {value: undefined, done: true}

var obj = {}; // 对象默认没有部署迭代器接口的，为什么？
obj[Symbol.iterator] // => undefined
```

上面的代码中，分别访问了 `arr` 和 `str` 的 `Symbol.iterator` 属性，执行完毕后会返回一个迭代器对象。另外，普通的
对象是没有实现迭代器接口的。

对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手
动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，
对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。

### 迭代器（Iterators）

迭代器有点类似数据库记录的指针，通过特定方式依次访问数据库记录中的每一行。

迭代器有一个 `next()` 方法，来获取下一次迭代的结果，每次返回的迭代结果包含 `value` 和 `done` 字段，如果 `done`
为 true，说明迭代完成。

```ts
interface Iterator {
    next(): IteratorResult;
}

interface IteratorResult {
    value: any;
    done: boolean;
}
```

## 迭代计算生成的数据结构

主要的几个对象（Arrays，Typed Arrays、Maps、Sets）都提供了三个方法，基于已有数据结构，返回新的可迭代的对象。

- entries(): 返回可迭代的 [key, value]
- keys(): 返回可迭代的 key
- values(): 返回可迭代的 value

例如使用 `for...of` 遍历数组，同时获取索引和值。

```ts
for (const [idx, value] of ['a', 'b', 'c'].entries()) {
    console.log(idx, value)
}
```

## 遍历对象

遍历普通对象不可行，因为它没有实现迭代器接口，我们可以实现一个方法，将指定对象变成可迭代的。

```ts
function objectEntries(obj) {
    let index = 0;

    // 通过 Reflect.ownKeys 获取对象自身的所有键名，包括 Symbol 键
    const propKeys = Reflect.ownKeys(obj);

    // 返回一个对象，部署了迭代器接口
    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            if (index < propKeys.length) {
                const key = propKeys[index];
                index++;
                return { value: [key, obj[key]] };
            }
            else {
                return { done: true };
            }
        }
    }
}

const obj = { first: 'Jane', last: 'Doe' };
for (const [key,value] of objectEntries(obj)) {
    console.log(`${key}: ${value}`);
}
```

使用 `objectEntries()` 函数返回的对象，具有 `Symbol.iterator` 属性，同时该属性执行后返回了迭代器对象（这里是返
回对象自身，具有 `next()` 方法），在 `next()` 方法中按照特定逻辑线性化返回了符合 `IteratorResult` 的结果，因此
实现了将普通对象转变成可迭代对象。

## 迭代器衍生组合

基于已有的迭代器，可以创建很多有趣的函数，例如取 top 值的 `take` 函数。

```ts
function take(n, iterable) {
    const iter = iterable[Symbol.iterator]();
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (n > 0) {
                n--;
                return iter.next();
            } else {
                return { done: true };
            }
        }
    };
}
const arr = ['a', 'b', 'c', 'd'];
for (const x of take(2, arr)) {
    console.log(x);
}
// Output:
// a
// b
```

## 生成无限值的迭代器

有些迭代器会产生无限值，例如生成自然数的迭代器。

```ts
function naturalNumbers() {
    let n = 0;
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return { value: n++ };
        }
    }
}
```

在遍历这样的迭代器时，需要限定值的个数或者在特定处中断，例如在 `for...of` 中使用 `break` 关键字。

```ts
for (const x of naturalNumbers()) {
    if (x > 2) break;
    console.log(x);
}
```

或者使用解构，只取迭代器开头有限个数的值。

```ts
const [a, b, c] = naturalNumbers();
```

或者使用 `take` 之类的操作符。

```ts
for (const x of take(3, naturalNumbers())) {
    console.log(x);
}
// Output:
// 0
// 1
// 2
```

## 可选的迭代器方法 return() 和 throw()

迭代器对象除了必选 `next()` 方法，还可选 `return()` 和 `throw()` 方法。

`return()` 方法用于循环提前退出，或者出错，就会调用该方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署
该方法。

```ts
function naturalNumbers() {
    let n = 0;
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return { value: n++ };
        },
        return() {
            console.log('call return()')
            n = 0;
            return { done: true };
        }
    }
}
```

以下两种情况，都会触发 `return()` 方法。

```ts
// 情况一
for (let n of naturalNumbers()) {
  if (n === 50) {
      break;
  }
  console.log(n);
}

// 情况二
for (let n of naturalNumbers()) {
  if (n === 50) {
      throw new Error();
  }
  console.log(n);
}
```

`throw()` 方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。

## 迭代器和生成器

`Symbol.iterator` 方法的最简单实现，还是使用 Generator 生成器函数。

使用 Generator 改写上面的 objectEntries 方法如下。

```ts
function* objectEntries(obj) {
    // 通过 Reflect.ownKeys 获取对象自身的所有键名，包括 Symbol 键
    const propKeys = Reflect.ownKeys(obj);

    for (let i in propKeys) {
        const key = propKeys[i];
        yield [key, obj[key]];
    }
}

var obj = { first: 'Jane', last: 'Doe' };
for (const [key, value] of objectEntries(obj)) {
    console.log(`${key}: ${value}`);
}
```

可以看到，使用生成器函数语法，代码简洁了许多。

## 参考

- http://exploringjs.com/es6/ch_iteration.html
- http://es6.ruanyifeng.com/#docs/iterator
