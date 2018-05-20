# regexp

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
- exec

## String 方法

- match
- replace
- search
- split
- matchAll（proposal）

ES6 将这 4 个方法，在语言内部全部调用 RegExp 的实例方法，从而做到所有与正则相关的方法，全都定义在 RegExp 对象上。

## u 修饰符

ES6 对正则表达式添加了u修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。

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

y 修饰符的作用与 g 修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g 修饰符只要剩余位置中存在匹配就可，而 y 修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。

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

”先行否定断言“指的是，x 只有不在 y 前面才匹配，必须写成 `/x(?!y)/`。比如，只匹配不在百分号之前的数字，要写成 `/\d+(?!%)/`。

```js
/\d+(?=%)/.exec('100% of US presidents have been male')  // ["100"]
/\d+(?!%)/.exec('that’s all 44 of them')                 // ["44"]
```

“后行断言”正好与“先行断言”相反，x 只有在 y 后面才匹配，必须写成 `/(?<=y)x/`。比如，只匹配美元符号之后的数字，要写成 `/(?<=\$)\d+/`。

”后行否定断言“则与”先行否定断言“相反，x 只有不在 y 后面才匹配，必须写成 `/(?<!y)x/`。比如，只匹配不在美元符号后面的数字，要写成 `/(?<!\$)\d+/`。

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

组匹配的一个问题是，每一组的匹配含义不容易看出来，而且只能用数字序号（比如 matchObj[1] ）引用，要是组的顺序变了，引用的时候就必须修改序号。

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

字符串替换时，使用 `$<组名>` 引用具名组。

```js
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;

'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015'
```

## matchAll

目前有一个提案，增加了String.prototype.matchAll方法，可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator），而不是数组。

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

上面代码中，由于 string.matchAll(regex) 返回的是遍历器，所以可以用 for...of 循环取出。相对于返回数组，返回遍历器的好处在于，如果匹配结果是一个很大的数组，那么遍历器比较节省资源。

## 特殊字符

### \

如果 `\` 后边跟着一个普通字符，则说明下一个字符有特别的用途，例如 `\b` 不匹配任何字符，它是特殊的文字边界字符（word boundary character）。

如果 `\` 后边跟着一个特殊字符，则说明下一个字符是普通的字符串，应该当做文本来解释，例如 `\*` 中的 '*' 失去了转义能力，可以用来匹配 `a*` 之类的字符串。

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

