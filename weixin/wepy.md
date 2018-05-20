# wepy

## install

```
npm install wepy-cli -g
```

## init a project

```
wepy init standard myproject
```

## coding style

- 变量与方法尽量使用驼峰式命名，并且注意避免使用 `$` 开头
- 小程序入口、页面、组件文件名的后缀为 `.wpy`
- 可以使用 ES6 语法开发，因此也支持 `Promise` 和 `async/await` 等对象
- 事件绑定语法使用优化语法代替，类似 Vue，同时事件传参使用优化后语法代替
- 自定义组件命名应避开微信原生组件名称以及功能标签 `<repeat>`

## main features

- 更贴近于 MVVM 的架构模式（在小程序上进一步封装）
- 支持组件化开发，组件隔离，组件通信等
- 支持加载外部 NPM 包
- 单文件模式，目录结构更清晰，开发更方便
- 默认使用 babel 编译，支持 ES6/7 的一些新特性
- 针对原生 API 进行优化
