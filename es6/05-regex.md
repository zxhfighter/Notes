# 正则表达式

## 正则表达式构建方法

```js
// 字面量正则表达式对象
const regex = /xy+z/i;

// 等价于，注意这里第一个参数为字符串形式
const regex = new RegExp('xy+z', 'i');
```

ES6 支持在 `RegExp` 构造函数中直接传入正则字面量以及标志符号。

```js
new RegExp(/xy+z/ig, 'i').flags
```

上面代码中，原有正则对象的修饰符是ig，它会被第二个参数i覆盖。

## RegExp 方法

- test

使用正则测试某个字符串是否包含某个模式，包含返回 true，否则返回 false。另外，连续对某个字符串进行测试时，需要特别注意
`lastIndex` 变量。

```ts
const regex = /xy+z/i;
regex.test('xyz') // true，此时 r.lastIndex 为 3，下一次搜索会从这里开始
regex.test('xyz') // false，为什么这里就返回 false 了呢？答案就在于 lastIndex
```

- exec

使用正则返回某个字符串匹配到的所有模式数组（没找到匹配返回 null）。

```ts
var r = /(\d{4})-(\d{2})-(\d{2})/

// ["2018-07-11", "2018", "07", "11", index: 0, input: "2018-07-11", groups: undefined]
var [all, year, month, day] = r.exec('2018-07-11')
```

看个复杂点的例子，使用 'g' 修饰符和 `lastIndex` 属性，可以查找多次。

```ts
var myRe = /ab*/g;
var str = 'abbcdefabh';
var myArray;
while ((myArray = myRe.exec(str)) !== null) {
  var msg = 'Found ' + myArray[0] + '. ';
  msg += 'Next match starts at ' + myRe.lastIndex;
  console.log(msg);
}
```

## String 方法

- match

同正则对象的 `exec` 方法，返回字符串匹配到的所有模式数组（没有匹配返回 null）。

```ts
var r = /(\d{4})-(\d{2})-(\d{2})/

// 等价于 r.exec('2018-07-11')
// ["2018-07-11", "2018", "07", "11", index: 0, input: "2018-07-11", groups: undefined]
'2018-07-11'.match(r)
```

- replace

替换匹配到的模式为另一个字符串，返回替换后的字符串。其中替换字符串可以使用 `$` 开头的一些变量来替代匹配到的模式。

```ts
str.replace(regexp|substr, newSubstr|function)
```

使用 `gi` 标志符，替换多个字符串，忽略大小写。

```ts
var re = /apples/gi;
var str = 'Apples are round, and apples are juicy.';
var newstr = str.replace(re, 'oranges');
console.log(newstr);  // oranges are round, and oranges are juicy.
```

交换字符串，其中 $1 表示第一个圆括号匹配，$2 表示第二个圆括号匹配，$& 表示整个匹配。

```ts
var re = /(\w+)\s(\w+)/;
var str = 'John Smith';
var newstr = str.replace(re, '$2, $1');
console.log(newstr);  // Smith, John
```

使用替换函数，将驼峰风格转化为中划线风格。

```ts
function styleHyphenFormat(propertyName) {
  function upperToHyphenLower(match, offset, string) {
    return (offset > 0 ? '-' : '') + match.toLowerCase();
  }
  return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
}

styleHyphenFormat('borderTop') // => border-top
```

读者可以自己实现一个将中划线风格转化为驼峰风格的例子。

再来看个将华氏温度转化为摄氏温度的例子。

```ts
function f2c(x) {
  // 第一个参数 match 匹配到的子串，对应 $&
  // p1...pn 匹配到的 1 到 n 个括号子串
  // offset 子串在整个字符串中的起始位置
  // s 整个字符串，也就是正则的 input
  function convert(str, p1, offset, s) {
    return ((p1 - 32) * 5/9) + 'C';
  }
  var s = String(x);
  var test = /(-?\d+(?:\.\d*)?)F\b/g;
  return s.replace(test, convert);
}

f2c(212F)
f2c(0F)
```

- search

在字符串中搜索指定的模式（如果传入字符串，会先转化为正则），如果找到返回第一次匹配位置，否则返回 -1。

```ts
str.search(regexp)
```

例子：

```ts
var str = "hey JudE";
var re = /[A-Z]/g;
var re2 = /[.]/g;
console.log(str.search(re)); // returns 4, which is the index of the first capital letter "J"
console.log(str.search(re2)); // returns -1 cannot find '.' dot punctuation
```

更加高级点的例子是，我们可以通过 Symbol.search 自定义对象的搜索行为。

```ts
class Product {
  constructor(type) {
    this.type = type;
  }

  [Symbol.search](str) {
    return str.indexOf(this.type) >= 0 : 'FOUND' : 'NOT FOUND';
  }
}

var soapObj = new Product('soap');
'mysoap'.search(soapObj);
'shampoo'.search(soapObj);
```

- split

按照特定的模式切割字符串，返回切割后的字符串数组。

```ts
str.split([separator[, limit]])
```

例子：

```ts
var myString = 'Hello World. How are you doing?';
var splits = myString.split(' ', 3);

console.log(splits);

myString = 'Hello 1 word. Sentence number 2.';
splits = myString.split(/(\d)/);

console.log(splits);
```

反转字符串。

```ts
var str = 'asdfghjkl';
var strReverse = str.split('').reverse().join(''); // 'lkjhgfdsa'
```

