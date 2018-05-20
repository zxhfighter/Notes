# Buffer in Node

## Buffer，TypedArray、ArrayBuffer 三者关系

JavaScript 在 ES6 之前并没有操作二进制数据流相关机制，后来由于 WebSockets，Canvas，WebGL 等技术的出现，在 ES6 中引入了 `ArrayBuffer` 对象和 `TypedArray` 视图。

此时，在 Node 中已经自己实现了一个 `Buffer` 类用来处理二进制数据流，例如 TCP 流和文件流。

`Buffer` 类实现了 `TypedArray` 视图中的 `Uint8Array` API，不过针对 Node 环境额外进行了优化。

## Buffer 类

Buffer 为一个全局对象，Buffer 类的实例可以看做创建以后无法改变大小的整数数组。

### 创建一个 Buffer 实例

可以使用 `Buffer.from()`、`Buffer.alloc()`、`Buffer.allocUnsafe()` 来创建。

- `Buffer.from(array)`：包含提供的二进制数组数据，如果数字大于 255，会取余
- `Buffer.from(arrayBuffer[, byteOffset [, length]])`：返回和 arrayBuffer 共享内存的 Buffer
- `Buffer.from(buffer)`：返回原有 buffer 内容拷贝的新 Buffer
- `Buffer.from(string[, encoding])`：返回包含字符串内容的 Buffer
- `Buffer.alloc(size[, fill[, encoding]])`：返回指定大小的 Buffer
- `Buffer.allocUnsafe(size)`：返回指定大小的 Buffer（不保证字节内容，效率较高）

PS：在 Node V6 之前，使用 Buffer 的构造函数来创建实例，由于参数形式多样，且需要手动初始化，比较繁琐，因此迁移到了上述三个方法。

```js
// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10, filled with 0x1.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using either fill() or write().
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing [0x1, 0x2, 0x3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74].
const buf5 = Buffer.from('tést');

// Creates a Buffer containing Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf6 = Buffer.from('tést', 'latin1');
```

### Buffer 转字符串

Buffer 字节数组是一种底层结构，通过编码后可以转化为字符串。

可以使用 `buffer.toString()` 来转化为对应编码的字符串。

```js
const buf = '我喜欢 Node.js';
console.log(buf.toString('hex'))
console.log(buf.toString('base64'))
console.log(buf.toString('utf8'))
console.log(buf.toString('ascii'))
```

另外一种方式是使用 `StringDecoder` 辅助类，帮助将 buffer 值转化为 UTF-8 字符串，相比 `toString()` 方法更加灵活。

```js
let StringDecoder = require('string_decoder').StringDecoder;
let decoder = new StringDecoder('utf8');
let euro = new Buffer([0xE2, 0x82]);
let euro2 = new Buffer([0xAC]);
console.log(decoder.write(euro));
console.log(decoder.write(euro2));
console.log(euro.toString()); // 乱码
console.log(euro2.toString()); // 乱码
```

### Buffer 之间的比较

- Buffer.compare

```js
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');

Buffer.compare(buf1, buf2)
buf1.compare(buf2)

const arr = [buf1, buf2];
console.log(arr.sort(Buffer.compare));
```

- Buffer.equals

```js
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

// Prints: true
console.log(buf1.equals(buf2));

// Prints: false
console.log(buf1.equals(buf3));
```

## 再论 ArrayBuffer 和 Buffer 的差异

一个差异是，Buffer 的 `slice` 方法直接引用已有的内存块，而不是返回一个新的内存块，因此更加有效率（同时也会修改原有的 Buffer 对象）。

另外，将 Buffer 转化为 TypedArray 时，将会将 Buffer 解析成不同的数组元素。

```js
// 不是只包含一个元素 [0x1020304] or [0x4030201] 的 Uint32Array
// 而是包含四个元素的 Uint32Array
new Uint32Array(Buffer.from([1, 2, 3, 4]))
```

另外，如果使用 `Buffer.from()` 方法创建时，使用的是 TypedArray 的 `.buffer` 对象，则会创建一个共享内存。

```js
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`
const buf1 = Buffer.from(arr);

// Shares memory with `arr`
const buf2 = Buffer.from(arr.buffer);

// Prints: <Buffer 88 a0>
console.log(buf1);

// Prints: <Buffer 88 13 a0 0f>
console.log(buf2);

arr[1] = 6000;

// Prints: <Buffer 88 a0>
console.log(buf1);

// Prints: <Buffer 88 13 70 17>
console.log(buf2);
```

## for...of

`for...of` 可以循环 Buffer 对象。

```js
const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
```

