# 生成器

## 生成器概述

生成器是 ES6 提出的一种异步编程解决方案，可以将生成器理解为有状态的函数（或方法），定义生成器函数使用 `function*`
语法，使用 `yield` 操作符输出状态并暂停，通过 `next` 方法恢复运行，另外生成器还接受通过 `next()` 方法接受输入。

```ts
function* genFunc() {
    // (A)
    console.log('First');
    yield 'Second';
    console.log('Third');
    return 'Fourth';
}
```

调用生成器方法，会生成一个生成器对象，初始会是暂停状态。

```ts
const gen = genFunc();
```

调用 `next()` 方法恢复执行，遇到 `yield` 操作符，执行后边的代码，输出状态后，暂停执行。

```ts
gen.next() // First, { value: 'Second', done: false }
gen.next() // Third, { value: 'Fourth', done: true }
gen.next() //
```

## 生成器语法

定义生成器函数。

```ts
function* genFunc() { }
```

定义生成器函数表达式。

```ts
const genFunc = function* () { }
```

定义对象生成器方法。

```ts
const obj = {
    *genMethod() { }
}
```

定义类生成器方法。

```ts
class MyClass {
    *genMethod() { }
}
```

## 生成器与迭代器

生成器对象默认是可迭代的，每一个 `yield` 返回一个迭代值，因此可以使用生成器来实现迭代器。

```ts
function* objectEntries(obj) {
    const propKeys = Reflect.ownKeys(obj);

    for (const propKey of propKeys) {
        // `yield` returns a value and then pauses
        // the generator. Later, execution continues
        // where it was previously paused.
        yield [propKey, obj[propKey]];
    }
}

const jane = { first: 'Jane', last: 'Doe' };
for (const [key,value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}
// Output:
// first: Jane
// last: Doe
```

## 简化异步操作

使用生成器，可以极大简化已有的基于 Promise 的异步解决方案。

```ts
function fetchJson(url) {
    return fetch(url)
        .then(request => request.text())
        .then(text => JSON.parse(text))
        .catch(error => console.log);
}
```

使用 `co` 库，可以重写如下：

```ts
const fetchJson = co.wrap(function* (url) {
    try {
        const request = yield fetch(url);
        const text = yield request.text();
        return JSON.parse(text);
    }
    catch (error) {
        console.log(error);
    }
});
```

看起来更加复杂了，还依赖第三方的 `co` 库，进一步使用 ES2017 的 `async/await` 语法改写如下（其实就是生成器的语法糖）：

```ts
async function fetchJson(url) {
    try {
        const request = await fetch(url);
        const text = await request.text();
        return JSON.parse(text);
    }
    catch (error) {
        console.log(error);
    }
}
```

所有版本都可以使用如下方法来调用：

```ts
fetchJson('http://example.com/some_file.json').then(obj => console.log(obj));
```

## 生成器的角色

### 生产者

可以使用 `yield` 生成数据，供 `for...of` 或者 `...` 等消费。

### 消费者

也可以使用 `next(data)` 给生成器传递参数，更改运行行为。

### 协程（Coroutines）

由于既是数据生产者，也是数据消费者，同时还拥有状态，因此很容易可以将其改造成协程（合作多任务任务）。

## 生成器中的 return

`return` 语句会出现在最后的 `next()` 方法中，同时 `done` 设置成了 true。

但是，大多数迭代器遍历算法会忽略 `return` 返回的值，例如 `for...of` 和 `...`。

`yield*` 则会考虑 `return` 的值。

## 生成器中的 throw

```ts
function* genFunc() {
    throw new Error('Problem!');
}
const genObj = genFunc();
genObj.next(); // Error: Problem!
```

目前来看，生成器可以生成三种不同的数据：

- 正常 yield 的数据，返回 `{value: x, done: false}`
- 迭代结束时 return 的数据，返回 `{value: z, done: true}`
- 迭代异常时 throw 的数据，抛出异常


## 只能在生成器函数上下文中使用 yield

例如在数组的 `forEach` 方法中使用 yield，会报语法错误，因为 `forEach` 会形成一个新的上下文环境。

```ts
function* genFunc() {
    ['a', 'b'].forEach(x => yield x); // SyntaxError
}
```

可以改写成 `for/while` 系列语句。

```ts
function* genFunc() {
    for (const x of ['a', 'b']) {
        yield x; // OK
    }
}
```

## 使用 yield* 递归调用生成器

```ts
function* foo() {
    yield 'a';
    yield 'b';
}
```

如果想在另一个生成器函数中调用 `foo`，要如何做？

```ts
function* bar() {
    yield 'x';
    foo(); // does nothing!
    yield 'y';
}
```

