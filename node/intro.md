# Node 简介

[TOC]

## 安装

Node 可以从 [https://nodejs.org/en/download/](https://nodejs.org/en/download/) 下载安装包，按照提示安装即可。

Node 版本分为 LTS（Long Term Support） 长期维护版本和 Current 版本，LTS 版本比较稳定，Current 版本则包括了一些比较新的功能。

Node 会自带一个包管理器 npm。

## 常见命令

查看帮助。

```
$ node -h
```

查看版本。

```
$ node -v
$ npm -v
```

进入 REPL，查看对象。

```
$ node
> require('http')
```

不进入 REPL，查看 Node 中对象。

```
$ node -p 'require("http")'
```

退出（或者 Ctrl + C）。

```
$ node
> .exit
```

查看 v8 特征选项。

```
$ node --v8-options
$ node --v8-options | grep 'in progress'
$ node --v8-options | grep 'harmony'
```

在 harmony 模式下运行脚本（即已经完成但是还没有纳入标准的 staged 规范，例如 decorator）。

```
$ node --harmony app.js
```

调试脚本。

```
$ node --inspect app.js
```

如果想第一次启动脚本就暂停，可以使用：

```
$ node --inspect-brk app.js
```

升级自带的 npm 版本。

```
$ npm install npm -g
```

## Node 版本管理

在实际开发中，需要对 Node 版本进行管理，推荐使用 [n](https://www.npmjs.com/package/n) 来进行管理。

### n

安装 `n`。

```
$ npm install -g n
```

使用 `n` 安装 Node 版本。

```
$ n stable
$ n latest
$ n 0.8.14
$ n 8.11.1
```

输入 `n` 回车，可以查看所有安装的 Node 版本，移动上下箭头，回车可以选择需要的 Node 版本。

```
    node/0.12.4
    node/0.8.20
    node/4.3.2
    node/4.4.5
    node/6.2.0
    node/6.9.5
  ο node/8.11.1
```

使用 `n rm` 移除某个特定版本，快捷方式为 `n -`。

```
$ n rm 0.9.4 v0.10.0
$ n - 0.9.4
$ n prune
```

### nvm

另外一种管理 Node 版本的方式是使用 [nvm](http://nvm.sh/)，这里不再详述。

## Node, V8, ECMAScript

V8 引擎依赖 ECMAScript 标准，Node 则依赖 V8 引擎。

因此，如果一个 ECMAScript 的提案正式纳入标准后，需要 V8 引擎实现，然后 Node 再升级底层的 V8 引擎来实现。

在 Node 中，新的 ECMAScript 特征分为了三类：

- shipping 特征：V8 引擎认为稳定的特征，默认开启，无需任何标志位。
- staged 特征：已经完成，但是 V8 认为还不稳定的特征，需要运行时指定 `--harmony` 标志。
- in progress 特征：需要单独开启具体的特征

具体哪个版本的 Node 支持哪些特征，可以去 [node.green](http://node.green/) 查看。

## Node C/C++ 扩展

Node 本身是由 `C/C++` 编写而成的，内置模块也是，例如 `http`，`fs` 模块。

因此如果你对 `C/C++` 比较熟悉，也可以使用 `C/C++` 扩展来编写 Node 的模块（称为 add-on），不过也需要对 `V8`，`libuv`，`Internal Node.js libraries`，`OpenSSL` 等知识比较了解。

具体可以参见 [Hello, World Add-On](https://nodejs.org/dist/latest-v8.x/docs/api/addons.html)。

## Node 中的全局对象

### global

Node 中的全局对象为 `global`，浏览器宿主中的全局对象为 `window`。

两者的差异，如果变量在浏览器顶层环境使用 `var` 定义，那么该变量会成为 `window` 对象的一个属性，而 Node 中则是局部变量。

```
> var a = 1
undefined
> window.a
1
> function b() {}
> window.b
ƒ b() {}
```

在 Node 中，如果一个变量在模块中声明，那么只在该模块内可见，这是因为每个模块编译后，会使用匿名函数包裹起来。

```js
(function (module, exports, __filename, ...) {}())
```

### process

另外一个全局对象为 `process` 对象，也可以通过 `global` 对象获取 `process` 对象。

```
> global.process === process
```

`process` 对象关联了当前的标准输入输出（I/O），并且可以发送信号给事件循环退出循环。

```
> process.pid
> process.env.PATH
> process.versions
> process.stdin
> process.stdout
> process.stderr
```

`process` 的输入输出继承自 `EventEmitter`。

```js
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
    var input = process.stdin.read();
    if (input !== null) {
        process.stdout.write(input);

        // 这里能够使用 trim() 方法是因为设置了 utf-8 编码
        var command = input.trim();
        if (command === 'exit') {
            process.exit(0);
        }

        try {
            dosomething(command);
        }
        catch (e) {
            console.err(e);
            process.exit(1);
        }
    }
});
```

正常退出和异常退出程序。

```
> process.exit(0)
> process.exit(1)
```

## 二进制数据处理

JavaScript 在 ES6 之前并没有操作二进制数据流相关机制，后来由于 WebSockets，Canvas，WebGL 等技术的出现，在 ES6 中引入了 `ArrayBuffer` 对象和 `TypedArray`、`DataView` 等视图。

此时，在 Node 中已经自己实现了一个 `Buffer` 类用来处理二进制数据流，例如 TCP 流和文件流。

`Buffer` 类实现了 `TypedArray` 视图中的 `Uint8Array` API，不过针对 Node 环境额外进行了优化。

## 事件循环和计时器

Node 和浏览器都使用了 V8 引擎，但是宿主环境不一样了，因此都实现了自己的事件循环，相比浏览器，Node 中的事件循环更为复杂。

另外，Node 中的定时器和浏览器中的也略有差别，Node 中的计时器新增了两个方法 `ref()` 和 `unref()`。另外，新增了 `setImmediate()` 和 `clearImmediate()` 方法。

另外，可以用 `process.nextTick()` 来保证当前事件循环清空时立即执行。

【补充 Node 中和浏览器中事件循环的差异】

https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/


## 回调函数格式和异常处理

健壮的程序少不了对异常的处理，由于 Node 是基于事件驱动和非阻塞I/O，因此异步操作都需要一个回调函数来异步处理，同时传统的 try...catch 方式无法捕获异步异常，需要在回调函数中将异常传递出来，因此 Node 约定：

- 回调函数必须为异步操作的最后一个参数
- 回调函数的第一个参数必须为错误信息，如果为空返回 null，否则返回特定 Error 对象，其次才返回具体的数据

```ts
fs.readFile('file.txt', 'utf-8', (err, data) => {

});
```
