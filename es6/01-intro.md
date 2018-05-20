# ES6 简介

[TOC]

## ECMAScript 和 JavaScript 的关系

ECMAScript 是语言规范（代号为 [ecma-262](http://www.ecma-international.org/ecma-262/))，JavaScript 是该语言规范的实现，其余的实现还有 ActionScript 和 JScript 等。

## ES6 和 ES2015 的关系

首先看下 ECMAScript 的演化过程。

### ECMAScript 的历史渊源

ECMAScript 最成功的版本是 1999 年发布的 3.0（ES3），该版本奠定了 JavaScript 语法的基本语法。

之后酝酿发布 4.0，但是这个版本太激进，改革太彻底了，导致 TC39（Technical Committee 39，简称 TC39）的标准委员会一些成员不太接受，从而跳票。

由于分歧太大，中止 ES4 的开发，将其中一小部分功能添加到 ES3.1，项目代号为 Harmony（和谐），不久，ES3.1 就改名为 ES5。

ES5 新增了如下功能（包括但不限于）：

- 严格模式
- JSON 对象
- Array/String/Object/Date 相关方法
- Funtion.prototype.bind 方法等

ES5 正式发布后，一些可行设想定名为 JavaScript.next 继续开发，这就是现在的 ES6。

### 年份版本

TC 39 希望标准升级成为常规流程：**任何人在任何时候，都可以向标准委员会提交新语法的提案**。这样标准升级可以更加敏捷，每次新增的功能又不会过多，这样一来，就不需要以前的版本号了，只要用年份标记就可以了。

因此，ES2015 就是 ES6，ES2015 面向未来，ES6 面向过去。

## 提案标准流程

任何人都可以向标准委员会（又称 TC39 委员会）提案，要求修改语言标准。

一种新的语法从提案到变成正式标准，需要经历五个阶段。每个阶段的变动都需要由 TC39 委员会批准。

- stage 0: strawman（展示阶段）
- stage 1: proposal（征求意见阶段）
- stage 2: draft（草案）
- stage 3: candidate（候选人）
- stage 4: finised（定案）

一般来说，一个提案进入 stage 2，就很大希望进入正式标准。

提案可以去 [ecma262](https://github.com/tc39/ecma262) 查看。
