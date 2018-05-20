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

npx 会帮你执行依赖包里的二进制文件，也就是说运行 `npx webpack` 等价于运行下边的命令。

```
./node_modules/.bin/webpack
```

如果找不到，会去 `$PATH` 中去找，若还没有，就会帮你安装。

## 免配置

webpack 提供一个简单的默认配置达到"免配置功能"，然后，对于大多数应用来说，还是需要定制一个配置文件。

## mode

webpack 配置中提供了 mode 参数，可选 'production' 和 'development'，不提供，默认为 'production'。

不同的 mode，webpack 会自动加载相应的插件。

## 给 scripts 中的 webpack 命令添加参数

可以使用 `--` 添加参数到实际运行的第一个命令。

```
npm run build -- --colors.
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

由于所有文件都可能会被 Treeshaking，即使类似 css-loader 加载的 css 文件，而有些样式可能在之后的渲染过程中才能用到，此时 Treeshaking 就给你干掉了，因此需要排除 css 文件，不进行 Treeshaking。

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

## Farewell CommonsChunkPlugin, Hello SplitChunksPlugin

