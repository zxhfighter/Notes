# JSX 简介

[TOC]

JSX 是 JavaScript 一种语法扩展，可以很方便的描述某一块 UI 应该长什么样子。

所有的 JSX 最终会转译成 `React.createElement`，因此最终输出的是一个 Element 元素（ReactElement 或者 CustomElement 等）。

## 使用 `{}` 表达式

在 JSX 可以使用任意 JavaScript 表达式，用大括号 `{}` 括起来。

```js
const element = (
  <h1 className={ this.props.className }>
    Hello, { formatName(user) }!
  </h1>
);
```

另外，对于多行 JSX 语句，为了避免 _自动分号插入_，需要用圆括号 `()` 将整个 JSX 括起来。

## JSX 自身也是一个表达式

JSX 最终会返回 Element 元素，也是一个表达式。

```js
function getGreeting(user) {
  if (user) {
    // return React.createElement('h1', ...)
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  // return React.createElement('h1', ...)
  return <h1>Hello, Stranger.</h1>;
}
```

## 在 JSX 中指定属性

对于字符串常量，直接使用引号即可。

```js
const element = <div tabIndex="0"></div>;
```

对于其他的属性值，使用 `{}` 表达式进行计算即可。

```js
const element = <img src={user.avatarUrl}></img>;
```

## JSX 部分属性名变驼峰风格

由于 JSX 写法类似 HTML，但其实更加偏向于 JavaScript，React DOM 使用了属性的驼峰风格，例如 `class` 需要写成 `className`，`tabindex` 需要写成 `tabIndex`。

## JSX 中指定子节点

如果元素没有子节点，类似 HTML 中的 `img` 元素，直接关闭即可。

```js
const element = <img src={user.avatarUrl} />;
```

如果元素包含子节点，使用圆括号括起来。

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

## JSX 会自动防 XSS 注入

JSX 的 `{}` 表达式会自动对一些危险字符进行转义（例如 &、<、>、"、'），因此可以避免 XSS 攻击。

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

## JSX 的本质

Babel 会将 JSX 转译成 `React.createElement()` 调用。

下边两个语法返回结果是一样的，因此可以看到 JSX 不是必要的，但是使用 JSX 更加简洁。

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

它们最终会创建一个类似如下的一个对象：

```js
const element = {
    type: 'h1',
    props: {
        className: 'greeting',
        children: 'Hello, world'
    }
};
```

这些对象被称作 "React elements"，之后 React 读取这些对象取创建和更新 DOM。
