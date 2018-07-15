# 字符串的扩展

## 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串
，或者在字符串中嵌入变量。

```js
`${expression}`
```

## 新增方法

### includes

判断字符串是否包含某个子串，以前可以使用 `indexOf()` 是否等于 -1 来判断是否包含。

```
str.includes(searchString[, position])
```

例子：

```ts
// 以前使用 'abcde'.indexOf('cd') !== -1
'abcde'.includes('cd') // => true，
'abcde'.includes('cd', 3) // => false
```

### startsWith

判断字符串是否以某个子串开头，以前可以使用 `indexOf()` 是否等于 0 来判断。

```
str.startsWith(searchString[, position])
```

例子：

```ts
'abcde'.startsWith('abc') // => true，
'abcde'.startsWith('cde', 2) // => true
'abcde'.startsWith('cde', 3) // => false
```

### endsWith

判断字符串是否以某个子串结尾，以前可以使用 `indexOf()` 以及字符串的相关长度计算得出。

```
str.endsWith(searchString)
```

例子：

```ts
'abcde'.endsWith('de') // true
'.jpg'.endsWith(fileName)

// 自己实现的算法
function endsWith(str, substr) {
  if (substr.length > str.length) {
    return false;
  }
  return (str.length - substr.length) === str.indexOf(substr);
}
```

### repeat

字符串重复 N 遍，可以用来快速生成数据，等价于 `Array(N).fill(str).join('')` 用法。

```ts
str.repeat(N)
```

例子：

```ts
'AB'.repeat(10)
Array(10).fill('AB').join('')
```

### padStart

在字符串开始位置填充特定数量的填充字符串（如有需要，会重复，超出会截断），以便达到指定的字符串目标长度。

```
str.padStart(targetLength [, padString])
```

例子：

```ts
'abcd'.padStart(10, '012') // => 012012abcd
'abcd'.padStart(9, '012') // => 01201abcd
'abcd'.padStart(3, '012') // => abcd
```

### padEnd

在字符串结束位置填充特定数量的填充字符串（如有需要，会重复，超出会截断），以便达到指定的字符串目标长度。

```
str.padEnd(targetLength [, padString])
```

例子：

```ts
'abcd'.padEnd(10, '012') // => abcd012012
'abcd'.padEnd(9, '012') // => abcd01201
'abcd'.padEnd(3, '012') // => abcd
```

## 增强 Unicode 表示法

JavaScript 允许采用 `\uxxxx` 形式表示一个字符，其中 `xxxx` 表示字符的 Unicode 码点。

但是，这种表示法只限于码点在 `\u0000~\uFFFF` 之间的字符。超出这个范围的字符，必须用两个双字节的形式表示。

```js
"\uD842\uDFB7"
// "𠮷"

"\u20BB7"
// " 7"
```

上面代码表示，如果直接在 `\u` 后面跟上超过 `0xFFFF` 的数值（比如 `\u20BB7`），JavaScript 会理解成 `\u20BB+7`。
由于 `\u20BB` 是一个不可打印字符，所以只会显示一个空格，后面跟着一个7。

ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。

```js
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123


'\u{1F680}' === '\uD83D\uDE80'
// 🚀 === 🚀, true
```

上面代码中，最后一个例子表明，大括号表示法与四字节的 UTF-16 编码是等价的。

有了这种表示法之后，JavaScript 共有 6 种方法可以表示一个字符。

```js
'\z' === 'z'  // true（转义字符，没有转义返回字符本身，'\n' 则返回换行，'\t' 则返回 tab 缩进）
'\172' === 'z' // true（八进制字符，数字的八进制字符表示如下 0o172）
'\x7A' === 'z' // true（单字节编码字符，范围 0~255）
'\u007A' === 'z' // true（双字节编码字符，范围 0~65535）
'\u{7A}' === 'z' // true（字符的 Unicode 大括号表示法，可以表达超过双字节的字符了，另外可以省略前边的 00 了）
```

## codePointAt()

作用：**返回字符的正确码点的十进制，可以处理四字节存储的字符**

JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于
 `0xFFFF` 的字符），JavaScript 会认为它们是两个字符。

