# history API

window 对象提供了 history 对象来访问浏览器历史记录。

## 检测

检测是否支持 history API。

```ts
return !!(window.history && history.pushState)
```

## 跳转

```ts
// 后退一页，等价于点击后退按钮
window.history.back();

// 前进一页，等价于点击前进按钮
window.history.forward();

// 跳转到相对当前页面的第 N 页
window.history.go(-1); // 等价于 window.history.back()
window.history.go(1); // 等价于 window.history.forward();

// 查看堆栈长度
window.history.length;
```

## pushState

HTML5 新增了 `pushState` 和 `replaceState` 方法来修改历史记录堆栈条目，和 `window.onpopstate` 事件一起结合使用。

当使用 `history.pushState()` 时，会更改 `XMLHttpRequest` 的头部的 referrer。

例如当前页面为 `http://mozilla.org/foo.html`，执行了如下代码：

```ts
var stateObj = { foo: "bar" };
history.pushState(stateObj, "page 2", "bar.html");
```

那么 URL 地址栏会更新为 `http://mozilla.org/bar.html`，但是浏览器不会加载 `bar.html` 甚至都懒得去检查 `bar.html` 是否存在。

如果此时用户跳转到 `https://www.baidu.com`，此时点击地址栏后退按钮，此时会去检测 `http://mozilla.org/bar.html` 是否存在并加载。

```ts
history.pushState(state, title, url)
```

- state: 存储 JSON 字符串，可以用在 popstate 事件中
- title: 现在大多数浏览器不支持或者忽略这个参数，最好用 null 代替
- url: 任意有效的 URL，用于更新浏览器的地址栏，并不在乎 URL 是否已经存在地址列表中。更重要的是，它不会重新加载页面

## replaceState

参数同 `pushState()`，不过两者还是有区别，`pushState()` 是在 history 栈中添加一个新的条目，`replaceState()` 是替换当前的记录值。

假设我们有两个栈块，一个标记为 1,另一个标记为 2，你有第三个栈块，标记为 3。当执行 `pushState()` 时，栈块 3 将被添加到已经存在的栈中，因此，栈就有 3 个块栈了。

```
2   (pushState: 3)   3
                     2
1                    1
```

同样的假设情景下，当执行 `replaceState()` 时，将在块 2 的堆栈位置放置块 3。所以 history 的记录条数不变，也就是说，`pushState()` 会让 history 的数量加 1.

```
2   (replaceState: 3)   3

1                       1
```