- matchAll（proposal）

ES6 将这 4 个方法，在语言内部全部调用 RegExp 的实例方法，从而做到所有与正则相关的方法，全都定义在 RegExp 对象上。

另外，字符串的这几个方法都可以通过重写对象的 Symbol 变量来获得自定义行为。

## u 修饰符

ES6 对正则表达式添加了u修饰符，含义为 "Unicode 模式"，用来正确处理大于 `\uFFFF` 的 Unicode 字符。也就是说，会正
确处理四个字节的 UTF-16 编码。

```js
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^\uD83D/.test('\uD83D\uDC2A') // true

/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true

/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

## y 修饰符

除了 u 修饰符，ES6 还为正则表达式添加了 y 修饰符，叫做“粘连”（sticky）修饰符。

y 修饰符的作用与 g 修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g 修饰符只要
剩余位置中存在匹配就可，而 y 修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。

```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null
```

y 修饰符的一个应用，是从字符串提取 token（词元），y 修饰符确保了匹配之间不会有漏掉的字符。

```js
const TOKEN_Y = /\s*(\+|[0-9]+)\s*/y;
const TOKEN_G  = /\s*(\+|[0-9]+)\s*/g;

tokenize(TOKEN_Y, '3 + 4')
// [ '3', '+', '4' ]
tokenize(TOKEN_G, '3 + 4')
// [ '3', '+', '4' ]

tokenize(TOKEN_Y, '3x + 4')
// [ '3' ]
tokenize(TOKEN_G, '3x + 4')
// [ '3', '+', '4' ]

function tokenize(TOKEN_REGEX, str) {
  let result = [];
  let match;
  while (match = TOKEN_REGEX.exec(str)) {
    result.push(match[1]);
  }
  return result;
}
```

## 断言

”先行断言“指的是，x 只有在 y 前面才匹配，必须写成 `/x(?=y)/`。比如，只匹配百分号之前的数字，要写成 `/\d+(?=%)/`。

”先行否定断言“指的是，x 只有不在 y 前面才匹配，必须写成 `/x(?!y)/`。比如，只匹配不在百分号之前的数字，要写成
 `/\d+(?!%)/`。

```js
/\d+(?=%)/.exec('100% of US presidents have been male')  // ["100"]
/\d+(?!%)/.exec('that’s all 44 of them')                 // ["44"]
```

“后行断言”正好与“先行断言”相反，x 只有在 y 后面才匹配，必须写成 `/(?<=y)x/`。比如，只匹配美元符号之后的数字，要写成
 `/(?<=\$)\d+/`。

”后行否定断言“则与”先行否定断言“相反，x 只有不在 y 后面才匹配，必须写成 `/(?<!y)x/`。比如，只匹配不在美元符号后面的
数字，要写成 `/(?<!\$)\d+/`。

```js
/(?<=\$)\d+/.exec('Benjamin Franklin is on the $100 bill')  // ["100"]
/(?<!\$)\d+/.exec('it’s is worth about €90')                // ["90"]
```

## 具名组匹配

正则表达式使用圆括号进行组匹配。

```js
const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj[1]; // 1999
const month = matchObj[2]; // 12
const day = matchObj[3]; // 31
```

组匹配的一个问题是，每一组的匹配含义不容易看出来，而且只能用数字序号（比如 matchObj[1] ）引用，要是组的顺序变了，引用
的时候就必须修改序号。

ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用。

```js
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31
```

有了具名组匹配以后，可以使用解构赋值直接从匹配结果上为变量赋值。

```js
let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
```

字符串替换时，使用 `$<组名>` 引用具名组（以前是通过位置索引，例如 $1, $2 之类的）。

```js
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;

'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015'
```

## matchAll

目前有一个提案，增加了String.prototype.matchAll方法，可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator）
，而不是数组。

```js
const string = 'test1test2test3';

// g 修饰符加不加都可以
const regex = /t(e)(st(\d?))/g;

for (const match of string.matchAll(regex)) {
  console.log(match);
}
// ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"]
// ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"]
// ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]
```

原来的代码需要用 while 循环。

```js
var regex = /t(e)(st(\d?))/g;
var string = 'test1test2test3';

var matches = [];
var match;
while (match = regex.exec(string)) {
  matches.push(match);
}

matches
// [
//   ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"],
//   ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"],
//   ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]
// ]
```

上面代码中，由于 string.matchAll(regex) 返回的是遍历器，所以可以用 for...of 循环取出。相对于返回数组，返回遍历器
的好处在于，如果匹配结果是一个很大的数组，那么遍历器比较节省资源。

## 特殊字符

### \

如果 `\` 后边跟着一个普通字符，则说明下一个字符有特别的用途，例如 `\b` 不匹配任何字符，它是特殊的文字边界字符（word
boundary character）。

如果 `\` 后边跟着一个特殊字符，则说明下一个字符是普通的字符串，应该当做文本来解释，例如 `\*` 中的 '*' 失去了转义能力
，可以用来匹配 `a*` 之类的字符串。

如果在 `RegExp("pattern")` 中使用，还需要转义 `\` 自身，因为字符串中 `\` 也是一个转义符号。

```js
var regex = new RegExp('a\\*');
regex.test('a\*');
```

### ^

### $

### *

### +

### ?

### .

### (x)

### (?:x)
