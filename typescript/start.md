# TypeScript 精髓

## 基本类型

- 基本类型：boolean / number / string / any / enum / void / null / undefined / never / tuple
- 数组类型：T[] / Array<T>（第一种更简洁）
- 只读数组类型：ReadonlyArray<T>（该类型数组，移除了所有修改数组本身的方法）
- 元组类型：[T1, T2]（一般和数组解构一起用）
- 联合类型：T1 | T2（也就是说，该对象类型要么为 T1，要么为 T2）
- 复合类型：T1 & T2（也就是说，该该对象类型 T1 和 T2 的属性都有）

## 类型转化

- (<string>name).length
- (name as string).length

## 类型推断

- 一般的类型不需要写，ts 能自动进行推断
- 如果是库代码，需要生成文档的，那么建议手动加上显示类型声明

## 关于 strictNullChecks

默认情况下，null 和 undefined 为其他类型的子类型，如果 strictNullChecks 设置为 true，那么需要额外设置 null 和 undefined 类型。

## 定义接口

- 接口定义后边用**分号**分隔
- 可选属性后边添加**?**
- 只读属性使用 _readonly_ 定义
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

需要注意的是，一个类有两种类型：一种是静态端（例如构造函数），一种是实例端（例如属性和方法），如果在接口中定义了构造函数签名（例如上面注释掉的 `new (...args: any[]);`），在类中实现时会报错。

这是因为当一个类实现一个接口时，只检测类的实例端，因为构造函数位于静态端，因此会报错。

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
