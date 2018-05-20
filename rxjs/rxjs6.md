# RxJS 6

## Install

```shell
$ npm install rxjs
```

## Usage

```ts
import { Observable, Subject, RelaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

range(1, 20)
  .pipe(filter(x => x % 2 === 1), map(x => x + x))
  .subscribe(console.log);
```

## CommonJS Usage

注意，Node 8+ 开始支持解构了。

```ts
const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');

range(1, 20)
  .pipe(filter(x => x % 2 === 1), map(x => x + x))
  .subscribe(console.log);
```

## Why RxJS 6

### 解决隐式操作符依赖

在 RxJS 5.5 中，引入了 "pipeable operators"，该方式可以避免之前引入操作符后污染全局的 Observable 对象的问题。尤其是库，如果通过 "patch operators" 的方式引入，会形成一个隐式的依赖，如果依赖库的应用项目也使用了该隐式依赖的操作符，后续库升级后去掉了该操作符，那么就会报错。

patch 方式的操作符位于 rxjs 库的文件夹 `rxjs/add/operator/*`，本质是扩展 `Observable.prototype`。

pipe 方式的操作符则位于 rxjs 库的文件夹 `rxjs/operators`（注意是复数）。

### 解决无法 tree-shaking 的问题

patch 方式的操作符无法通过 rollup 或者 webpack 来进行 tree-shaking，而 pipe 方式只是引入了操作符函数，如果该函数未被使用，可以 lint 出来，还可以通过构建来优化掉。

### 更加函数式

pipe 的方式更加方便函数式合成，同时更加方便你创建自定义的操作符，一个 pipeable 的操作符是一个函数，该函数返回如下类型的函数即可。

```ts
<T, R>(source: Observable<T>) => Observable<R>
```

## Diffrence

### 操作符重命名

鉴于可以通过 pipe 的方式独立使用 operators，一些操作符的名称由于和 JS 的关键字冲突了，因此需要重命名。

- do -> tap
- catch -> catchError
- switch -> switchAll
- finnaly -> finalize

### 关于 let 和 pipe

另外 Observable 上原来的 `let` 操作符重命名成了如今的 `pipe` 操作符，通过此种操作流程，你可以很方便的实现自己的操作符。

```
source$.let(myOperator) -> source$.pipe(myOperator)
```

### 关于 toPromise

另外，移除掉了 `toPromise` 操作符，因为现在操作符只能返回一个 Observable。可以通过全局的实例方法 `Observable.toPromise()` 来代替。

### 关于 throw

由于 throw 是 JS 的关键词，因此需要用 `_throw` 来代替。

```ts
import { _throw } from 'rxjs/observable/throw';
```

如果对下划线开头的变量比较敏感（一般用来表示内部私有变量），可以通过如下方式实现：

```ts
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

const e = ErrorObservable.create(new Error('My bad'));
const e2 = new ErrorObservable(new Error('My bad too'));
```

## 构建自己的操作符

```ts
import { interval } from 'rxjs/observable/interval';
import { filter, map, take, toArray } from 'rxjs/operators';

/**
 * an operator that takes every Nth value
 */
const takeEveryNth = (n: number) => <T>(source: Observable<T>) =>
  new Observable<T>(observer => {
    let count = 0;
    return source.subscribe({
      next(x) {
        if (count++ % n === 0) observer.next(x);
      },
      error(err) { observer.error(err); },
      complete() { observer.complete(); }
    })
  });

/**
 * You can also use an existing operator like so
 */
const takeEveryNthSimple = (n: number) => <T>(source: Observable<T>) =>
  source.pipe(filter((value, index) => index % n === 0 ))

/**
 * And since pipeable operators return functions, you can further simplify like so
 */
const takeEveryNthSimplest = (n: number) => filter((value, index) => index % n === 0);

interval(1000).pipe(
  takeEveryNth(2),
  map(x => x + x),
  takeEveryNthSimple(3),
  map(x => x * x),
  takeEveryNthSimplest(4),
  take(3),
  toArray()
)
.subscribe(x => console.log(x));
// [0, 2304, 9216]
```

## 构建和 Treeshaking

从 `rxjs/operators` 引入操作符，特别需要升级构建过程，因为默认引入了 rxjs 的 CommonJS 输出，例如 webpack 就必须升级到 3 以上，因为依赖 ModuleConcatenationPlugin 插件。

