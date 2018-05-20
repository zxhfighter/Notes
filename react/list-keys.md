# React 中的列表循环

## 列表循环

核心还是在于 JSX 最终会编译成 `React.createElement()`，因此可以很方便的在循环中创建 `React element` 列表。

```js
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

然后可以使用表达式语法 `{}` 将列表变量引入到其他 JSX 语句中。

```js
ReactDOM.render(
    <ul>{listItems}</ul>,
    document.getElementById('root')
);
```

## 进一步封装成组件

可以在此基础上，将循环部分封装成一个组件。

```js
function NumberList({ numbers }) {
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

## key 的重要性

运行上面代码，你会得到一个警告：每个列表项需要提供一个 key，那么什么是 key 呢？

```js
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

key 主要用来帮助 React 提高 DOM 渲染的性能，例如可以根据 key 来判断哪些项目是新增的，哪些是移除的，哪些是更新的。

因此，在一个列表循环中，需要尽可能的保证 key 的唯一性，如果不提供，React 会默认将索引用作 key（这将引发某些性能问题）。

一个经验法则是：**在 `map()` 中生成的元素一般需要 key**。

另外，key 主要用于 React，如果你需要传递相同的值给组件，那么需要额外指定一个其他的名字。

```js
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

最后，JSX 还允许直接嵌入循环表达式，例如：

```js
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />

      )}
    </ul>
  );
}
```

不过，这种写法可能会影响可读性，另外，如果在 JSX 中使用 `map()`，那就说明是不是可以将这个操作提取成一个组件？