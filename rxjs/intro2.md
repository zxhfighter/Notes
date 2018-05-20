# [RxJS](http://reactivex.io/rxjs/)

[TOC]

> Think of RxJS as lodash for events.

## RxJS 是什么

RxJS 是一个使用可观察对象序列来处理基于异步和事件的程序的库。可以使复杂的异步流程代码变得简洁，逻辑变得清晰。

提供了一个核心类型：`Observable`，以及若干卫星类型：`Observer`、`Subject`、`Subscription`、`Scheduler`，最后还有一些类似于数组的纯函数操作符（map、filter、reduce、every），这些操作符能够将异步事件流当做集合来处理。

RxJS 结合了`观察者模式`、`迭代器模式`以及`函数式编程`的思想。

RxJS 中几个重要的概念如下：

### Observable

可观察对象，在将来的某些时刻会持续产生数据（便于理解，有些文档称作`流(stream)`）。

### Observer

观察者，一般为回调函数。

### Subscription

订阅，观察者订阅可观察对象，可以取消订阅（subscription is the process of observers subscript to observables）。

### Operators

操作符，算子，纯函数（Think of RxJS as lodash for events）。

### Subject

主题，同 EventEmitter，同时实现了 Observable 和 Observer 两个接口，唯一能多播的对象。

### Schedulers

管理并发的中心调度器。

## 版本说明

RxJS 有两个版本：

- `Reactive-Extensions/RxJS`: 老版本 v4
- `ReactiveX/RxJS`: 新版本 v5，将老版本 v4 进行了重写，具有更好的性能、模块化、可调试性、大部分后向兼容（有一些 API 有 breaking change）

如无意外说明，本文档使用最新的 `ReactiveX/RxJS` 版本。

## 安装

es6 版本。

```
$ npm install -S rxjs-es
```

commonjs 版本。

```
$ npm install -S rxjs
```

由于有 webpack 之类的 bundle 工具存在，直接安装 commonjs 版本的就可以（angular/cli 安装的就是 rxjs）。

## 全量引入

通过 CDN 全量引入，或者在代码中`不小心`就全量引入了，见代码：

```js
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// 或者 import 'rxjs';

@Component({
  selector: 'lego-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit  {
  title = 'lego';
  num: Observable<number>;

  ngOnInit() {
    Observable.of(1, 2, 3).map(v => v * v).subscribe(console.log);
  }
}
```

此方式会将所有的 RxJS 代码全部引入，由于 RxJS API 较多，体积较大（未压缩大约 569K 左右，压缩 136K 左右，gzip 压缩 29K 左右），因此对代码大小有要求的慎重选择。

如果使用 angular/cli，可以新建一个初始化项目，将组件 `app.component.ts` 改成上面的代码，运行 `ng build` 然后查看 vendor 的大小（是的，rxjs 的代码在 vendor 包中），大约 2.5 M左右。

```
-rw-r--r--   1 baidu  staff   2.5M  7 12 12:03 vendor.bundle.js
-rw-r--r--   1 baidu  staff   3.0M  7 12 12:03 vendor.bundle.js.map
```

## 按需引入

此方式会采用 patch 的方式给指定对象（这里就是 Observable 了）提供方法（听过 monkey-patch 吗？也即运行时动态改变对象的行为，JS一般通过修改原型实现）。

```js
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// patch Observable with appropriate methods
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Component({
  selector: 'lego-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit  {
  title = 'lego';
  num: Observable<number>;

  ngOnInit() {
    Observable.of(1, 2, 3).map(v => v * v).subscribe(console.log);
  }
}
```

将 `app.component.ts` 修改成上述代码并运行 `ng build`，vendor 包的大小如下（从全量引入的 2.5M 减少到了 1.9M，有兴趣的还可以打开文件，查看其中引入的 RxJS 相关的代码）：

```
-rw-r--r--   1 baidu  staff   1.9M  7 12 11:57 vendor.bundle.js
-rw-r--r--   1 baidu  staff   2.3M  7 12 11:57 vendor.bundle.js.map
```

此方式能够结合一些打包工具（webpack 2+ 或者 rollup），实现 tree-shaking 功能（也就是去除没有使用到的代码）。