```js
var s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是 `0x20BB7`，UTF-16 编码为`0xD842 0xDFB7`（十进制为
`55362 57271`），需要 4 个字节储存。对于这种 4 个字节的字符，JavaScript 不能正确处理，字符串长度会误判为 2，而且
 charAt 方法无法读取整个字符，charCodeAt 方法只能分别返回前两个字节和后两个字节的值。

**ES6 提供了 `codePointAt` 方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点**。

```js
let s = '𠮷a';

s.codePointAt(0) // 134071
s.codePointAt(1) // 57271

s.codePointAt(2) // 97
```

总之，`codePointAt` 方法会正确返回 32 位的 UTF-16 字符的码点。对于那些两个字节储存的常规字符，它的返回结果与
`charCodeAt` 方法相同。

**`codePointAt` 方法返回的是码点的十进制值**，如果想要十六进制的值，可以使用 `toString(16)` 方法转换一下。

```js
let s = '𠮷a';

s.codePointAt(0).toString(16) // "20bb7"
s.codePointAt(2).toString(16) // "61"
```

你可能注意到了，`codePointAt` 方法的参数，仍然是不正确的。比如，上面代码中，字符a在字符串s的正确位置序号应该是 1，
但是必须向 `codePointAt` 方法传入 2。解决这个问题的一个办法是使用 `for...of` 循环，因为它会正确识别 32 位的
UTF-16 字符。

```js
let s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61
```

`codePointAt()` 方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

```js
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷") // true
is32Bit("a") // false
```

## String.fromCodePoint()

作用：**根据码点返回字符，可以返回大于 0xFFFF 的字符**


ES6 提供了 `String.fromCodePoint` 方法，可以识别大于 `0xFFFF` 的字符，弥补了`String.fromCharCode` 方法的不足。
在作用上，正好与 `codePointAt` 方法相反。

```js
String.fromCharCode(0x20BB7)
// "ஷ"

String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```

注意，`fromCodePoint` 方法定义在 `String` 对象上，而 `codePointAt` 方法定义在字符串的实例对象上。

## 字符串遍历

ES6 为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被 `for...of` 循环遍历。

```js
for (let codePoint of 'foo') {
  console.log(codePoint)
}
// "f"
// "o"
// "o"
```

除了遍历字符串，**这个遍历器最大的优点是可以识别大于 `0xFFFF` 的码点**，传统的 `for` 循环无法识别这样的码点。

```js
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

## at()

目前，有一个提案，提出字符串实例的 `at` 方法，可以识别 Unicode 编号大于 `0xFFFF` 的字符，返回正确的字符。

```js
'abc'.charAt(0) // "a"
'𠮷'.charAt(0) // "\uD842"，显示乱码 �

'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"
```

## matchAll()

matchAll 方法返回一个正则表达式在当前字符串的所有匹配，详见《正则的扩展》的一章。

## Unicode 正规化

ES6 提供字符串实例的 `normalize()` 方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

```js
'\u01D1'==='\u004F\u030C' // 这两个是同一个字符，但是返回 false

'\u01D1'.normalize() === '\u004F\u030C'.normalize() // 正规化后，返回 true
```

## 标签模板

模板字符串可以跟在函数（标签）后边，形成标签模板。

```js
const [a, b] = [5, 10];
console.log`Hello ${a + b} world ${ a * b }`

// 等价于调用，其中第一个参数数组还有一个 raw 属性，raw 里边会将 \n 变成 \\n
console.log(['Hello ', ' world ', ''], 15, 50)
```

“标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。

```js
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
```

"标签模板" 的另一个应用，就是多语言转换（国际化处理）。

```js
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`
```

模板字符串本身并不能取代 Mustache 之类的模板库，因为没有条件判断和循环处理功能，但是通过标签函数，可以自己添加这些功能。

```js
// 下面的hashTemplate函数
// 是一个自定义的模板处理函数
let libraryHtml = hashTemplate`
  <ul>
    #for book in ${myBooks}
      <li><i>#{book.title}</i> by #{book.author}</li>
    #end
  </ul>
`;
```

除此之外，你甚至可以使用标签模板，在 JavaScript 语言之中嵌入其他语言。

```js
jsx`
  <div>
    <input
      ref='input'
      onChange='${this.handleChange}'
      defaultValue='${this.state.value}' />
      ${this.state.value}
   </div>`
```
