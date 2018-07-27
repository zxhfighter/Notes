# let 和 const 命令

## 目的

为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为，提出了 let 和 const 命令。

## 特点

- 不存在变量提升（variable hoisting）（原来只有函数作用域和全局作用域，在这两个作用域中会存在变量提升）
- 变量必须先定义后使用
- 变量（在当前块级作用域）不能重复定义，因此不能在函数内部重新声明参数

```ts
function func(arg) {
  let arg; // 报错
}

function func(arg) {
  {
    let arg; // 不报错
  }
}
```

- 暂时性死区（块级作用域中出现 let 或 const，则该作用域为暂时性死区）
- 块级作用域（可以在块级作用域中定义函数了，此函数在当前作用域也会存在提升）

```js
{
    a();

    // 在块级作用域中定义函数，另外，a 函数提升了
    function a() {
        console.log('hello');
    }
} // 此块级作用域运行后，返回函数 a
```

- 在 for 循环中使用 let 时，需要注意，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
- let 声明在循环内部的行为是专门定义的，每次循环都会创建新的绑定，另外，在 for 循环中使用 const 可能引发错误

```ts
for (let i = 0; i < 10; i++) {

    // 如果在同一个作用域，是无法重复声明的，会报 SyntaxError
    let i = 'abc';
    console.log('abc');
}
```

- typeof 不一定返回字符串，可能会抛出 ReferenceError 异常，因为在使用 let 命令声明变量之前，该变量都是不可用的，
形成了暂时性死区

```js
{
    typeof x; // => ReferenceError
    let x;
}
```

- const 和 readonly 的区别，const 用于声明变量，readonly 来修饰类的属性（typescript 中）

```js
const a = 1;
class A {
    readonly name = 'a';
}
```

- const 命令声明就必须初始化，const 锁定的是对象引用，所以对象和数组可以更改其中内容
- 如何将一个对象的本身和递归属性全部冻结（也即无法修改）？

```js
const constantize = obj => {
    Object.freeze(obj);

    Object.keys(obj).forEach((key, i) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });
}
```

- ES6 中声明变量有几种方法？（六种，var/function/let/const/import/class）
- 只有 var 和 function 声明的全局变量为顶层对象（浏览器环境的 window）的属性，用 let 和 const 在全局定义变量，不能覆盖全局变量，只能遮蔽

```ts
var RegExp = 'Hello';
console.log(window.RegExp)

let RegExp = 'Hello';
console.log(RegExp)
console.log(window.RegExp === RegExp)
```

- 如何获取当前环境的顶层对象？例如 Node 中为 global，浏览器环境中为 window

```js
// 不过如果浏览器启用了 CSP（Content Security Policy，内容安全策略）
// eval 和 new Fucntion 可能无法使用
const global = new Function('return this')();

// 方法二
const getGlobal = function () {
  // 浏览器和 Web Worker 里面，self 也指向顶层对象
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

- **建议优先使用 const，其次是 let，避免使用 var**
- es6 模拟 iife 特别方便，只要一个块级作用域，并使用 let 或 const 形成暂时性死区

es5 iife:

```js
(function () {  // open IIFE
    var tmp = ···;
    ···
}());  // close IIFE
```

es6 block scope + let:

```js
console.log(tmp); // ReferenceError

{  // open block
    let tmp = ···;
    ···
}  // close block

console.log(tmp); // ReferenceError
```

- let 和 const 结合数组和对象的解构功能，可以一次性定义多个变量

```js
let {a, b} = {a: 1, b: 2};
let [a, b] = [1, 2];
```

- 最佳实践：默认使用 const，只有确实需要改变变量的值时使用 let，可以避免很多 BUG 的源头
