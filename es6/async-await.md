# async/await

## 目的

ES2017 标准引入了 async 函数，使得异步操作变得更加方便。

async 函数是什么？一句话，它就是 Generator 函数的语法糖，那么首先得了解 Generator 函数是什么。

## 使用方式

在函数前边添加关键字 `async`，可以有如下四种形式：

```ts
// 函数声明
async function foo() { }

// 函数表达式
const foo = async function () { }

// 方法
let obj = { async foo() { } }
class A { async foo() { } }

// 箭头函数
const foo = async () => { }
```

## 永远返回 Promises

async 函数执行后，永远返回 Promise，即使不是显示的返回 Promise，也会使用 `Promise.resolve` 或者
`Promise.reject` 转化为 Promise。

```ts
async function asyncFunc() {
    return 123;
}

asyncFunc().then(console.log) // => 123
```

Reject 一个 Promise 如下：

```ts
async function asyncFunc() {
    throw new Error('Problem!');
}

asyncFunc().catch(err => console.log(err));
```

## await 操作符

await 只允许在 async 中使用，操作数只能是一个 Promise，如果 Promise 完成，await 返回执行结果，否则抛出异常。

按顺序处理多个异步请求。

```ts
async function asyncFunc() {
    const result1 = await otherAsyncFunc1();
    console.log(result1);
    const result2 = await otherAsyncFunc2();
    console.log(result2);
}

// Equivalent to:
function asyncFunc() {
    return otherAsyncFunc1()
    .then(result1 => {
        console.log(result1);
        return otherAsyncFunc2();
    })
    .then(result2 => {
        console.log(result2);
    });
}
```

并发处理多个请求。

```ts
async function asyncFunc() {
    const [result1, result2] = await Promise.all([
        otherAsyncFunc1(),
        otherAsyncFunc2(),
    ]);
    console.log(result1, result2);
}

// Equivalent to:
function asyncFunc() {
    return Promise.all([
        otherAsyncFunc1(),
        otherAsyncFunc2(),
    ])
    .then([result1, result2] => {
        console.log(result1, result2);
    });
}
```

处理异常。

```ts
async function asyncFunc() {
    try {
        await otherAsyncFunc();
    } catch (err) {
        console.error(err);
    }
}

// Equivalent to:
function asyncFunc() {
    return otherAsyncFunc()
    .catch(err => {
        console.error(err);
    });
}
```

参数依赖。

```ts
function getDataA() {
    return Promise.resolve('a');
}

async function getDataB(param) {
    return await param + '-b';
}

async function getData() {
    const dataA = await getDataA();
    const result = await getDataB(dataA);
    return result;
}

getData().then(data => console.log(data));
```

## async 和 generator 关系

看一个 generator 函数。

```ts
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

改写成 async 如下：

```ts
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

一比较就会发现，async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await，仅此而已。

async 函数对 Generator 函数的改进，体现在以下四点。

- 内置执行器

Generator 函数的执行必须靠执行器，所以才有了 co 模块，而 async 函数自带执行器。也就是说，async 函数的执行，与普通
函数一模一样，只要一行。

- 更好的语义

async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待
结果。

- 更广的适用性

co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise
对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

- 返回值是 Promise

async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 then 方法指定
下一步的操作。

进一步说，async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。