另外，如果无法优化构建过程，操作符可以单独加载。

```ts
import { map, filter, reduce } from 'rxjs/operators';
```

变成：

```ts
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { reduce } from 'rxjs/operators/reduce';
```

## 升级指南

采取增量逐步升级的方式升级。

1.安装 rxjs@6.0 和后向兼容库 rxjs-compat@6.0（保证业务代码最小变更）
2.如果有 rxjs-compat 没有覆盖的 breaking changes，手动更新代码
3.最终，有时间手动更新代码，最终移除 rxjs-compat，能极大缩减体积

对 TS 代码，可以使用 `rxjs-tslint` 包中的 `rxjs-5-to-6-migrate` 工具来进行升级。

```
npm i -g rxjs-tslint
rxjs-5-to-6-migrate -p [path/to/tsconfig.json]
```

4.在 rxjs v7 发布前，需要移除所有 deprecated 的功能

### breaking changes

rxjs-compat 未修复的功能包括：同步异常处理和自定义操作符。

同步异常处理，原来使用  `try...catch`，现在需要使用回调函数。

```ts
try {
  source$.subscribe(nextFn, undefined, completeFn);
} catch (err) {
  handleError(err);
}
```

变成：

```ts
source$.subscribe(nextFn, handleError, completeFn);
```

自定义操作符，原来是通过扩展 Observable.prototype 来实现的，现在需要重写成一个函数。

```ts
Observable.prototype.userDefined = () => {
  return new Observable((subscriber) => {
    this.subscribe({
      next(value) { subscriber.next(value); },
      error(err) { subscriber.error(err); },
      complete() { subscriber.complete(); },
   });
  });
});
source$.userDefined().subscribe();
```

变成：

```ts
const userDefined = <T>() => (source: Observable<T>) => new Observable<T>((subscriber) => {
    this.subscribe({
      next(value) { subscriber.next(value); },
      error(err) { subscriber.error(err); },
      complete() { subscriber.complete(); },
   });
  });
});

source$.pipe(
  userDefined(),
)
.subscribe();
```

### 移除 rxjs-compat

- import 路径有所变化
- operators 语法从 chain 变成了 pipe
- 一些操作 observables 的类变成了函数，例如 `ArrayObservable.create(myArray)` 被已有操作符 `from(myArray)` 或新操作符 `fromArray(myArray)` 代替
- `Observable.if` 和 `Observable.throw` 被静态函数 `iif()` 和 `throwError()` 代替
- 创建型操作符 merge, concat, combineLatest, race, zip 从 `rxjs/operators` 移到了 `rxjs`，使用方式也从 chain 变成了 pipe

```ts
Observable.if(test, a$, b$);
// ===> becomes
iif(test, a$, b$);

Observable.throw(new Error());
// ===> becomes
throwError(new Error());

import { merge } from 'rxjs/operators';
a$.pipe(merge(b$, c$));
// ===> becomes
import { merge } from 'rxjs';
merge(a$, b$, c$);

import { concat } from 'rxjs/operators';
a$.pipe(concat(b$, c$));
// becomes
import { concat } from 'rxjs';
concat(a$, b$, c$);

import { combineLatest } from 'rxjs/operators';
a$.pipe(combineLatest(b$, c$));
// becomes
import { combineLatest } from 'rxjs';
combineLatest(a$, b$, c$);

import { race } from 'rxjs/operators';
a$.pipe(race(b$, c$));
// becomes
import { race } from 'rxjs';
race(a$, b$, c$);

import { zip } from 'rxjs/operators';
a$.pipe(zip(b$, c$));
// becomes
import { zip } from 'rxjs';
zip(a$, b$, c$);
```


### 将 chain 方式改造成 pipe 方式

原来的 chain 方式。

```ts
source
 .map(x => x + x)
 .mergeMap(n => of(n + 1, n + 2)
   .filter(x => x % 1 == 0)
   .scan((acc, x) => acc + x, 0)
 )
 .catch(err => of('error found'))
 .subscribe(printResult);
```

改造后的 pipe 方式。

```ts
source.pipe(
 map(x => x + x),
 mergeMap(n => of(n + 1, n + 2).pipe(
   filter(x => x % 1 == 0),
   scan((acc, x) => acc + x, 0),
 )),
 catchError(err => of('error found')),
).subscribe(printResult);
```

## Reference

- https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md