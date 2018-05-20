# 修饰器

## 一个简单的例子

许多面向对象的语言都有**修饰器（Decorator）**函数，用来修改类的行为。

例如下面的例子就定义了一个修饰器 `testable`，用来标注类是否可以测试。

```js
@testable
class A {}

function testable(target) {
    target.isTestable = true;
}
```

## 修饰类的实例

上边的例子，是给类添加了静态属性，如果要添加实例属性，也很简单，修改 `target.prototype` 即可。

```js
@testable
class A {}

function testable(target) {
    target.prototype.isTestable = true;
}
```

## 修饰器传递参数

上边的例子是不使用装饰器时，isTestable 默认为 undefined，使用装饰器时，isTestable 为 true，我们希望 isTestable 的值通过修饰器参数传入。

可以通过闭包来实现，装饰器函数运行后返回装饰器即可。

```js
function testable(isTestable) {
    return target => {
        target.prototype.isTestable = isTestable;
    }
}
```

## 多个修饰器

看个具体的例子：

```ts
// demo01.ts
function tag(tagId) {
    console.log(`outer: ${tagId}`);
    return function(target) {
        console.log(`inner: ${tagId}`);
        target.tagId = tagId;
    };
}

@tag(3)
@tag(2)
@tag(1)
class X {}
```

运行后（这里采用 tsc 编译后运行，因为 tsc 默认支持修饰器）：

```shell
$ tsc demo01.ts --target ES5 --experimentalDecorators && node demo01.js

outer: 3
outer: 2
outer: 1
inner: 1
inner: 2
inner: 3
```

可以看出多个修饰器存在时，运行顺序是**从外到内，再从内到外**。

## 抽象

一般来说，修饰器行为如下：

```js
@A
@B
@C
class X {}
```

等价于：

```js
class X {}
X = A(B(C(X))) || X;
```

也就是说，**修饰器从最外层的修饰器函数开始计算进入，最后从由内往外依次返回**。

## 修饰类

上文的例子都是用于修饰类，修饰器函数运行后，需要返回一个函数，接口如下：

```ts
interface classDecoratorFunc {
    (target: targetClass): any;
}
```

## 修饰方法

修饰器不仅可以修饰类，还可以修饰方法，接口如下：

```ts
interface methodDecoratorFunc {
    (
        target: targetClass,     // 类的原型对象
        methodName: string,      // 要修饰的属性名
        descriptor: Descriptor   // 属性描述符
    ) : Descriptor;
}

// 属性描述符
interface Descriptor {
    value: any;
    writable: boolean;
    configurable: boolean;
    enumerable: boolean;
    get(): any;
    set(): any;
}
```

修饰器会修改属性的描述对象（Descriptor），然后被修改的描述对象再用来定义属性。

```js
function log() {
    return function(target: any, name: any, descriptor: any) {
        const oldValue = descriptor.value;
        descriptor.value = function () {
            console.log(`Calling ${name} with`, arguments);
            return oldValue.apply(null, arguments);
        };
        return descriptor;
    }
}

class BaseMath {
    @log()
    add(a, b) {
        return a + b;
    }
}

const math = new BaseMath();
math.add(2, 4);
```

## 修饰访问器函数

## 修饰属性

## 修饰函数参数

## 为什么无法修饰函数

因为**函数存在变量提升，而类不存在变量提升**。

```js
var counter = 0;

var add = function () {
  counter++;
};

@add
function foo() {
}
```

上边代码意图 `add` 修饰器执行后，counter 等于 1，实际结果为 0。

另外，如果一定要修饰函数，可以采用**高阶函数（也即返回函数的函数）**的形式直接执行。

```js
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
    return function() {
        console.log('Starting');
        const result = wrapped.apply(this, arguments);
        console.log('Finished');
    };
}

const wrapped = loggingDecorator(doSomething);
```
