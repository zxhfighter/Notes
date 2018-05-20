# 调试 Node 程序

[TOC]

本文介绍的两个调试方法需要 Node 版本大于 6.3.0.

## 待调试程序

我们来调试下最经典的迷你服务器程序，新建一个文件 `app.js`，输入内容如下：

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## 使用 Chrome DevTools

输入命令：

```shell
$ node --inspect app.js

Debugger listening on ws://127.0.0.1:9229/de11b15e-cafe-4ccb-916e-5c76a9967e3d
For help see https://nodejs.org/en/docs/inspector
Server running at http://127.0.0.1:3000/
```

启动后，可以看到除了启动了我们自定义的迷你服务器，还可以看到启动了一个 WebSocket 服务，运行在 `ws://127.0.0.1:9229/de11b15e-cafe-4ccb-916e-5c76a9967e3d` 地址上。

输入 `http://127.0.0.1:9229/json/list` 可以看到这个调试实例的详细信息。

```json
[
    {
        description: "node.js instance",
        devtoolsFrontendUrl: "chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/de11b15e-cafe-4ccb-916e-5c76a9967e3d",
        faviconUrl: "https://nodejs.org/static/favicon.ico",
        id: "de11b15e-cafe-4ccb-916e-5c76a9967e3d",
        title: "app.js",
        type: "node",
        url: "file:///Users/baidu/node-demo/src/app.js",
        webSocketDebuggerUrl: "ws://127.0.0.1:9229/de11b15e-cafe-4ccb-916e-5c76a9967e3d"
    }
]
```

其中有一个在 chrome devtools 调试的地址 `devtoolsFrontendUrl`，将该地址在 chrome 浏览器中打开即可，同时原有的启动日志会加上 `Debugger attached.`。

```shell
$ node --inspect app.js

Debugger listening on ws://127.0.0.1:9229/de11b15e-cafe-4ccb-916e-5c76a9967e3d
For help see https://nodejs.org/en/docs/inspector
Server running at http://127.0.0.1:3000/
Debugger attached.
```

## 使用 VSCode

选择 `调试-打开配置`，选择 Node.js，此时会生成一个文件夹 `.vscode`，内有一个 `launch.json` 文件，保持文件内容不变。

然后选择 `调试-启动调试` 即可，在 VSCode 的调试控制台输出如下：

```shell
/usr/local/bin/node --inspect-brk=27456 src/app.js
Debugger listening on ws://127.0.0.1:27456/63d2d4e2-25a3-40e9-aaee-b81b9c93ca85
Debugger attached.
Server running at http://127.0.0.1:3000/
```

在编辑器中设置断点，然后在浏览器中打开 `http://127.0.0.1:3000/` 就可以调试了。

## 已过时的调试方法

自从 Node 7.7.0 版本以后，下边的调试方式已经不再推荐，请使用 `--inspect` 等方式代替。

### node inspect

node inspect 是 CLI 的调试工具，需要在代码中设置 `debugger;` 标记，然后启动：

```
$ node inspect app.js
```

之后进入命令行的调试界面，输入 `repl` 可以进入查看上下文变量等。

这种方式比较繁琐，需要记住一些[调试命令](https://nodejs.org/api/debugger.html)，偶尔应个急调试一些还是可以的。

### node debug

即使用 `node debug app.js` 的方式。

### node-inspector

使用第三方的 `node-inspector` 工具。

## 参考资料

- https://nodejs.org/en/docs/guides/debugging-getting-started/
- https://nodejs.org/en/docs/inspector/
- https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
