# Angular CLI

> PS: 本文基于 Angular CLI 6

[angular-cli](https://github.com/angular/angular-cli) 是一个能帮助你快速创建 Angular 项目的脚手架工具。提供了项目创建、开发、托管、构建、Lint、测试等一套完整的工作流。

## Node 和 NPM 版本要求

```shell
$ node -v
$ npm -v
```

最新的 Angular CLI 6，需要 Node 版本需要 8+，NPM 需要 5+。

## 安装

如果之前安装了，升级到最新版本：

```shell
$ npm uninstall -g @angular/cli
# if npm version is < 5 then use `npm cache clean`
$ npm cache verify
$ npm install -g @angular/cli@latest
```

## 创建应用

创建新项目使用 `ng new` 命令，可以根据项目要求按需提供一些参数。

```shell
$ ng new lego --skip-tests --style=less --prefix=lego
```

- `--skip-tests=true` 属性忽略生成组件测试文件（e2e及测试相关配置文件需要手动删除）
- `--style=less` 属性指定样式文件名后缀为 less（默认为 css），默认样式也可以通过设置命令来修改：`ng set defaults.styleExt less`
- `--prefix=lego` 属性指定有所有组件的标签选择器前缀为 `lego-`（默认为 `app-`）

最后，这些属性可以在 `angular.json` 配置文件中去修改。

另外一个比较酷的选项是 `--collection`，可以选择要使用的 `Schematics` 集合，来使用特定生成模板，后文会说明。

另外，如果，可以设置新项目下载 NPM 包的 registry 来提高下载速度，这里设置成 cnpm（需要事先在全局安装 cnpm 包）。

```shell
$ ng config -g cli.packageManager cnpm
```

生成的项目目录结构如下（`tree -L 1`）：

```
.
├── README.md          ----- 说明
├── angular.json       ----- CLI 配置文件
├── e2e                ----- 端到端测试
├── node_modules       ----- 库
├── package.json       ----- 包描述文件
├── src                ----- 源目录
├── tsconfig.json      ----- TS编译配置文件
└── tslint.json        ----- 代码风格检查文件
```

## 启动应用

按照约定俗称的习惯，可以先使用 `npm start` 命令启动和托管应用。

```shell
$ npm start
```

按照提示打开 `http://localhost:4200`，不出意外，会看到应用程序已经成功启动了。

一般来说，我们希望启动应用后直接打开浏览器，刚才的 `npm start` 命令其实只是调用了 `ng serve` 命令，这个命令可以使用参数 `--open` 直接打开浏览器。

```shell
$ ng serve --open
```

如果默认的端口被占用，可以配置新的端口以及 host（有些情况下会出现 Invalid Host Name错误，此时需要显示配置 host）。

```shell
$ ng serve --host 0.0.0.0 --port 4201 --open
```

## 添加 material 组件库

```shell
ng add @angular/material
```

You can add pre-packaged functionality to a new project by using the ng add command. The ng add command transforms a project by applying the schematics in the specified package. For more information, see the Angular CLI documentation.

## 实时更新(Live Reload)

打开 `app.component.html`，修改其中的任意内容，保存后看网页是否实时刷新。

打开 `app.component.css`（或者 `.less`），添加内容如下：

```css
h1 {
    color: red;
}
```

不出意外，标题变红了！

打开 `app.component.ts`，修改为：

```js
// ...
export class AppComponent {
  title = "Lego"
}
```

页面标题也实时刷新。

不过细心的人会发现，这种实时刷新是整个页面刷新，并不是热加载局部刷新，下边的热加载更新会介绍如何来尽可能做到局部刷新。

## 风格检查(Lint)

可以运行 `ng lint` 来检查，这些检查的 rules 规则定义在 `tslint.json` 中，相关 rules 规则的解释可以查看 [gist](https://gist.github.com/zxhfighter/c3bcbf5a86073a77cc7836a06533a2cd)。

其中的规则结合了 tslint 的规则（针对 TS）和 codelyzer（针对 Angular ） 的一些规则。


```json
{
  "rulesDirectory": [
    "node_modules/codelyzer"
  ],
  "rules": {
    "arrow-return-shorthand": true,
    // ...
  }
}
```

```shell
$ ng lint
```

会提示如下：

```
ERROR: /Users/apps/lego/src/app/app.component.ts[9, 11]: " should be '

Lint errors found in the listed files.
```

其中，`Command` + 鼠标单击可以跳转到特定的代码位置，去修改相应代码。

其中 lint 还有一些可选参数，其中的 `--fix` 参数能够修复一些简单的错误，不过不要过分依赖这个自动修复。

```shell
$ ng lint --fix
```

不过，手动运行 lint 还是有点麻烦，如果想在修改完一个文件后实时 lint，这个需要怎么做，这个大家可以思考思考。

好了，我们来看下构建吧。

## 构建(Build)

```shell
$ ng build
```

构建会从 `.angular-cli.json` 中去读取相关配置。

上述命令默认为开发环境构建，等同于：

```shell
$ ng build --target=development --environment=dev
$ ng build --dev --e=dev
$ ng build --dev
$ ng build
```

其中用到了如下特性（关闭 aot 构建、生成 sourcemaps 等）：

```
--aot=false
--envrionment=dev
--output-hashing=media
--sourcemaps=true
--extract-css=false
```

如果需要生成生成环境的构建，运行如下命令：

```
$ ng build --prod

// 等同于
$ ng build --target=production --environment=prod
$ ng build --prod --env=prod
```

默认开启的选项有（开启 aot 构建，关闭 sourcemaps 等）：

```
--aot=true
--envrionment=prod
--output-hashing=all
--sourcemaps=false
--extract-css=true
```

我们可以看下默认构建的文件大小（生产环境）。

```shell
$ ls -alh dist/

-rw-r--r--   1 xxx  staff   5.3K  6 26 12:05 favicon.ico
-rw-r--r--   1 xxx  staff   698B  6 26 12:05 index.html
-rw-r--r--   1 xxx  staff   1.4K  6 26 12:05 inline.a5e3d2d7744618897ae8.bundle.js
-rw-r--r--   1 xxx  staff   5.2K  6 26 12:05 main.8427633bb8b01b93cb97.bundle.js
-rw-r--r--   1 xxx  staff    60K  6 26 12:05 polyfills.1afc07fd8ec7201977c6.bundle.js
-rw-r--r--   1 xxx  staff     0B  6 26 12:05 styles.d41d8cd98f00b204e980.bundle.css
-rw-r--r--   1 xxx  staff   223K  6 26 12:05 vendor.0d2bee3de7a805e4fab5.bundle.js
```

最大的为 `vendor` 文件，有 223K 大小，gzip 压缩后（`gzip vendor.0d2bee3de7a805e4fab5.bundle.js`）也有 55K 大小。

## 添加自己的环境变量

有时候我们需要添加自己的环境变量，例如添加一个参数 `hmr` 来控制是否开启热加载，可以分为三步：

1. 创建一个 `src/environments/enviroment.NAME.ts`
2. 添加 `{"NAME": 'src/environments/enviroment.NAME.ts'}` 到 `.anguler-cli.json` 的 `app[0].enviroments` 数组中
3. 使用时添加 `--env=NAME` 参数

## 测试(Test)

如果是库项目或者一些公有底层项目，一个项目需要配套的测试文件，可以使用 `ng test` 来进行单元测试，使用 `ng e2e` 来进行集成测试。

> 提示：如果运行 `ng test` 出现错误，删掉 node_modules 重新安装试试。另外，`ng e2e` 依赖 chrome 浏览器的版本不能低于某个版本，如果报错，请升级 chrome 版本。

不过如果是变化频繁的业务型项目，可以看情况是否启用测试。

如果不需要测试，可以将相关测试文件全部删掉即可，另外用 `ng new` 和 `ng g` 生成项目和组件时，可以忽略生成测试文件。

```shell
$ ng new lego --skip-tests=true
$ ng g c header --spec=false
```

## 脚手架(Scaffold)

可以使用命令快速生成项目代码：

```
Component     ng g component my-new-component
Component     ng g component my-new-component
Directive     ng g directive my-new-directive
Pipe          ng g pipe my-new-pipe
Service       ng g service my-new-service
Class         ng g class my-new-class
Guard         ng g guard my-new-guard
Interface     ng g interface my-new-interface
Enum          ng g enum my-new-enum
Module        ng g module my-module
```

## 自定义脚手架

如果有自己的代码规范，那么使用脚手架生成的代码很可能就不符合代码规范，每一次需要 format（希望你不要人肉去改），还是挺麻烦的。

另外 `ng g c` 等命令的配置较少，没有针对一些样式格式的配置（例如默认缩进空格）。

我们来生成一个组件 `header`，不需要单测文件，使用了 `--spec=false`。

```shell
$ ng g c header --spec=false
```

生成代码如下：

```js
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lego-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

我们希望：空格默认为 4 个，并且 `import` 语句的大括号旁边没有空格，有两种方案解决这个问题：

- 继续使用 `ng g` 等命令

如果希望继续使用 `ng g` 等命令，需要修改 angular cli 的源代码，找到 `angular/cli/blueprints/component/files/__path__`目录，列出其中文件如下：

```
.
├── __name__.component.__styleext__
├── __name__.component.html
├── __name__.component.spec.ts
└── __name__.component.ts
```

修改这些对应的模板文件即可。

此种方式的缺点是，直接修改了 `node_modules`!，很明显，此种方式是不利于团队的。

- 不使用 `ng g` 命令

另外一种方式是，不用 `ng g` 来生成组件，可以借助编辑器的 snippet 功能，自定义 snippet，此种方式也是非常不错的一种方式，缺点是需要新建多个文件（`ng g`则一次性生成了组件的多个文件）。

举个例子，用 vscode 自定义了一个组件的 snippet，在 ts 文件中，输入 `ngC` 就能看到该提示，按 tab 键就能自动填充了。

关于如何自定义 vscode 的 snippet，可以参考 [官网文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)。

```json
"Angular Component": {
    "prefix": "ngComponent",
    "body": [
      "import {",
      "    Component, Input, Output, EventEmitter, ",
      "    OnInit, ViewEncapsulation, ChangeDetectionStrategy",
      "} from '@angular/core';\n",
      "@Component({",
      "    selector: '${1:tag-name}',",
      "    templateUrl: './${3:list.component.tpl.html}',",
      "    styleUrls: ['./${4:list.component.less}'],",
      "    encapsulation: ViewEncapsulation.Emulated,",
      "    changeDetection: ChangeDetectionStrategy.Default",
      "})",
      "export class ${2:ComponentName}Component implements OnInit {",
      "    name = '${2:ComponentName}';\n",
      "    constructor() {\n",
      "    }\n",
      "    ngOnInit() {\n",
      "    }",
      "}\n"
    ],
    "description": "Define an Angular Component"
  }
```

## 热加载(HMR)

由于 angular 的模块和组件设计机制，修改一个组件，最终的变动会冒泡到根组件和根模块，从而导致整个组件树刷新。

如果你仔细看了 angular-cli 的相关文档，会发现 `ng serve` 有一个 `hmr` 参数，我们来试一下。

为了测试 HMR 是否生效，可以做个实验，在 index.html 添加一个 input 输入框。

```html
<body>
  <input type="text">
  <lego-root></lego-root>
</body>
```

应用启动后，在输入框输入若干文字，然后修改 app 组件中的任意内容，看刚才输入的文字是否还存在，如果存在的话，说明 HMR 生效了，否则说明 HMR 不生效，fallback 到了 livereload 功能。

也就是说 HMR 只会更新 `lego-root` 组件的内容，而 livereload 就是全页面刷新了。

```shell
$ ng serve --hmr --open
```

实验之后，会发现 `--hmr` 并没有带来 HMR 的效果。

不过仔细看看命令启动时的文字提示，会看到如下的提示：

```
NOTICE Hot Module Replacement (HMR) is enabled for the dev server.
  The project will still live reload when HMR is enabled,
  but to take advantage of HMR additional application code is required
  (not included in an Angular CLI project by default).
  See https://webpack.github.io/docs/hot-module-replacement.html
  for information on working with HMR for Webpack.
```

大致意思是说，要实现 HMR 功能，需要添加 HMR 相关的额外代码，这些代码 angular cli 项目本身不提供，详情可以参见 [这个网址](https://webpack.github.io/docs/hot-module-replacement.html)。

不过上面的网址只是官方 webpack 的 hmr 介绍，对 angular-cli 的 HMR 如何配置并没有任何帮助，还是来看看 [这篇文章](https://medium.com/@beeman/tutorial-enable-hrm-in-angular-cli-apps-1b0d13b80130) 吧。

另外最近发现 angular/cli 的官网也有相关 [story](https://github.com/angular/angular-cli/wiki/stories-configure-hmr) 了。

配置完毕后，HMR 整体还是比 livereload 全页面要快不少的。

## [代理(Proxy)](https://github.com/angular/angular-cli/wiki/stories-proxy)

例如我们一个站点 `http://localhost:4200/api`，想将所有 `/api` 开头的请求代理到 `http://localhost:3000`，可以使用 `--proxy-config` 参数：

```shell
$ ng serve --proxy-config proxy.conf.json
```

其中 `proxy.conf.json` 内容如下：

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

除了单个路径，还可以代理多个路径，下边请求以 `/my`，`/many` 等开头的全部代理到 `http://localhost:3000`。

```js
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

如果深入了解下，`ng serve` 底层使用了 `webpack-dev-server`，而 `webpack-dev-server` 又使用了 `http-proxy-middleware`。

## [启动多个APP](https://github.com/angular/angular-cli/wiki/stories-multiple-apps)

有时候需要启动多个 app，例如一个 app 提供 mock 数据服务，另一个 app 提供业务代码逻辑。

- 第一步：修改 `.angular-cli.json` 的 `apps` 数组，添加一个新 app 配置对象后如下：

```shell
{
    "name": "mock",
    "root": "src",
    // ...
    "main": "main.ts",
    "polyfills": "polyfills.ts",
    "test": "test.ts",
    "tsconfig": "tsconfig.app.json",
    "testTsconfig": "tsconfig.spec.json",
    "prefix": "app",
    ...
  },
  {
    "name": "main"
    "root": "src",
    // ...
    "main": "main2.ts",
    "polyfills": "polyfills2.ts",
    "test": "test2.ts",
    "tsconfig": "tsconfig.app.json",
    "testTsconfig": "tsconfig.spec.json",
    "prefix": "app2",
    ...
  }
```

其中，新 app 配置对象需要修改 `main`、`pollyfills`、`test`、`prefix` 等字段，同时两个配置文件都添加了 `name` 字段。

- 第二步：修改启动命令，添加 `-app` 参数。

```shell
$ ng serve --app=mock && ng serve --app main
```

`--app` 参数同时能接受序号。

```shell
$ ng serve --app=0 && ng serve --app 1
```

## 总结

- 设置自定义下载源：
  `ng set --global packageManager=cnpm`
- 新建项目忽略测试文件，使用 less：
  `ng new lego --skip-tests=true --style=less --prefix=lego`
- 生成组件时不生产测试文件：
  `ng g c header --spec=false`
- 托管应用使用 `--open` 自动打开浏览器：
  `ng serve --host 0.0.0.0 --port 4301 --open`
- 代码检查后 `command + 鼠标单击` 定位错误，同时使用 `--fix` 来修复简单错误
  `ng lint --fix`
- 配置 HMR 来提供开发效率
- 修改脚手架文件或者定义 snnipet 来统一代码规范
- 使用代理来进行请求拦截，适用于 mock 数据和真实数据切换等场景


## 参考资料

- https://medium.com/@beeman/how-to-do-x-in-angular-cli-v6-db7530c23066