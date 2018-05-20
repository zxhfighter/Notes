# xdesign 项目中的工作流

完整的项目工作流包括：

- 项目脚手架工具
- 开发
- 本地 mock 服务
- 联调（本地 mock 服务和测试服务无缝切换）
- 代码检测
- 单元测试
- 集成测试
- 文档生成
- 编译构建
- 自动提交
- 持续集成发布

## 项目脚手架

脚手架能够快速搭建项目原型。

xdesign 项目中脚手架工具主要基于 gulp，具体包括：

- **自动生成组件工具**：可以自动生成开箱即用的组件原型代码，以及更新依赖组件的关联文件。
- **组件开发脚手架工具（TODO）**：可以一键生成基于 Angular 的组件库框架，开箱即用。

其中自动生成组件工具所做工作如下：

- 1. 拷贝组件脚手架代码，并根据输入的组件名称替换对应的文件（包括 ts, html, less 等）中的占位符，并重命名文件名称
- 2. 更新引入组件的入口文件
- 3. 更新引入组件样式的入口文件
- 4. 拷贝组件Demo脚手架代码，包括：

        - 并根据输入的组件名称替换对应的文件（包括 ts, html, less 等）中的占位符，并重命名文件名称
        - 使用 gulp-dom 更新相关的 html 文件，插入引用组件的模板
        - **同时使用 AST 来自动更新依赖的路由（`app.router.ts`）和模块文件（`app.module.ts`），TODO**

## 开发

本地代码开发基于 webpack 来构建 ts 代码，并使用 browser-sync 来托管构建产物。

为了在开发过程中实时查看最新的基于注释的文档，因此也在托管前也对文档进行了实时构建，文档生成参见下文。

```
clean
  -> docs generate
  -> webpack compile
  -> serve compiler(browser sync)
  -> watch mock and html
```

其中托管产物时，加入了三个中间件： `http-proxy-middleware` 或 mock 中间件（用于代理转发），`webpack-dev-middleware`（用于开发刷新），`webpack-hot-middleware`（用于热加载），**关于 Angular 中的热加载，效果并不理想，需要进一步研究**。

另外，使用了 browser-sync 工具的 watch 功能检测 mock 数据的变更和 html 文件的变更，自动刷新。

## 本地 mock 服务

上文提到，启动本地开发时，会根据启动参数启动区分是本地调试环境还是远程调试环境，如果是本地调试环境会使用 mock 中间件，否则会启用 `http-proxy-middleware` 中间件。

mock 中间件的原理比较简单，我们会在所有请求发送时，添加一个自定义 Head 字段 `x-requested-with` 为 `XMLHttpRequest`。

之后会建立和请求路径一致的文件目录，便于寻找本地 mock 文件路径。

为了避免重名的文件，最后会根据请求动词，建立一个上级的请求动词目录。

最后，需要删除缓存文件，否则修改 mock 后刷新时会使用之前缓存的数据。

```js
module.exports = function (req, res, next) {

    const isXHR = req.headers['x-requested-with'] === 'XMLHttpRequest';
    const isHTML = /\.html$/g.test(req.url);

    // 非 ajax 请求或者 html 请求直接 pass
    if (!isXHR || isHTML) {
        return next();
    }

    // 路径，例如 /global/user/1
    let pathname = req._parsedUrl.pathname;

    // ...
    const cacheKey = path.resolve(__dirname, moduleName) + '.js';
    delete require.cache[cacheKey];

    // 请求最新数据
    const mockFile = require(moduleName);

    // 设置响应头
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    // 设置响应内容
    res.end(JSON.stringify(mockFile(urlParams)), 'utf-8');
};
```

## 联调

联调使用了 `http-proxy-middleware` 来做代理。

```js
serve({
    middleware: [
        helper.isProxy() ?  proxyMiddleware(proxyConfig.prefix, { target }) : interceptor
    ]
})
```

其中 proxyConfig 是根据启动参数和配置文件获取的代理设置。

target 为根据 proxyConfig 中的 host, path 和 port 最终拼接好的代理 url。

```js
module.exports = {

    // 代理配置
    proxy: {

        // rd 代理环境
        rd: {
            prefix: '/api',
            host: 'http://xxx.com',
            path: 'abc/index.php',
            port: 8080
        },

        // qa 代理环境
        qa: {
            prefix: '/qa',
            host: 'http://yyy.com',
            port: 8081
        }
    }
}
```

## 代码检测

代码检测包括使用 tslint 检测 ts 代码和 stylelint 检测 less 代码。

### tslint

tslint 使用了 tslint 的一套规范和 codelyzer 的规范。

另外，还可以自定义规则。

### stylelint

stylelint 除了使用默认的一些规则，也可以自定义规则。

## 单元测试

TODO，单元测试完善

## 集成测试

TODO，组件的 e2e 测试框架

## 文档生成

TODO，文档内容（注释）完善

## 编译构建


## 自动提交

## 持续集成发布
