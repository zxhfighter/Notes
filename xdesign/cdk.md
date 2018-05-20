# Material 本地托管服务解析

可以通过 `npm run demo-app` 来启动本地组件预览和开发。

可以在 `package.json` 的 `scripts` 字段中看到调用了 `gulp serve:devapp` 命令。

```js
// tools/gulp/tasks/development.ts
task('serve:devapp', ['build:devapp'], sequenceTask([':serve:devapp', ':watch:devapp']));
```

可以看到启动服务分为三个部分：构建应用，托管应用，监控应用。

## 构建应用

```js
// tools/gulp/tasks/development.ts
task('build:devapp', sequenceTask(
  'cdk:build-no-bundles',
  'material:build-no-bundles',
  'cdk-experimental:build-no-bundles',
  'material-experimental:build-no-bundles',
  'material-moment-adapter:build-no-bundles',
  [':build:devapp:assets', ':build:devapp:scss', ':build:devapp:ts']
));
```

构建应用又分为如下几个步骤：

- 构建 cdk 的非打包版本
- 构建 material 的非打包版本
- 构建一些实验性质的 cdk 的非打包版本
- 构建一些实验性质的 material 的非打包版本
- 构建 material moment 适配器的非打包版本
- 同步对资源、样式以及 ts 进行处理

上边对五个包构建了非打包版本，那么这个构建非打包版本的流程又包括哪些步骤呢？

```js
// tools/package-tools/gulp
// 其中 taskName 即包名，例如 cdk，material 等
task(`${taskName}:build-no-bundles`, sequenceTask(
    // Build the ESM output that includes all test files. Also build assets for the package.
    [`${taskName}:build:esm:tests`, `${taskName}:assets`],
    // Inline assets into ESM output.
    `${taskName}:assets:inline`
));
```

其中 `${taskName}:build:esm:tests` 编译包的 `index.ts` 和所有测试文件 `**/*.spec.ts`，编译成 target 为 es5，module 为 commonjs。

```js
// tools/package-tools/gulp
task(`${taskName}:build:esm:tests`, () => buildPackage.compileTests());
```

`${taskName}:assets` 则对资源进行处理等。

```js
// tools/package-tools/gulp
task(`${taskName}:assets`, [
    // 编译和压缩 scss，编译压缩后的 css 到对应的输出目录
    // 例如 /dist/packages/material/button/
    `${taskName}:assets:scss`,

    // 以及 /dist/packages/material/esm5/button/
    `${taskName}:assets:es5-scss`,

    // 同时拷贝源 scss 到上述两个输出目录
    `${taskName}:assets:copy-styles`,

    // 压缩 html 并拷贝到上树两个输出目录
    `${taskName}:assets:html`
]);
```

`${taskName}:assets:inline` 内联组件需要的 html 和 styles。

```js
task(`${taskName}:assets:inline`, () => inlineResourcesForDirectory(buildPackage.outputDir));
```

另外，对 ts 的编译如下：

```js
task(':build:devapp:ts', tsBuildTask(tsconfigPath));
```

## 托管应用

构建好后，进行托管。

```js
task(':serve:devapp', serverTask(outDir, true));
```

## 监控应用

监测依赖文件变更，刷新应用。

```js
task(':watch:devapp', () => {
  watchFiles(join(appDir, '**/*.ts'), [':build:devapp:ts']);
  watchFiles(join(appDir, '**/*.scss'), [':build:devapp:scss']);
  watchFiles(join(appDir, '**/*.html'), [':build:devapp:assets']);

  // Custom watchers for all packages that are used inside of the demo-app. This is necessary
  // because we only want to build the changed package (using the build-no-bundles task).
  watchFiles(join(cdkPackage.sourceDir, '**/*'), ['cdk:build-no-bundles']);
  watchFiles(join(materialPackage.sourceDir, '**/!(*.scss)'), ['material:build-no-bundles']);
  watchFiles(join(materialPackage.sourceDir, '**/*.scss'), [':build:devapp:material-with-styles']);
  watchFiles(join(momentAdapterPackage.sourceDir, '**/*'),
      ['material-moment-adapter:build-no-bundles']);
  watchFiles(join(materialExperimentalPackage.sourceDir, '**/*'),
      ['material-experimental:build-no-bundles']);
  watchFiles(join(cdkExperimentalPackage.sourceDir, '**/*'),
      ['cdk-experimental:build-no-bundles']);
});
```
