# ES6 Module

## ES6 Module 制定原因

JavaScript 一直没有模块体系，ES6 之前社区制定了一些模块加载方案，主要的有 CommonJS 和 AMD 两种，前者用于服务器，后者用于浏览器。

ES6 在语言标准的层面上，实现了模块功能，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

## ES6 Module 和 CommonJS、AMD 等规范的区别

### 1.编译时加载和运行时加载的区别

ES6 模块的思想是尽量的**静态化**，在**编译阶段就确定模块的依赖关系**，以及输入输出的变量。

而 CommonJS 和 AMD 模块，都只能在**运行时确定依赖**，称之为**运行时加载**，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

### 2.输出值是实时值还是缓存值的区别

ES6 中 export 语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

CommonJS 模块输出的是值的缓存，不存在动态更新。

```js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

## export 语法

see https://www.ecma-international.org/ecma-262/6.0/#sec-exports

```js
export { name1, name2, …, nameN };
export { variable1 as name1, variable2 as name2, …, nameN };
export let name1, name2, …, nameN; // also var
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

export * from …;
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

使用 export default 有优点，但是更加推荐使用命名变量的 export，[原因](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad)如下：

- 更好的智能提示
- 更加方便重构（例如变量重命名）
- 更好的 tree-shaking，如果 export 一个大的变量配置对象，是没办法做有效的 tree-shaking 优化的

see https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html

```js
// do not try this at home
export default {
  propertyA: "A",
  propertyB: "B",
}
// do this instead
export const propertyA = "A";
export const propertyB = "B";
```

## import 语法

see https://www.ecma-international.org/ecma-262/6.0/#sec-imports

```js
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
```

由于 import 是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

另外，import 命令具有提升效果，会提升到整个模块的头部，首先执行。

```js
foo();
import { foo } from 'my_module';
```

如果多次重复执行同一句 import 语句，那么只会执行一次，而不会执行多次。

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

如果要 import 一个 commonjs 模块，可以用如下方式加载：

```js
import * as echartsLib from 'echarts';
const echarts = echartsLib.default ? echartsLib.default : echartsLib;
```

## 注意

This feature is only just beginning to be implemented in browsers natively at this time. It is implemented in many transpilers, such as TypeScript and Babel, and bundlers such as Rollup, Webpack and Parcel.

## 参考资料

- http://es6.ruanyifeng.com/#docs/module
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
- https://www.ecma-international.org/ecma-262/6.0/#sec-imports
- https://www.ecma-international.org/ecma-262/6.0/#sec-exports
- https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad
- https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
- https://medium.com/@timoxley/named-exports-as-the-default-export-api-670b1b554f65
