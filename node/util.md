# util in Node

[TOC]

`util` 模块最早是给 Node 的内部 API 使用，不过其中的一些工具函数也挺适合模块开发者使用。

```js
const util = require('util');
```

出场率比较高的几个工具函数如下。

## util.format

格式化字符串，类似 `printf`。

```js
util.format('%s:%s', 'foo', 'bar', 'baz'); // 'foo:bar baz'
```

## util.promisify

将一个错误优先的回调函数 `(err, value) => ...`，返回使用 Promise 的函数形式。

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
```

与之相对的是 `util.callbackify`。

## util.callbackify

将一个返回 Promise 的函数改造成错误优先的回调函数形式。

```js
const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```

## util.TextEncoder & util.TextDecoder

Node V8.3.0 以后，增加了个字符串编码的类 `TextEncoder` 和字符串解码的类 `TextDecoder`，只支持 UTF-8。

```js
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');

const decoder = new TextDecoder();
const data = decoder.decode(uint8array);
```

## util.inherits

实现继承（不推荐使用），推荐使用 ES6 的 class 和 extends 来实现继承。