另外，还可以使用 es2017 的 [`bind 操作符`](https://github.com/tc39/proposal-bind-operator)。

```js
import {Observable} from 'rxjs/Observable'

// 注意：这里的引用路径为 rxjs/observable/of，而不是 rxjs/add/observable/of
import {of} from 'rxjs/observable/of'

// 注意：这里的引用路径为 rxjs/operator/map，而不是 rxjs/add/operator/map
import {map} from 'rxjs/operator/map'

Observable::of(1, 2, 3)::map(x => x * x);
```

需要注意的是，现在只有 [babel](http://babeljs.io/blog/2015/05/14/function-bind) 支持转译 bind operator，而 typescript 则不支持（ts 那帮人在等待 bind operator 成为 stage 2，具体可以查阅这个 [issue](https://github.com/Microsoft/TypeScript/issues/3508)）。

## 流从哪里来（转换方式）

### [of](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-of)

根据提供的参数依次发送数据，如果全部数据发送完毕，发送一个完成通知。

```
------[A]----[B]----[C]-----|-->
```

```js
// Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.
const numbers = Rx.Observable.of(10, 20, 30)
const letters = Rx.Observable.of('a', 'b', 'c')
const interval = Rx.Observable.interval(1000)

// 为了区分 Observable，Observable 对象变量后边添加了 $，这个看个人喜好
// concat 操作符会依次执行，如果之前的是异步操作，也会等待异步操作完成后，才执行下一个
// 不考虑顺序的用 forkJoin 操作符
const result$ = numbers.concat(letters).concat(interval)
result$.subscribe(console.log(x))
```

### [from](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-from)

将数组、类数组对象、Promise、可迭代对象、类Observable对象转化为 Observable 对象。

```js
// arr
const arr = [10, 20, 30]
const result$ = Rx.Observable.from(arr)
result$.subscribe(console.log)

// an infinite iterable
function *generateDoubles(seed) {
    let i = seed
    while (true) {
        yield i
        i = 2 * i
    }
}

const iterator = generateDoubles(3)

// 由于是无限迭代器，只取前10个，然后结束
const result$ = Rx.Observable.from(iterator).take(10)
result$.subscribe(console.log)
```

### [fromEvent](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent)

根据 DOM 事件或 Node 的 EventEmitter 事件创建 Observable 对象。

```js
const input = document.querySelector('#input')
const keyup$ = Rx.Observable.fromEvent(input, 'keyup')
keyup$.subscribe(console.log)
```

### [fromPromise](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromPromise)

将一个 Promise 对象转化为 Observable 对象。

```js
var result$ = Rx.Observable.fromPromise(fetch('http://myserver.com/'))
result$.subscribe(console.log, console.error)
```

## 流从哪里来（原生方式）

### 外部产生事件

```js
const myObservable$ = new Rx.Subject()
myObservable$.subscribe(console.log)
myObservable$.next('foo')
```

### 内部产生事件

```js
const myObservable$ = Rx.Observable.create(observer => {
    observer.next('foo')

    setTimeout(() => observer.next('bar'), 1000)
})

myObservable$.subscribe(console.log)
```

## 流加工

### [filter](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-filter)

只有符合一定条件的流才能通过，参考 `Array.prototype.filter` 方法。

```js
const clicks = Rx.Observable.fromEvent(document, 'click');
const clicksOnDivs$ = clicks.filter(ev => ev.target.tagName === 'DIV');
clicksOnDivs$.subscribe(console.log);
```

### [map](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map)

将流数据转化为一个新的数据，参考 `Array.prototype.map` 方法。


```
------[1]----[5]----[10]-----|-->
        map(x => x * 10)
------[10]----[50]----[100]-----|-->
```

```js
var clicks = Rx.Observable.fromEvent(document, 'click');
var positions$ = clicks.map(ev => ev.clientX);
positions$.subscribe(console.log);
```

### [mapTo]()

todo.

### [take](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-take)

只取流发送的前 N 个数据。

```js
const interval = Rx.Observable.interval(1000);
const five$ = interval.take(5);
five$.subscribe(console.log);
```

### [takeUntil](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-takeUntil)

流发送数据直到第二个流产生了数据(emit)。

```js
const interval = Rx.Observable.interval(1000);
const clicks = Rx.Observable.fromEvent(document, 'click');
const result$ = interval.takeUntil(clicks);
result$.subscribe(x => console.log(x));

var stopStream = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
input.takeUntil(stopStream)
  .map(event => event.target.value)
  .subscribe(value => console.log(value)); // "hello" (click)
```

### [delay](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-delay)

每隔 delay 时间产生数据。

```js
var clicks = Rx.Observable.fromEvent(document, 'click');
var delayedClicks$ = clicks.delay(1000); // each click emitted after 1 second
delayedClicks$.subscribe(x => console.log(x));

var clicks = Rx.Observable.fromEvent(document, 'click');
var date = new Date('March 15, 2050 12:00:00'); // in the future
var delayedClicks = clicks.delay(date); // click emitted only after that date
delayedClicks.subscribe(x => console.log(x));
```

### [throttleTime](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime)

让值通过，然后忽略剩下的值直到 duration 时间后。

```js
var clicks = Rx.Observable.fromEvent(document, 'click');

// 产生值后，下一秒内忽略所有值
var result = clicks.throttleTime(1000);
result.subscribe(x => console.log(x));
```

### [debounceTime](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-debounceTime)

有点类似 delay，不过只让每次产生的值的最后一个通过。

```js
var clicks = Rx.Observable.fromEvent(document, 'click');

// 每一秒都会有多次点击事件，但是只取每一秒中的最后一次点击事件
var result = clicks.debounceTime(1000);
result.subscribe(x => console.log(x));
```

## 比较

- A Function is a lazily evaluated computation that synchronously returns a single value on invocation.
- A generator is a lazily evaluated computation that synchronously returns zero to (potentially) infinite values on iteration.
- A Promise is a computation that may (or may not) eventually return a single value.
- An Observable is a lazily evaluated computation that can synchronously or asynchronously return zero to (potentially) infinite values from the time it's invoked onwards.
