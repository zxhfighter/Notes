本文介绍了 webpack 4 与之前版本的一些差异点。

## 安装

除了 webpack，还需要安装 webpack-cli。

```
npm install --save-dev webpack
npm install --save-dev webpack-cli
```

之后，在 package.json 中配置 scripts。

```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}
```

其本质是 scripts 中的命令会自动去目录 'node_modules/.bin/' 查找。

## npx

```shell
$ which npx
/usr/local/bin/npx
```

npx 命令在 Node 8.2+ 引入，npx 会帮你执行依赖包里的二进制文件，也就是说运行 `npx webpack` 等价于运行下边的命令。

```
./node_modules/.bin/webpack
```

如果找不到，会去 `$PATH` 中去找，若还没有，就会帮你安装，之后在执行。

## 免配置

webpack 提供一个简单的默认配置达到"免配置功能"，然后，这只适合一些很简单的 demo 应用，对于大多数应用来说，还是需要定制一个配置文件。

## mode

webpack 配置中提供了 mode 参数，可选 'production' 和 'development'，不提供，默认为 'production'。

不同的 mode，webpack 会自动加载相应的插件。

- 'development': 设置 `process.env.NODE_ENV` 为 'development'，同时自动加载 `NamedChunksPlugin` 和 `NamedModulesPlugin` 插件
- 'production': 设置 `process.env.NODE_ENV` 为 'production'，同时自动加载 `OccurrenceOrderPlugin`、 `UglifyJsPlugin`、`NoEmitOnErrorsPlugin`、`SideEffectsFlagPlugin`、`FlagDependencyUsagePlugin`、`FlagIncludedChunksPlugin`、`ModuleConcatenationPlugin` 插件
- 'none': 不做任何设置，也不加载任何插件

## 给 scripts 中的 webpack 命令添加参数

从 [npm@2.0.0](https://docs.npmjs.com/cli/run-script) 开始，可以使用 `--` 添加参数到实际运行的第一个命令（参数不会传递给 pre 或者 post 命令）。

```
$ npm run test -- --grep="pattern"
```

## Treeshaking

webpack 需要给 package.json 添加字段 `sideEffects: false`，来指示 webpack 进行 Treeshaking。

关于 sideEffects，比较典型的是 polyfills，在引入的时候会污染全局环境并且不提供 export。

如果你的代码库存在 sideEffects 的文件，可以提供一个数组参数表明：

```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```

需要注意的是，所有文件都可能会被 Treeshaking，即使类似 css-loader 加载的 css 文件，而有些样式可能在之后的渲染过程中才能用到，此时 Treeshaking 就给你干掉了，因此需要排除 css 文件，不进行 Treeshaking。

```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```

最后，"sideEffects" 可以在 `module.rules` 中去配置。

## alias

如果在项目中，需要引入一些公共资源，路径比较长的话（例如 '../../../../common/assets'），就需要考虑使用 `resolve.alias` 来简化引入路径了。

## CleanWebpackPlugin

使用 `CleanWebpackPlugin` 插件来删除目录时，需要指定 root 目录，否则会提示无法删除。

```ts
new CleanWebpackPlugin(['dist'], {
  root: __dirname
})
```

## 开发的三种模式

- 使用 webpack 的 watch 模式，即 `webpack --watch`，需要手动刷新浏览器
- 使用 webpack-dev-server

```ts
{
  devServer: {
     contentBase: './dist'
  }
}
```

- 使用 webpack-dev-middleware

可以结合 express，koa，browser-sync，gulp-connect 等 server 来使用。

```ts
const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

- 使用 Hot Module Replacement

## Hot Module Replacement

使用 webpack-dev-server 时，开启 HMR 可以在配置文件中或者命令行设置 hot 为 true。

```ts
{
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
```

使用 webpack-dev-middleware 时，需要结合 webpack-hot-middleware 一起使用。

在有依赖的文件中，热加载后需要做的处理。

```ts
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');

    // 需要注意的是，原来元素绑定的方法还是原来的，并不是更新的 printMe 方法
    // 需要做重新绑定
    printMe();
  })
}
```

## Farewell CommonsChunkPlugin, Hello SplitChunksPlugin

