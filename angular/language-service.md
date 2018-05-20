# Angualr 语言服务

提供在 Angular 模板中（包括内联模板和外联模板）自动完成、错误提示、代码跳转等功能。

可以结合 VSCode 编辑器使用提供最优的开发体验。

## 基本功能

### 自动完成

能够自动补全一些原生 HTML 元素以及元素属性。

能够识别组件，提供自动补全。

能够识别绑定，在绑定 `{{}}` 中能获取组件属性以及属性的上下文，提供自动补全。

### 错误提示

例如在 `{{}}` 引用了一个组件中未定义的属性，会报错提示。

### 代码跳转

在模板中按住 `Command` 键和鼠标点击，可以跳转到属性的定义位置。

## 配置

1. VSCode 中，安装 `Angualr Language Service` 插件。

2. 查看是否已经安装 `@angular/language-service`，若没有，安装。

```
npm i -D @angular/language-service
```

3. 可选，在 tsconfig.json 的 compilerOptions 中添加如下字段：

```json
"plugins": [
    {"name": "@angular/language-service"}
]
```

## 实现原理

编辑器新开一个子进程服务，该服务与编辑器进程通过 RPC 来进行通信。

大致处理流程：

- 解析 HMTL 为 HTML AST
- Angular 编译器解析 HMTL AST
- 找到上下文后，列出所有可能的选项供自动完成

## 参考资料

- https://angular.io/guide/language-service
- https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s
