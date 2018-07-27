# 如何来编写类型声明文件

## 全局类型

声明全局变量。

```ts
declare const MAX_COUNT: number;
declare var count: number;
declare function getName(id: number|string): string;
declare function getName(name: string, age: number): string;
declare function render(callback?:()=>void): void;
declare class Person {
    static maxAge: number
    static getMaxAge(): number
    constrctor(name: string, age: number)
    getName(id: number): string
}
```

## 命名空间

声明命名空间（对象），对类型进行分组。

```ts
declare namespace MyMap {
    size: number
    function set(key: any, value: any): void
    class Person {
        toString(): string
    }
}
```

命名空间还可以嵌套。

```ts
declare namespace OOO {
    var aaa: number | string
    // ...
    namespace O2{
        let b: number
    }
}
```

## 混合类型

例如 jQuery，既是构造函数，也有各种方法。

```ts
declare function $2(s: string): void
declare namespace $2 {
    forEach(): void;
}
```

又如。

```ts
// 实例端
interface People {
    name: string
    age: number
    getName(): string
    getAge():number
}

// 静态端
interface People_Static{
    new (name: string, age: number): People
    staticA(): number
    (w :number): number
}
declare var People: People_Static
```

## 模块化

除了上面的全局的方式，我们有时候还是通过 require 的方式引入模块化的代码。

```ts
let a = require('abcde');
```

对应的写法是这样的：

```ts
declare module "abcde" {
    export let a: number
    export function b(): number
    export namespace c {
        let cd: string
    }
}
```

其实就是外面套了一层 module "xxx"，里面的写法和之前其实差不多，把 declare 换成了 export。

如果导出的是一个函数本身，对应写法如下：

```ts
declare module 'app' {
    function aaa(some: number): number
    export = aaa
}
```

## UMD

有一种代码，既可以通过全局变量访问到，也可以通过 require 的方式访问到。比如我们最常见的 jquery。

其实就是按照全局的方式写 d.ts，写完后在最后加上 declare namespace "xxx" 的描述。

```ts
declare namespace UUU {
    let a: number
}

declare module "UUU" {
    export = UUU
}
```

## 扩展

有时候对一些内置对象进行了扩展（当然不建议你这么做！），对应写法如下：

```ts
interface Date {
    format(f: string): string
}
```

