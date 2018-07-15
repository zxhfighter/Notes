# rxjs 操作符

以 RxJS 6+ 版本为准。

## concat

有两种使用方式，一种是流顺序运行，一种是流并发运行。

### 顺序运行

流按照参数顺序，一个一个运行。

格式如下：

```ts
concat(stream1, stream2, stream3, ...);
```

例子如下：

```ts
import { concat, interval } from 'rxjs';
import { map } from 'rxjs/operators';

const timer1 = interval(1000).pipe(take(10), map(v => String.fromCodePoint(v + 65)));
const timer2 = interval(2000).pipe(take(6));
const timer3 = interval(500).pipe(take(10), map(v => String.fromCodePoint(v + 97)));
const result = concat(timer1, timer2, timer3);
result.subscribe((x: any) => console.log(x));
```

### 并发运行

多个流同时并发运行。

格式如下：

```ts
concat([stream1, stream2, stream3, ...]);
```

例子如下：

```ts
// 其余同上，这里使用了数组格式
const result = concat([timer1, timer2, timer3]);

// 另外，result 订阅后返回的是 Observable，还需要在内部进行订阅才能取到真正的值
result.subscribe((x: Observable<any>) => x.subscribe(console.log));
```

可以使用 concatAll 打平。

```ts
const result = concat([timer1, timer2, timer3]).pipe(concatAll());
result.subscribe(console.log);
```

### 混合运行

那可不可以将两种运行方式结合起来呢？做个实验如下：

```ts
// 其余同上
const timer4 = interval(500).pipe(take(6), map(v => `timer4: ${v}`));
const result = concat(timer1, [timer2, timer3], timer4);
result.subscribe((x: any) => {

    if (x.subscribe && typeof x.subscribe === 'function') {
        x.subscribe(console.log);
    }
    else {
        console.log(x);
    }
});
```

按照设想，timer1 最先发射数据，timer4 最后发射数据，实际的运行结果则是 timer1 按顺序运行完毕后，timer2, timer3, timer4 并发运行了！！！

## concatAll

Converts a higher-order Observable into a first-order Observable by concatenating the inner Observables in order.

将一个高阶 Observable（也就是返回 Observable 的 Observable）打平，按顺序运行。

```ts
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(
    map(ev => interval(1000).pipe(take(4)))
);

const firstOrder = higherOrder.pipe(concatAll());
firstOrder.subscribe(console.log);
```

又如：

```ts
// 每2秒发出值
const source = interval(2000);
const example = source.pipe(
  // 为了演示，增加10并作为 observable 返回
  map(val => of(val + 10)),
  // 合并内部 observables 的值
  concatAll()
);
example.subscribe(console.log);
```

当源 observable 发出的速度要比内部 observables 完成更快时，请小心 backpressure (背压)。

在很多情况下，你可以使用只使用单个操作符 concatMap 来替代！

```
concatMap === map + concatAll
```

## concatMap

Maps each value to an Observable, then flattens all of these inner Observables using concatAll.

```ts
const clicks = fromEvent(document, 'click');
const result = clicks.pipe(
  concatMap(ev => interval(1000).pipe(take(4)),
);
result.subscribe(x => console.log(x));
```

concatMap 等价于 mergeMap 设置参数 concurrent 为 1.

注意 concatMap 和 mergeMap 之间的区别。 因为 concatMap 之前前一个内部 observable 完成后才会订阅下一个， source 中延迟 2000ms 值会先发出。 对比的话， mergeMap 会立即订阅所有内部 observables， 延迟少的 observable (1000ms) 会先发出值，然后才是 2000ms 的 observable 。

```ts
// 发出延迟值
const source = of(2000, 1000);
// 将内部 observable 映射成 source，当前一个完成时发出结果并订阅下一个
const example = source.pipe(
  concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
);
// 输出: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
const subscribe = example.subscribe(val =>
  console.log(`With concatMap: ${val}`)
);

// 展示 concatMap 和 mergeMap 之间的区别
const mergeMapExample = source
  .pipe(
    // 只是为了确保 meregeMap 的日志晚于 concatMap 示例
    delay(5000),
    mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
  )
  .subscribe(val => console.log(`With mergeMap: ${val}`));
```

## merge

通过将多个观察者的值合并到一个观察者中进行发射。

```ts
import { merge, interval } from 'rxjs';

const timer1 = interval(1000).pipe(take(10), map(v => `timer1: ${v}`));
const timer2 = interval(2000).pipe(take(6), map(v => `timer2: ${v}`));
const timer3 = interval(500).pipe(take(10), map(v => `timer3: ${v}`));
const concurrent = 2; // the argument
const merged = merge(timer1, timer2, timer3, concurrent);
merged.subscribe(x => console.log(x));

// Results in the following:
// - First timer1 and timer2 will run concurrently
// - timer1 will emit a value every 1000ms for 10 iterations
// - timer2 will emit a value every 2000ms for 6 iterations
// - after timer1 hits it's max iteration, timer2 will
//   continue, and timer3 will start to run concurrently with timer2
// - when timer2 hits it's max iteration it terminates, and
//   timer3 will continue to emit a value every 500ms until it is complete
```

如果将上边的 `concurrent` 参数设置为 1，说明同一时间只能一个流发送数据，此时效果和 `concat` 效果是一模一样的。

## mergeAll

Converts a higher-order Observable into a first-order Observable which concurrently delivers all values that are emitted on the inner Observables.

```ts
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(map((ev) => interval(1000)));
const firstOrder = higherOrder.pipe(mergeAll());
firstOrder.subscribe(x => console.log(x));
```

又如：

```ts
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(
  map((ev) => interval(1000).pipe(take(10))),
);
const firstOrder = higherOrder.pipe(mergeAll(2));
firstOrder.subscribe(x => console.log(x));
```

## mergeMap

Projects each source value to an Observable which is merged in the output Observable.

Maps each value to an Observable, then flattens all of these inner Observables using mergeAll.

```ts
const letters = of('a', 'b', 'c');
const result = letters.pipe(
  mergeMap(x => interval(1000).pipe(map(i => x+i))),
);
result.subscribe(x => console.log(x));
```

又如：

```ts
// 发出 'Hello'
const source = of('Hello');
// 映射成 observable 并将其打平
const example = source.pipe(mergeMap(val => of(`${val} World!`)));
// 输出: 'Hello World!'
const subscribe = example.subscribe(val => console.log(val));
```

- flatMap 是 mergeMap 的别名！
- 如果同一时间应该只有一个内部 subscription 是有效的，请尝试 switchMap！
- 如果内部 observables 发送和订阅的顺序很重要，请尝试 concatMap!

```ts
// 每1秒发出值
const source = interval(1000);

const example = source.pipe(
  mergeMap(
    //project
    val => interval(5000).pipe(take(2)),
    //resultSelector
    (oVal, iVal, oIndex, iIndex) => [oIndex, oVal, iIndex, iVal],
    //concurrent
    2
  )
);
/*
        输出:
        [0, 0, 0, 0] <--第一个内部 observable
        [1, 1, 0, 0] <--第二个内部 observable
        [0, 0, 1, 1] <--第一个内部 observable
        [1, 1, 1, 1] <--第二个内部 observable
        [2, 2, 0, 0] <--第三个内部 observable
        [3, 3, 0, 0] <--第四个内部 observable
*/
const subscribe = example.subscribe(val => console.log(val));
```

## forkJoin

当所有 observables 完成时，发出每个 observable 的最新值。

当有一组 observables，但你只关心每个 observable 最后发出的值时，此操作符是最适合的。

此操作符的一个常见用例是在页面加载(或其他事件)时你希望发起多个请求，并在所有请求都响应后再采取行动。它可能与 Promise.all 的使用方式类似。

```ts
const myPromise = val =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)
  );

/*
  当所有 observables 完成时，将每个 observable
  的最新值作为数组发出
*/
const example = forkJoin(
  // 立即发出 'Hello'
  of('Hello'),
  // 1秒后发出 'World'
  of('World').pipe(delay(1000)),
  // 1秒后发出0
  interval(1000).pipe(take(1)),
  // 以1秒的时间间隔发出0和1
  interval(1000).pipe(take(2)),
  // 5秒后解析 'Promise Resolved' 的 promise
  myPromise('RESULT')
);
//输出: ["Hello", "World", 0, 1, "Promise Resolved: RESULT"]
const subscribe = example.subscribe(val => console.log(val));
```

## switchMap

switchMap 和其他打平操作符的主要区别是它具有取消效果。在每次发出时，会取消前一个内部 observable (你所提供函数的结果) 的订阅，然后订阅一个新的 observable 。你可以通过短语切换成一个新的 observable来记忆它。

```ts
// 发出每次点击
const source = fromEvent(document, 'click');

// 如果3秒内发生了另一次点击，则消息不会被发出
const example = source.pipe(
  switchMap(val => interval(3000).pipe(mapTo('Hello, I made it!')))
);

// (点击)...3s...'Hello I made it!'...(点击)...2s(点击)...
const subscribe = example.subscribe(val => console.log(val));
```

