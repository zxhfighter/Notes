# 使用 Typescript 的小技巧

## 消除大量模型引用

对业务进行分析后，会定义模型对象，例如：

```ts
// api.model.ts
export interface Customer {
    id: number;
    name: string;
}

export interface User {
    id: number;
    isActive: boolean;
}
```

在引用的时候，可能需要引用很多个模型对象，比较繁琐。

```ts
// 这里的导入的模型对象可能会很长
import { Customer, User } from './api.model.ts';
```

### 方案一：使用 namespace

使用 namespace 将模型对象归组，并且不需要引用直接可用。

```ts
export namespace ApiModel {
    export interface Customer { }
    export interface User { }
}
```

使用时，需要携带 namespace 空间名。

```ts
export class MyComponent {
    cust: ApiModel.Customer;
}
```

### 方案二：使用 `.d.ts` 文件

可以创建一个额外的类型声明文件（以 `.d.ts` 结尾），在该文件中定义类型，并且不需要 export。

```ts
// api.model.d.ts
// you don't need to export the interface in d file
interface Customer {
    id: number;
    name: string;
}
```

类型声明文件主要给消费者使用。

## 接口所有属性可选

如果我们定义一个接口，属性可选，可能会这么做。

```ts
// api.model.ts
export interface Customer {
    id?: number;
    name?: string;
    age?: number;
}
```

还有一种高级类型 Partial，能够做到这一点，其定义如下：

```ts
// lib.es5.d.ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

其中 `keyof T` 会返回 T 的属性数组。

使用时，如下：

```ts
// using the interface but make all fields optional
import { Customer } from './api.model';

export class MyComponent {
    cust: Partial<Customer>;

    ngOninit() {
        this.cust = { name: 'jane' }; // no error throw because all fields are optional
    }
}
```

## 禁用 TS 报错

可以使用 @ts-ignore 来禁止 TS 提示报错。

```ts
if (false) {
    // @ts-ignore
    console.log('x');
}
```
