# Node.js 入门经典

[TOC]

## 第一章 Node.js 介绍

Node.js 是个事件驱动的服务端 JavaScript 环境。

Node.js 中的 JavaScript 引擎使用了 [Chrome V8](https://en.wikipedia.org/wiki/Chrome_V8) 引擎，V8 能够直接将 JavaScript 编译成可执行的机器码，而不用先编译成字节码之类的。

由于 Node.js 的异步并发处理机制，非常适合于创建*多人游戏*，*实时系统*，*联网软件*，*具有上千个并发用户*，*混搭应用（Mashup）*，*单页面应用程序（SPA）*等应用程序。

看一个 Node.js 的 hello, world 程序。

```js
const ip = '127.0.0.1';
const port = 3000;
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Hello, World\n');
}).listen(port, ip);
console.log(`server runnint at http://${ip}:${port}`);
```

延伸阅读：[127.0.0.1、localhost、0.0.0.0、本机IP地址的联系和区别](https://gist.github.com/zxhfighter/b9f4b4ef328cd8b433b0e9dc2f4af26d)。

## 第二章 npm（Node包管理器）

npm 是 Node 的包管理器，采用了分而治之的思想，一个模块做好一件事情就好。

### 设置安装源

npm 安装有默认的官方安资源（registry），但是此安装源比较慢，需要设置成国内的。

```bash
$ npm config set registry https://registry.npm.taobao.org
```

### 查看默认设置

```bash
$ npm config list
$ npm config ls -l
```

### 安装

本地安装（install 可以缩写成 i）。

```
$ npm i underscore
```

全局安装，携带 `-g` 参数，不过推荐尽可能通过本地安装（全局安装存在版本滞后的问题）。

```
$ npm i -g angular-cli
```

本地安装，同时添加到 `dependencies` 字段。

```
$ npm i --save underscore
$ npm i -S underscore
```

本地安装，同时添加到 `devDependencies` 字段。

```
$ npm i --save-dev underscore
$ npm i -D underscore
```

### 卸载

卸载同安装，使用命令 `uninstall` 即可。

### 初始化 package.json

按照提示生成 package.json。

```
$ npm init
```

按照默认配置生成 package.json。

```
$ npm init --yes
```

### 使用第三方模块还是自己的模块

编写自己的代码解决是理解问题最好的方式，但是很多时候，你的问题已经有人解决了，此时可以考虑使用（优先）第三方模块。

## 第三章 Node.js 的作用

应用程序的 I/O 是不可预测的，尤其是与时间有关的时候。

```js
const http = require('http');
const urls = ['www.baidu.com', 'www.qq.com', 'www.bing.com'];

function fetchPage(url) {
    const startTime = +new Date();
    http.get({host: url}, res => {
        const ms = +new Date() - startTime;
        console.log(`got response from ${url}, took: ${ms} ms`);
    });
}

for (const url of urls) {
    fetchPage(url);
}
```

人类的行为也是没法预测的，因此事件驱动编程是处理不可预测性的极佳方式。

Node.js 将 JavaScript 解决不确定性所用的事件驱动方法加入到解决并发编程的可能方法清单，解决并发问题还包括使用多进程和多线程等，不同的是使用的是单线程的 JavaScript 语言。

## 第4章 回调


### 无所不在的回调

由于 JavaScript 中函数是第一类对象，因此可以作为参数传递，或者作为返回值。

```js
const fs = require('fs');
fs.readFile('somefile.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
```

Node.js 中一次又一次的使用回调。

```js
function fetchPage(url) {
    const startTime = +new Date();
    http.get({host: url}, res => {
        const ms = +new Date() - startTime;
        console.log(`got response from ${url}, took: ${ms} ms`);
    }).on('error', e => {
        console.log(`got error: ${e.message}`);
    })
}
```

回调首先是解决不可预测性的方法，它也是处理并发的高效方法。

### 同步阻塞和异步非阻塞

Node.js 对如何在网络和I/O操作中处理并发有自己的做法，所推崇的是异步方式。

同步和阻塞两个术语可以互换使用。异步和非阻塞也可以互换使用。

### 事件循环

事件循环以单线程为基础，因此为了确保高性能，需要遵循以下规则：

- 函数必须快速返回
- 函数不得阻塞
- 长时间运行的操作必须移到另一个进程中

Node.js 旨在网络中推送数据并瞬间完成，核心哲学是在事件循环和单一线程中去编程。

颜色阅读：[JavaScript 运行机制详解：再谈Event Loop
](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
