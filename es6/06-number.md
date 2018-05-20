# 数值扩展

## 二进制和八进制表示

二进制使用 `0b` 前缀。八进制使用 `0o` 前缀（严格模式中，不允许直接使用 0 前缀了）。

```js
0b111110111 === 503 // true
0o767 === 503 // true
```

将二进制和八进制转化为十进制可以使用 `Number` 方法以及 `toString` 方法。

```js
Number(0b111110111)
Number('0b111110111')
+(0b111110111.toString(10))
```

## isNaN 和 isFinite

原来全局对象的 `isNaN` 和 `isFinite` 移到了 `Number` 对象上，实现也略有差异。

```JS
Number.isFinite(0.8); // true
Number.isFinite(Infinity); // false

Number.isNaN(NaN) // true
Number.isNaN(9/NaN) // true
Number.isNaN('15') // false
```

## parseInt 和 parseFloat

ES6 将全局方法 parseInt() 和 parseFloat()，移植到 Number 对象上面，行为完全保持不变。

这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。

## 指数运算符

ES2016 新增了一个指数运算符（**）。

```js
2 ** 2 // 4
2 ** 3 // 8

let b = 4;
b **= 3;
```

## Math 方法

ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。

