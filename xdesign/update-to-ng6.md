# 升级到 Angular 6

首先去这里查看更新步骤：https://update.angular.io/。

选择从 4.4 升级到 6.0，复杂应用，npm 包管理方式。

## 更新前工作

- 保证 Node 版本 8+，npm 5+
- 替换 `<template>` 为 `<ng-template>`
- 替换 `OpaqueToken` 为 `InjectionToken`
- 替换 `TrackByFn` 为 `TrackByFunction`
- 替换 `ngOutletContext` 为 `ngTemplateOutletContext`
- 替换 `Renderer` 为 `Renderer2`
- 如果使用 `preserveQueryParams`，请替换为 `queryParamsHandling`
- 动画引入(animate, state, keyframes等)从 `@angular/core` 变更为 `@angular/animations`
- HTTP 请求从 `@angular/http` 变更为 `@angular/core/http`，模块名称也从 `HttpModule` 变成了 `HttpClientModule`，服务名从 `Http` 变成了 `HttpClient`

## 更新

- Do not rely on gendir, instead look at using skipTemplateCodeGen. Read more
- tsconfig.json 添加 `preserveWhitespaces: off`
- 升级全局和本地 @angualr/cli（由于组件库没有使用 cli，本地安装这里可以跳过）
- 运行 `ng update @angular/core --force`
- 升级 rxjs 到 6.0.0，同时修复代码中引入 rxjs 地方的代码引用路径
- 升级 webpack 到 4.0.0，同时升级 webpack 相关的插件
- 替换 CommonsChunkPlugin 为 SplitsChunkPlugin，同时将 ngcwebpack 替换成 @ngtools/webpack
- 重新编写相应的 webpack 配置

## 更新后

检测更新后相关命令的执行情况：

- 【OK】npm run start
- 【OK】npm run dev
- 【OK】npm run test
- 【OK】npm run test-once
- 【OK】npm run watch:test
- 【OK】npm run build
- 【NOT OK】npm run build:demo:aot
- 【OK】npm run lint
- 【OK】npm run e2e
- 【OK】npm run component
- 【OK】npm run docs
- 【OK】npm run compodoc

关于本地 demo 的 aot 构建还需要继续研究一下。