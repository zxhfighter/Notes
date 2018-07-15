# 函数扩展

## 函数参数默认值

ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

参数变量是默认声明的，所以不能用 let 或 const 再次声明。

另外，需要区分 _解构默认值_ 和 _函数参数默认值_ 两者的区别，如下。

```js
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

m1() // [0, 0]
m2() // [0, 0]
m1({}) // [0, 0]
m2({}) // [undefined, undefined]
m1({ x: 10 }) // [10, 0]
m2({ x: 10 }) // [10, undefined]
```

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。
这种语法行为，在不设置参数默认值时，是不会出现的。

```js
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

再看下面的例子。

```js
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

在参数作用域，没有找到 x，因此使用了全局的 x 值，注意下边的 let 定义是不会提升的。

## rest 参数

ES6 引入 rest 参数（形式为 `...变量名`），用于获取函数的多余参数，这样就不需要使用 arguments 对象了。rest 参数搭配
的变量是一个数组，该变量将多余的参数放入数组中。

```js
// arguments 变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

```js
// 报错
function f(a, ...b, c) {
  // ...
}
```

函数的 length 属性，不包括 rest 参数和默认值参数。

```js
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```

## 严格模式

从 ES5 开始，函数内部可以设定为严格模式。

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则
会报错。

## name 属性

函数的 name 属性，返回该函数的函数名。

## 箭头函数

```js
var sum = (num1, num2) => { return num1 + num2; }
const full = ({ first, last }) => first + ' ' + last;
var result = values.sort((a, b) => a - b);
const headAndTail = (head, ...tail) => [head, tail];
```

## 双冒号运算符

箭头函数可以绑定 this 对象，大大减少了显式绑定 this 对象的写法（call、apply、bind）。

但是，箭头函数并不适用于所有场合，所以现在有一个提案，提出了“函数绑定”（function bind）运算符，用来取代call、apply
、bind调用。

函数绑定运算符是并排的两个冒号（::），双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境
（即 this 对象），绑定到右边的函数上面。

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return obj::hasOwnProperty(key);
}
```

如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

```js
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);
```

如果双冒号运算符的运算结果，还是一个对象，就可以采用链式写法。

```js
import { map, takeWhile, forEach } from "iterlib";

getPlayers()
  ::map(x => x.character())
  ::takeWhile(x => x.strength > 100)
  ::forEach(x => console.log(x));
```

## 尾调用优化

尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。

```js
function f(x){
  return g(x);
}

// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
```

上面代码中，情况一是调用函数 g 之后，还有赋值操作，所以不属于尾调用，即使语义完全一样。情况二也属于调用后还有操作，即使
写在一行内。情况三等同于下面的代码。

```js
function f(x){
  g(x);
  return undefined;
}
```

尾调用不一定出现在函数尾部，只要是最后一步操作即可。

```js
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内
层函数的调用帧，取代外层函数的调用帧就可以了。

```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

上面代码中，如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息。但由于调用g之后，函数f就结束了，
所以执行到最后一步，完全可以删除f(x)的调用帧，只保留g(3)的调用帧。

这就叫做“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到
每次执行时，调用帧只有一项，这将 **大大节省内存**。这就是“尾调用优化”的意义。

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于
只存在一个调用帧，所以永远不会发生“栈溢出”错误。

```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120
```

上面代码是一个阶乘函数，计算 n 的阶乘，最多需要保存 n 个调用记录，复杂度 O(n) 。

如果改写成尾递归，只保留一个调用记录，复杂度 O(1) 。

```js
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```

还有一个比较著名的例子，就是计算 Fibonacci 数列，也能充分说明尾递归优化的重要性。

```js
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};

  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出
```

尾递归优化过的 Fibonacci 数列实现如下。

```js
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
  if (n <= 1) {return ac2};

  return Fibonacci2(n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 是如此，第一次明确规定，所有
ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。

那么问题来了，如何将递归改成尾递归，是否所有递归都能改成尾递归呢？
