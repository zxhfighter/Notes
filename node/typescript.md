# 使用 TypeScript 来编写 Node

[TOC]

## 为什么要用 TypeScript 来编写 Node 程序

强类型能够编写出更易维护的代码，看下边的代码：

```js
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '.']);

ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
});

ls.on('close', code => {
    console.log(`child process exited with code: ${code}`);
});
```

如果你对 Node 不太熟悉，那么肯定不知道几个回调函数中的 `data` 是什么数据类型，有哪些方法，怎么用。

此时你可能会花费一些时间去翻阅各种文档，或者用 `console.log()` 打印出该对象来一看究竟。

不管哪一种方式，代码是不直观的。

而使用强类型的 TypeScript 则不一样，使用 TypeScript 改写如下：

```ts
import { spawn } from 'child_process';
const ls = spawn('ls', ['-lh', '.']);

ls.stdout.on('data', (data: Uint8Array) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data: Uint8Array) => {
    console.log(`stderr: ${data}`);
});

ls.on('close', (code: number) => {
    console.log(`child process exited with code: ${code}`);
});
```

此时很清晰的知道 data 是一个 `TypedArray` 类型。

另外，TypeScript 的自动提示可以很方便的查看 Node 内置模块的方法怎么用（参数类型和返回类型），不需要去翻阅官网或者书籍。

## 基本设置

可以使用 `ts-node` + `typescript` + `@types/node` 来搭建最基本的 Node 开发环境。

- `ts-node`：提供命令行中运行 TS 代码的能力
- `typescript`：`ts-node` 依赖的 TS 代码编译器
- `@types/node`：提供给 VSCode 的类型文件，若不提供，会报找不到 `child_process` 等模块的错误

### 初始化代码

```
$ mkdir tsnode-demo && cd tsnode-demo
$ npm init -y
$ npm install -S typescript
$ npm install -D ts-node @types/node
```

### 配置 tsconfig.json

之后，新建一个 `tsconfig.json` 文件，用于指导如何编译 TS 文件。

```json
{
    "compileOnSave": false,
    "compilerOptions": {
        "declaration": false,
        "emitDecoratorMetadata": true,
        "noImplicitAny": true,
        "noUnusedParameters": true,
        "module": "commonjs",
        "sourceMap": true,
        "moduleResolution": "node",
        "outDir": "dist",
        "target": "es5",
        "lib": [
            "es2015", "dom", "es2016.array.include"
        ],
        "skipLibCheck": true,
        "experimentalDecorators": true,
        "noEmitOnError": true,
        "strictNullChecks": true,
        "allowSyntheticDefaultImports": true
    },
    "include": [
        "src/**/*.ts"
    ],
    "exclude": [
        "node_modules/"
    ]
}
```

编写 `src/child.ts` 如下：

```ts
import { spawn } from 'child_process';
const ls = spawn('ls', ['-lh', '.']);

ls.stdout.on('data', (data: Uint8Array) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data: Uint8Array) => {
    console.log(`stderr: ${data}`);
});

ls.on('close', (code: number) => {
    console.log(`child process exited with code: ${code}`);
});
```

### 运行 TS 脚本

可以使用 ts-node 来运行这段脚本：

```
$ ./node_modules/.bin/ts-node src/child.ts
```

## 调试

如果你之前有调试 Node 的经验，可能会想到在后边添加 `--inspect` 参数。

```
$ ./node_modules/.bin/ts-node --inspect src/child.ts
```

很可惜，这样是行不通的。

### 使用 Chrome Devtools 调试

还是使用 node 来运行代码，不过添加 `-r ts-node/register` 参数，预加载 `ts-node/register` 模块。

因此调试代码如下：

```
$ node --inspect -r ts-node/register src/child.ts

# 启动时添加断点
$ node --inspect-brk -r ts-node/register src/child.ts
```

之后打开 [http://127.0.0.1:9229/json/list](http://127.0.0.1:9229/json/list)，复制其中的 `devtoolsFrontendUrl` 字段打开，设置断点就可以调试了（设置断点时，会自动使用 sourcemap 映射到源 ts 文件）。

### 使用 VSCode 调试

另外一种方式就是直接在 VSCode 中调试。

打开 `调试-添加配置`，选择 Node.js，会打开文件 `.vscode/launch.json`，添加如下配置：

```json
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "调试当前 JS 文件",
            "program": "${file}"
        },
        // see https://medium.com/@dupski/debug-typescript-in-vs-code-without-compiling-using-ts-node-9d1f4f9a94a
        {
            "type": "node",
            "request": "launch",
            "name": "调试当前 TS 文件",
            "args": ["${relativeFile}"],
            "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
            "sourceMaps": true,
            "cwd": "${workspaceRoot}",
            "protocol": "inspector"
        }
    ]
}
```

注意第二项，调试当前 TS 文件的配置，我们在运行参数中加上了 `--nolazy` 和 `-r ts-node/register` 参数，同时启用了 `insepctor` 协议以及对应的 sourcemap。

切换到要调试的 TS 文件，设置好断点后，选择 "调试当前 TS 文件" 调试器，就可以调试了。