因此 ES6 提出了 `yield*` 操作符。

```ts
function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}

const arr = [...bar()];
```

等价于：

```ts
function* bar() {
    yield 'x';
    for (const value of foo()) {
        yield value;
    }
    yield 'y';
}
```

`yield*` 后边不一定要跟着一个生成器，只要该对象可迭代即可。

`yield*` 后面的 Generator 函数（没有 return 语句时），不过是 `for...of`的一种简写形式，完全可以用后者替代前者。
反之，在有 return 语句时，则需要用 `var value = yield* iterator` 的形式获取 return 语句的值。

```ts
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

## 遍历二叉树

使用 `yield*` 遍历二叉树就很方便了。

```ts
class BinaryTree {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    * [Symbol.iterator]() {
        yield this.value;

        if (this.left) {
            yield* this.left;
        }

        if(this.right) {
            yield* this.right;
        }
    }
}

var tree = new BinaryTree('a',
    new BinaryTree('b',
        new BinaryTree('c'),
        new BinaryTree('d')
    ),
    new BinaryTree('e')
);

[...tree]
```

## 遍历嵌套数组

使用 yield* 递归遍历嵌套数组的成员（全部打平）。

```ts
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i = 0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}
```

## 生成器作为数据消费者

```ts
interface Observer {
    // 发送普通值
    next(value? : any) : void;

    // 结束生成器迭代
    return(value? : any) : void;

    // 抛出异常
    throw(error) : void;
}
```

看个例子：

```ts
function* gen() {
    // (A)
    while (true) {
        const input = yield; // (B)
        console.log(input);
    }
}
const obj = gen();
obj.next('a');
obj.next('b');

// Output:
// b
```

- 生成生成器对象时，代码在 (A) 处暂停。
- 第一次调用 `next('a')` 时，由于之前没有 yield 语句，因此该值被忽略，代码在 (B) 处暂停
- 第二次调用 `next('b')` 时，设置上一个暂停的 yield 语句值为 'b'，因此 input 此时为 b，继续执行直到下一循环暂停

因此可以注意到，使用 `next()` 赋值时，第一个赋值往往是没有意义的，可以包裹一层来去掉第一个 `next()`。

```ts
function coroutine(generatorFunction) {
    return function(...args) {
        const generatorObj = generatorFunction(...args);
        generatorObj.next();
        return generatorObj;
    }
}

const wrapped = coroutine(function* () {
    console.log(`First input: ${yield}`);
    return 'DONE';
});
const normal = function* () {
    console.log(`First input: ${yield}`);
    return 'DONE';
};

wrapped().next('hello!')
```

## yield 松散耦合

yield 松散耦合，也就是说，操作数不需要用圆括号包裹起来。

```ts
// 等价于 yield (a + b + c)，而不是 (yield a) + b + c
yield a + b + c;
```

因此，如果将 yield 表达式当做一个操作数时，由于优先级低，因此需要使用圆括号括起来。

```ts
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError

console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK
```

generator 相比迭代器：

- 提供了更高层的抽象，由于基于迭代器，也有 next 方法
- 对异步处理更加友好

看个例子，使用原生的迭代器：

```ts
class Users {
    constructor(users) {
        this.users = users;
        this.len = users.length;
        this.index = 0;
    }

    [Symbol.iterator]() {
        return this;
    }

    next() {
        if (this.index < this.len) {
            return { value: this.users[this.index++], done: false };
        }
        return { done: true };
    }
}

const allUsers = new Users([
    { name: '李白' },
    { name: '杜甫' },
    { name: '王维' }
]);

for (const item of allUsers) {
    console.log(item)
}
```


使用 generators 可以简化如下：

```ts
class Users {
    constructor(users) {
        this.users = users;
        this.len = users.length;
    }

    *getIterator() {
        yield* this.users;
    }
}

const allUsers = new Users([
    { name: '李白' },
    { name: '杜甫' },
    { name: '王维' }
]);

const allUsersIterator = allUsers.getIterator();
for (const item of allUsersIterator) {
    console.log(item)
}
```

其中生成器函数也可以写成，当然使用 `yield *` 语法更加简洁。

```ts
*getIterator() {
    for (let i in this.users) {
        yield this.users[i];
    }
}
```


generator 的 next 还能传递参数。

```ts
function* gen(a, b) {
    let k = yield(a + b);
    let m = yield(a + b + k);

    yield(a + b + k + m);
}
var mygen = gen(10, 20)
mygen.next() // 30, k=30
mygen.next(50) // 80, because k = 50, a+b+k=10+20+50=80
mygen.next(100) // 180, because m = 100, k=50, a = 10, b = 20
mygen.next()
```