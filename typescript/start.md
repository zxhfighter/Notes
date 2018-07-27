# TypeScript 精髓

文件后缀名为 `.ts` 或者 `.tsx`。

使用 npm 安装 `typescript`，自带一个 `tsc` 命令，另外可以用 node 使用 `typescript` 相关 API。

如果编译出错，同时没有设置 noEmitOrError，那么也会编译成功，会给出一个警告。

如果在类的构造函数中使用 public 或者 private 限定符，那么会创建一个对应的实例变量（Parameter properties are declared by prefixing a constructor parameter with an accessibility modifier or readonly, or both. Using private for a parameter property declares and initializes a private member; likewise, the same is done for public, protected, and readonly.）。


如果一个模块默认返回函数，可以这样写：

```ts
function foo() {
    // ...
}
export = foo;
```

或者：

```ts
function foo() {
    // ...
}
module.exports = foo;
```

或者：

```ts
export default foo() {

}
```

## 基本类型

- 基本类型：boolean / number / string / any / enum / void / null / undefined / never / object
- 数组类型：T[] / Array<T>（第一种更简洁）
- 只读数组类型：ReadonlyArray<T>（该类型数组，移除了所有修改数组本身的方法）
- 元组类型：[T1, T2]（tuple，一般和数组解构一起用）
- 联合类型：T1 | T2（也就是说，该对象类型要么为 T1，要么为 T2）
- 复合类型：T1 & T2（也就是说，该该对象类型 T1 和 T2 的属性都有）

## 类型断言（assertions）

注意，类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的。

- (<string>name).toLowerCase()
- (name as string).toLowerCase()

## 类型推断(inference)

- 一般的类型不需要写，ts 能自动进行推断
- 如果是库代码，需要生成文档的，那么建议手动加上显示类型声明

## 关于 strictNullChecks

默认情况下，null 和 undefined 为其他类型的子类型，如果 strictNullChecks 设置为 true，那么需要额外设置 null 和 undefined 类型。

- string | undefined | null

## 定义接口

- 接口定义后边用**分号**分隔
- 可选属性后边添加**?**
- 只读属性使用 _readonly_ 定义

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

- 索引对象，所有属性必须返回同类型的值，因为 obj.prop 也可以写成 obj['prop']

```ts
interface NumberDictionary {
    [index: string]: number;
    length: number; // ok, length is a number
    name: string; // error, the type of 'name' is not a subtype of the indexer
}
```

- 额外属性可以使用 `[key: string]: any` 来避免对象添加多余属性时报错

```ts
interface Point {

    // 只读属性，只有创建的时候能被修改，也就是说，只能初始化一次
    readonly x: number;
    readonly y: number;

    // 普通属性
    radius: number;

    // 可选属性
    color?: string;

    // new (...args: any[]);

    // 方法定义
    toString(): string;

    // 除了上述属性和方法外，还允许任意其他的属性
    [key: string]: any;
}

class P1 implements Point {
    x = 10;
    y = 12;
    radius = 13;
    color = 'red';

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + this.y + '';
    }
}
```

需要注意的是，一个类有两种类型：一种是静态端（例如类的构造函数，static 方法），一种是实例端（对象实例化以后的，例如属性和方法），如果在接口中定义了构造函数签名（例如上面注释掉的 `new (...args: any[]);`），在类中实现时会报错。

这是因为当一个类实现一个接口时，只检测类的实例端，因为构造函数位于静态端，因此会报错。

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

// 报错
class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

再看一个例子：

```ts
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

## 定义扩展接口

- 扩展接口可以使用 `extends`
- 另外接口也可以 `extends` 类，会抽取类的接口，而不是实现

```js
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 定义函数

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

## 定义类

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

## 定义混合类型

有时候一个函数，也有自己的方法和属性，比较适合适配第三方 API。

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## 类

- 关键词：class / extends / constructor / super / new / readonly / get / set / static / abstract
- 访问限定符：TS 中类的每个成员默认都是 public 的，还有 private 和 protected
- 如果两个类中有 private/protected 成员，即使两者结构一致，也会当做不同类型，类型不兼容

## 参考资料

- https://legacy.gitbook.com/book/zhongsp/typescript-handbook/details
- http://www.typescriptlang.org/docs/home.html
