## Babel 全家桶

Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在现有浏览器环境执行。

Babel 需要配置文件 `.babelrc`（如果使用命令，也需要将配置选项当做参数传入），规定对哪些规则进行转码，一般包括 'presets' 和 'plugins'。

- presets：规则集，可选 'latest', 'state-0', 'react' 等等，是一系列 plugins
- plugins：插件列表，例如 'transform-es2015-arrow-functions', 'react-jsx' 等等

有些可能还会配置有 'env' 变量，在不同的 'env' 下使用不同的 'presets' 和 'plugins'。

```json
{
  "env": {
    "production": {
      "plugins": ["transform-react-constant-elements"]
    },
    "development": {
      "presets": ["stage-0"]
    }
  }
}
```

其中的 `env` 选项的值将从 `process.env.BABEL_ENV` 获取，如果没有的话，则获取 `process.env.NODE_ENV` 的值，它也无法获取时会设置为 "development" 。

`env` 的设置可以使用 `cross-env` 等 npm 包来设置，屏蔽不同操作系统设置环境变量的差异。

### babel-cli

命令行转码，可以在命令行使用 `babel` 命令。

```
$ npm install -g babel-cli
$ babel example.js -o out.js
$ babel src -d dist
```

### babel-node

提供 ES6 的 REPL 环境，输入 `babel-node` 后可以在控制台直接运行 ES6 代码。

```
$ babel-node
> (x => x * x)(2)
4
```

### babel-register

改写 `require()` 命令，每当使用 `require()` 加载 `.js`, `.jsx`, `.es6` 等后缀名的文件时，会先调用 Babel 进行实时转码。

```
$ npm install --save-dev babel-register
```

使用时，必须先加载 `babel-register`。

```js
require("babel-register");
require("./index.js");
```

**由于是在线转码，因此只适合在开发环境使用**。

### babel-core

在 Node 中环境中使用 babel 的 API 进行转码。

```
$ npm install --save-dev babel-core
```

然后，在项目中就可以调用 babel-core。

```js
var babel = require('babel-core');

// 字符串转码
babel.transform('code();', options);
// => { code, map, ast }

// 文件转码（异步）
babel.transformFile('filename.js', options, function(err, result) {
  result; // => { code, map, ast }
});

// 文件转码（同步）
babel.transformFileSync('filename.js', options);
// => { code, map, ast }

// Babel AST转码
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

此处 options 的配置参见 `.babelrc` 中的配置，可以参见 http://babeljs.io/docs/usage/api/。

### babel-polyfill

babel 默认只转化新的 JavaScript 句法（例如箭头函数，解构等），而不转化新的对象，比如 Iterator，Map，Set，Reflect，Proxy，Promise，Symbol 等，以及一些对象的方法，例如 `Object.assign`，`Array.from`，`String.padStart` 等。

安装命令如下：

```
$ npm install --save babel-polyfill
```

使用如下：

```js
import 'babel-polyfill';

// 或者
require('babel-polyfill');
```

**由于 babel 默认不转码的 API 非常多，因此该文件体积很大，推荐使用 core-js，按需引入（看了下，其实底层引入的就是 [core-js](https://github.com/zloirock/core-js) 和 [regenerator](https://facebook.github.io/regenerator/)）。**

```js
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
```

### eslint + babel

许多工具需要 babel 进行前置转码，例如 eslint 和 mocha 等。

```
$ npm install --save-dev eslint babel-eslint
```

在 eslint 配置文件 `.eslintrc` 中，在其中加入 parser 字段。

```js
{
  "parser": "babel-eslint",
  "rules": {
    // ...
  }
}
```

mocha 使用参考如下：

```json
"scripts": {
  "test": "mocha --ui qunit --compilers js:babel-core/register"
}
```

## 其他转码器

### TypeScript

由于 TypeScript 是 ES 的一个超集，因此 TypeScript 默认支持 ES6 语法的转码。

### Traceur

Google 公司的 Traceur 转码器，也可以将 ES6 代码转为 ES5 代码。
