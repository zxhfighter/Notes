# 对象扩展

ES2015 对对象进行了扩展。

## 属性简写

```ts
const foo = 'bar';
const obj = { foo };
```

## 方法简写

```ts
const obj = {
    say(word) {
        console.log(word);
    }

    _wheels: 4,

    get wheels() {
        return this._wheels;
    },

    set wheels(value) {
        if (value < this._wheels) {
            throw new Error('数值太小了！');
        }
        this._wheels = value;
    }

    *genNumbers() {
        yield* [1, 2, 3, 4];
    }
};
```

## 属性名表达式

定义字面量对象时，属性可以采用 `[]` 形式进行动态计算。

```ts
const propKey = 'foo';
const obj = {
    [propKey]: true,
    ['a' + 'bc']: 123,
    ['h' + 'ello']() {
        return 'world';
    },
    [Symbol.iterator]() {
        return this;
    }
    next() {

    }
};
```

## Object.is()

与严格比较运算符行为基本一致，除了：

- +0 不等于 -0
- NaN 等于自身

```ts
Object.is('foo', 'foo') // => true
Object.is({}, {}) // => false

+0 === -0 // => true
NaN === NaN // => false

Object.is(+0, -0) // => false
Object.is(NaN, NaN) // => true
```

## Object.assign()

用于对象合并，将源对象所有可以枚举的属性，复制到目标对象。

(1) 浅拷贝

```ts
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // => 2
```

(2) 覆盖原有对象

```ts
Object.assign(target, src1, src2, src3);
```

(3) 合并对象生成新对象

```ts
Object.assign({}, src1, src2, src3);
```

(4) 与扩展运算符 `...` 比较

对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

```ts
let z = { a: 3, b: 4 };
let n = { ...z };

// 等同于

let z = { a: 3, b: 4 };
let n = Object.assign({}, z);
```

## Object.keys(), Object.values(), Object.entries()

`Object.keys()` 返回对象自身的所有可遍历的属性的键名数组。

```ts
var obj = { foo: 'bar', baz: 42 };
Object.keys(obj)
```

`Object.values()` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。

```ts
const obj = { foo: 'bar', baz: 42 };
Object.values(obj)
```

`Object.entries()` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

```ts
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
```
