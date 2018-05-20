# 指南

## JS 类型系统

1. JS 数据类型包括 7 种：string、number、boolean、null、undefined、object 以及 symbol（es6 引入）。

2. JS 中的函数和数组是两种特殊的 object 类型，使用 typeof 操作符前者返回 'function'，后者返回 'object'（注意不是返回 'array'，没有这种类型），另外 Date 之类的也属于特殊的 object 类型，有自己的属性和方法。三种基本值类型都有自己的包装对象，即 String、Number、Boolean。

3. 使用 typeof 可以查看变量类型（es6 中此操作符不一定返回字符串，可能会报引用错误），其中 null 返回 'object'（语言设计错误，但是影响过于深远，没法再修正过来），symbol 变量返回 'symbol'。

```js
typeof null // => 'object'
typeof Symbol // => 'function'
typeof Symbol() // => 'symbol'
```

4. 写一个函数，判断变量是否是数组。

```js
function isArray(arr) {
    // 'isArray' in Array
    if (typeof Array.isArray === 'function') {
        // 方法一：使用 ES5 的 Array.isArray 方法
        return Array.isArray(arr);
    }

    // 方法二：使用万能的 toString() 方法，call 用来改变 toString 的 this 指向为待检测的对象
    // ECMA-262 定义了该函数的行为，返回内部对象的 `[[Class]]` 属性拼成类似 `[object Array]` 的字符串形式
    // 至于为什么不用 arr.toString() 原因有二：arr 有自己实现的 toString 方法；Object.prototype 不会被改写
    return Object.prototype.toString.call(arr) === '[object Array]';
}
```

5. 为什么不使用 instanceof 和 arr.constructor === Array 来判断？这是因为在多窗口中（frame），有着不用的执行环境，因此页有着不用的全局对象，不同的构造函数等等，因此 `[] instanceof window.frames[0].Array` 将会返回 false，另外，arr.constructor === Array 中方式中 constructor 可能被改写，也不靠谱。

```js
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

const frameLength = window.frames.length;
const iframe2 = window.frames[frameLength - 1];

const arr = [1, 2, 3];
arr instanceof iframe2.Array // => false
arr.constructor === iframe2.Array // => false
arr instanceof Array // => true
arr.constructor === Array // => true
```

6. JS 中类型转化叫做 coercion.

7. 理解函数作用域和块作用域。

8. falsy 的值：'', null, undefined, 0, -0, NaN, false

9. 比较对象类型时，== 和 === 都是只会比较引用地址

10. 字符串比较一般按照字母顺序表来比较，如果首字母为汉字，其实比较的是 unicode 码，其中汉字'一'的 unicode 码最小, '龥'的最大，另外，字符串的 localeCompare 也是比较的汉字的 unicode 码。

```js
'一'.charCodeAt(0) // => 19968
'龥'.charCodeAt(0) // => 40869
String.fromCharCode(19969) // => '丁'
String.fromCharCode(19969) // => '丂'
String.fromCharCode(19969) // => '七'

const arr = ['丁', '七', '一', '丂', '一', '丂'];
arr.sort((a, b) => {
    return b.localeCompare(a);
}); // => ["七", "丂", "丂", "丁", "一", "一"]
```

11. 写一个比较函数，可以对数字数组和字符串数组进行排序，其中字符串数组包括英文字母和中文，英文首字母中的单词排在汉字前边，其中汉字首字母开头的按照拼音排列（多音字如何处理），例如：

```
[4, 2, 3, 5, 6, 7]
['小王子', '彼得潘', 'Game Of Thrones', '一千零一夜', '伊索寓言', 'Pen', 'Faded', 'Aha']
```

https://github.com/hotoo/pinyin
http://www.cnblogs.com/warrentech/archive/2012/11/20/PinYinSort.html
https://github.com/creeperyang/blog/issues/31
http://blog.darkthread.net/post-2017-10-19-javascript-chinese-char-sorting.aspx
http://gzool.com/javascript/2017/09/29/js-hanzi-to-pinyin/

12. swicth 的比较是采用的 === 比较

13. 闭包给予了函数访问外部作用域变量的能力，即使外部函数已经执行完毕，典型应用有：模块模式/高阶函数 等

14. this 的情况：全局变量/实例对象/调用对象/call和apply绑定对象/bind对象

15. 理解 polyfilling（以及 shim） 和 transpiling

16. 下面输出顺序是什么？

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

17. 下面的输出是什么？

```js
var regex = /foo/g;
var testString = 'foo';

regex.test(testString) // => ?
regex.test(testString) // => ?
```

18. 如何实现多个继承？

```
```

19. Node 中的 childNodes 和 children 的区别（parentElement 和 parentNode 的区别）。

childNodes includes all child nodes, including non-element nodes like text and comment nodes. To get a collection of only elements, use ParentNode.children instead.

