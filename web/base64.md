# Base64

Base64 是一种用 64 个（可打印）字符来表示任意二进制数据的方法。

由于只有 64 个字符，因此单个字节只需要 6 位有效位即可（2 的 6 次方为 64）。

因此 Base64 会把 3 字节的二进制数据编码为 4 字节的文本数据（前2位补0），长度增加了 1/3。

![base64](https://cdn.liaoxuefeng.com/cdn/files/attachments/001399415038305edba53df7d784a7fa76c6b7f6526873b000)

如果要编码的二进制数据不是 3 的倍数，最后剩下 1 个或者 2 个字节怎么办？Base64 用 `\x00` 字节在末尾补足后，再在编码的末尾加上1个或2个=号，表示补了多少字节，解码的时候，会自动去掉。

## 浏览器 API

- `btoa()`: 将一个字符串或者二进制数据编码成 Base64
- `atob()`: 解码 Base64 字符串

```ts
var str = 'http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding';
var encodedStr = btoa(str); // => aHR0cDovL2RldmRvY3MuaW8vZG9tL3dpbmRvd2Jhc2U2NC9iYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5n
var decodedStr = atob(encodedStr); // => http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding

var arr = new Uint8Array([96, 97, 98]);
var enc = btoa(arr); // => OTYsOTcsOTg=
var dec = atob(enc); // => 96,97,98
```

需要注意的是待编码字符有范围限制，只能位于 0X00 至 0XFF之间，否则会报 InvalidCharacterError。

```ts
// Uncaught DOMException: Failed to execute 'btoa' on 'Window':
// The string to be encoded contains characters outside of the Latin1 range.
var str = 'hello, 中国';
btoa(str)
```

## Node API

使用 `Buffer` 的 `toString(encoding)` 编码， `from(str, encoding)` 解码。

```ts
const buffer = Buffer.from('http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding');

// encode
const base64Str = buffer.toString('base64');

// decode
const originBuffer = Buffer.from(base64Str, 'base64');

// aHR0cDovL2RldmRvY3MuaW8vZG9tL3dpbmRvd2Jhc2U2NC9iYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5n
console.log(base64Str);

// http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding
console.log(originBuffer.toString('utf8'));
```

webpack 的 `url-loader` 其实就是调用了上述方法对小于特定体积的二进制文件进行了 Base64 编码（例如图片、字体）等等。

## Data URLs

Data URL 允许将一些二进制文件内容内联到文档中，这也是通过 Base64 来完成的，其格式为：

```
data: [<mediatype>][;base64],<data>
```

第一部分为固定的 `data:` 标识。

第二部分为文件 MIME 类型，例如 `image/jpeg` 或者 `text/plain;charset=US-ASCII`(默认)。

第三部分表示是否为二进制，则有 base64 标识，为文本，则不会有该标识。

第四部分为编码后的实际数据。

## Linux 或 Mac 自带工具

使用 `uuencode` 和 `uudecode`。

```
NAME
     uudecode, uuencode -- encode/decode a binary file

SYNOPSIS
     uuencode [-m] [-o output_file] [file] name
     uudecode [-cips] [file ...]
     uudecode [-i] -o output_file [file]

DESCRIPTION
     The uuencode and uudecode utilities are used to transmit binary files
     over transmission mediums that do not support other than simple ASCII
     data.
```

## Python 中API

```py
import base64
base64.b64encode('binary\x00string')
base64.b64decode('YmluYXJ5AHN0cmluZw==')
```

## 参考资料

- https://zh.wikipedia.org/wiki/Base64
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
- http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding
