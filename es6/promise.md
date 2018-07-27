# Promise

- JS 单线程（Web Worker 可以开个线程用于计算，不过也受主线程控制）
- （I/O、网络、人）都是不可预测的，因此提出事件模型
- 回调处理，事件回调，自定义回调
- Node 的错误优先回调风格， `fn(...args, cb)` 并且 cb 的格式为 `(err, data) => { }`
- 回调地狱，以及一些复杂异步处理，例如：

    1.两个异步请求，当两个异步请求都完成时做某些事（如果是 N 个呢？）
    2.同时进行两个异步操作，只取优先完成的操作结果

- Promise 承诺在将来的某个时刻完成（拒绝）
- 生命周期：pending -> fulfilled(rejected)
- `then()` 方法会将回调添加到当前事件循环队列的末尾（MicroTask Queue），ES6 为了 Promise 加入了事件循环特别处理（之前事件循环与 ECMA 无关系的哦，由宿主环境处理）
- Promise 的错误处理，`promise.then(null, errorHandler)` 等价于 `promise.catch(err)`
- 创建未完成的 Promise，传入的执行器(executor)函数 `(resolve, reject) => {}` 会立即执行！遇到 resolve 时会将 then 回调添加到 MicroTask Queue，同理，遇到 reject 时，也会将 catch 回调添加到 MicroTask Queue。
- ES6 之前没有事件循环处理机制（宿主环境负责处理），由于 Promise 的引入，需要更细粒度的控制，因此加入了事件循环机制
- 如果没有拒绝处理程序的情况下拒绝一个 Promise（reject() 或者 throw new Error('')），且没有添加全局处理事件，那么不会提示失败信息，代码会报错中止运行
- Node 和 浏览器提供了全局的钩子函数来处理那些被拒绝但是又没有被处理过的 Promise:

    1. unhandledRejection：在事件循环中，被拒绝
    2. rejectionHandled：在事件循环后，被拒绝

- Promise.all([p1, p2, ...]).then([v1, v2, ...] => {})
- Promise.race([p1, p2, ...]).then(v => {})
- async 函数执行后，永远返回 Promise，即使不是显示的返回 Promise，也会使用 `Promise.resolve` 或者
`Promise.reject` 转化为 Promise
- await 只允许在 async 中使用，操作数只能是一个 Promise，如果 Promise 完成，await 返回执行结果，否则抛出异常
