# React 中的 Events 处理

[TOC]

React elements 中的事件与 DOM elements 中的事件很类似，有些句法上的区别：

- React 事件名称使用**驼峰风格**，而不是小写
- 使用 JSX **传递事件处理函数**作为事件处理器，而不是传递字符串
- React 事件处理器中无法通过 `return false` 来阻止默认事件，需要显示调用 `preventDefault`

## 驼峰风格

例如，DOM elements 事件处理如下：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React elements 事件处理如下：

```js
<button onClick={ activateLasers }>
  Activate Lasers
</button>
```

## 显示默认事件处理

在 HTML 中，禁止默认事件可以通过 `return false` 来实现，例如：

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

在 React 中，需要写成如下格式：

```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={ handleClick }>
      Click me
    </a>
  );
}
```

注意，上面参数中 `e` 是一个合成的事件（SyntheticEvent），React 根据 W3C 规范重新定义了这些事件，而无需担心浏览器兼容性问题。

## 使用 bind

如果使用 ES2015 类的语法来定义事件，需要注意显示绑定 `this`，当然也可以直接在 JSX 中绑定（`onClick={ this.handleClick.bind(this) }`）。

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

## 使用类字段语法

另外，如果使用了实验性质的类字段语法（public class fields syntax），可以直接定义该方法。

```js
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

## 事件传递参数

传递额外参数，有两种方式：

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

第一种，使用了箭头函数绑定 this 并传递 id 参数。
第二种，使用 bind 函数，该函数中的事件参数 e 会自动填充到 id 参数后边。

