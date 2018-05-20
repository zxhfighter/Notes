# JSON

[TOC]

## 什么是 JSON

JSON（JavaScript Object Notation）是一个轻量的数据交换格式。

JSON 对于人来说，易于读写。对于机器来说，易于解析和生成。

JSON 是独立于平台和语言的，很多语言都原生支持 JSON。

## JSON 构成

JSON 由两个基本结构构成：

- 无序的键值对集合
- 有序的数组列表

### 对象（object）

![object](http://www.json.org/object.gif)

### 数组（array）

![array](http://www.json.org/array.gif)

### 值（value）

![value](http://www.json.org/value.gif)

### 字符串（string）

![string](http://www.json.org/string.gif)

### 数字（number）

![number](http://www.json.org/number.gif)

## JSON API

ES5 提供了 `JSON` 对象，提供了 `parse` 和 `stringify` 方法。

### stringify

使用 `stringify(object)` 将对象字符串序列化，可以使用该方法实现一个简单的对象深度拷贝，不过需要注意对象序列化的规则。

- 如果值有 `toJSON` 方法，直接调用该方法
- `Boolean`, `Number` 和 `String` 对象转化成原始值
- 如果发现 `undefined`，`Function` 或者 `Symbol`，如果是在对象中，直接抛弃掉; 如果是在数组中，转化为 null; 如果直接转化函数和 `undefined`，返回 `undefined`
- 所有拿 Symbol 对象做 key 的属性全部忽略
- Date 对象返回字符串（同 `date.toISOString()`）
- 数字 `Infinity` 和 `NaN` 转化为 null
- 所有其他对象，只有可以枚举的属性能被序列化

```ts
function CustomObj() {}
CustomObj.prototype.toString = function() {
    return 'this is a custom object';
};

var obj = {
    today: new Date(),
    say() { console.log(this.today) },
    regex: /^hello*/,
    name: 'hello, 中国',
    custom: new CustomObj(),
    isNew: true,
    address: undefined,
    phone: null
}

// {"today":"2018-05-20T03:04:39.890Z","regex":{},"name":"hello, 中国","custom":{},"isNew":true,"phone":null}
JSON.stringify(obj)
```

另外，`stringify` 还支持传入一些额外参数，格式为 `JSON.stringify(value[, replacer[, space]])`。

第二个参数 `replacer` 可以用来选择需要添加到 JSON 字符串的白名单，例如如下方法就是过滤掉了值为字符串的属性。

```ts
function replacer(key, value) {
  // Filtering out properties
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

var foo = {foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7};
JSON.stringify(foo, replacer); // '{"week":45,"month":7}'
```

第三个参数 `space` 用来表示格式化 JSON 的缩进字符。

```ts
// "{
//   "today": "2018-05-20T03:04:39.890Z",
//   "regex": {},
//   "name": "hello, 中国",
//   "custom": {},
//   "isNew": true,
//   "phone": null
// }"
JSON.stringify(obj, null, 2);
```

另外，使用 `stringify` 遇到循环引用时，会抛出 `TypeError` 异常。

```ts
const circularReference = {};
circularReference.myself = circularReference;

// Serializing circular references throws "TypeError: cyclic object value"
JSON.stringify(circularReference);
```

### parse

使用 `parse(string)` 来将字符串反序列化为对象。

```ts
JSON.parse(text[, reviver])
```

```ts
var json = '{"result":true, "count":42}';
obj = JSON.parse(json);
```

其中第二个参数为返回对象前做的一些转化。

```ts
JSON.parse('{"p": 5}', (key, value) =>
  typeof value === 'number'
    ? value * 2 // return value * 2 for numbers
    : value     // return everything else unchanged
);
```

如果无法解析字符串为对象，会抛出 ` SyntaxError` 异常，因此使用该方法时需要捕获异常。

```ts
try {
    JSON.parse('{"a"}');
}
catch (e) {
    // SyntaxError: Unexpected token } in JSON at position 4
    console.log(e);
}
```

## 参考资料

- http://www.json.org/
- http://devdocs.io/javascript/global_objects/json/stringify
- http://devdocs.io/javascript/global_objects/json/parse
