# Component

[TOC]

## Elements

Elements 是 React 中最小的 UI 块。

```js
const element = <div tabIndex="0"></div>;
```

Component 由 Elements 构成。

最后，使用 `ReactDOM.render()` 将 Component 挂载到宿主节点。

```js
ReactDOM.render(element, document.querySelector('root'));
```

一般来说，上面的方法一般只会执行一次，然后应用的状态变更由内部的 `props` 和 `state` 去控制。

## Component

Component 可以看做一个独立、可复用的 UI 组件。

### 函数组件

最简单的定义 Component 的方式是使用 JavaScript 函数：

```js
function Welcome(props) {
    return <h1>Hello, { props.name } is { props.age } years old.</h1>;
}
```

如果知道 props 中有哪些参数，此处可以结合 ES2015 的解构。

```js
function Welcome({ name, age }) {
    return <h1>Hello, { name } is { age } years old. </h1>;
}
```

### 类组件

也可以使用 ES2015 的类语法来创建 Component。

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, { name } is { age } years old. </h1>;
  }
}
```

## 渲染组件

当 React 遇到一个自定义 Component 时，会收集所有属性给一个 `props` 对象。

```js
function Welcome({ name, age }) {
  return <h1>Hello, { name } is { age } years old. </h1>;
}

const element = <Welcome name="Sara" age={20} />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

PS: 注意所有的自定义组件，**首字母都需要大写**，否则 React 会当做普通的 DOM 标签。

## 组件组合

组件可以轻易组合。

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

## 组件分而治之

组件被拆分的**粒度越细，纯度越纯**，可以复用的程度就越高。

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

上面的组件就可以进一步拆分成 Avatar、UserInfo、Comment 等组件。

## 只读的 Props

React 尽管很灵活，但还是有一个严格规定：

> 所有 React 组件对于它们的 props 来说，要表现的像纯函数。

## 关于 state

组件中的内部状态由 `state` 字段来设置和获取，使用需要注意 3 点：

### 1.不要直接修改 state 对象

`this.state` 只能在构造函数中直接设置，在其他地方，只能通过 `this.setState()` 方法来设置。

### 2.如何正确计算下一个状态值

React 为了性能会缓存多个 `setState()` 操作，因此 `this.props` 和 `this.state` 的值可能是异步更新的，不能根据它们的值来计算下一个状态值。

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

正确的更新方式是使用 `setState` 的第二种形式，传入一个携带上次状态的函数。

```js
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

注意，上边直接使用箭头函数返回了一个对象，因此需要用圆括号括起来，否则需要加上 return 语句。

### 3.状态是合并的

当你调用 `setState()` 时，React 会合并对象到当前状态。

例如初始化时，状态包括 `posts` 和 `comments` 两个状态。

```js
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comments: []
  };
}
```

之后更新的时候，可以一个一个的更新。

```js
componentDidMount() {
  fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
  });

  fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
  });
}
```

## 组件中的单向数据流

组件中的 state 只能流向子组件，此时会被当做子组件的 props，此时子组件无需知道该 props 是来自上层组件的 props 还是 state 或者手动指定的值。

如果组件的状态无需随着时间而变，可以当做 stateless 组件，否则则是 stateful 组件。

可以在 stateless 组件中使用 stateful 组件，反之亦然。

## 组件中的生命周期

组件从创建，挂载，运行，到销毁，有着自己的生命周期，其中两个比较重要的生命周期如下：

- componentDidMount: 当组件渲染到 DOM 节点时触发，此时可以设置定时器等
- componentWillUnmount: 当组件即将要从父节点销毁时触发，此时可以销毁定时器等

