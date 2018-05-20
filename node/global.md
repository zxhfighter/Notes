# global objects in node

Node 中的全局对象包括：

- global
- process
- Buffer
- console
- Timers: setImmediate(clearImmediate)，setTimeout(clearTimeout)，setInterval(clearInterval)

另外，如下对象在所有模块中都能使用，但是 **它们并不是全局变量**，它们定义在模块的作用域范围内。

- __dirname
_ __filename
_ exports
- module
- require()
