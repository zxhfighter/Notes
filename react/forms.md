# React 中的 Forms

React 中处理表单有两种方式：一种是 `controlled components`，另一种是 `uncontrolled components`。

## Controlled Components

一般来说，表单元素会根据用户输入，自己更新状态。

但是在 React 中，一切可变的状态都是用 `state` 字段来管理的，并且只能通过 `setState()` 来更新。因此，`state` 是唯一可信的数据源。

如果在一个组件中，一个表单的输入元素完全由 React 来控制，那么这个组件被称作为 "controlled components"。

```js
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

在受控组件中，每一个可能引起状态变更的操作，都会伴随这一个事件处理器，在其中使用 `setState()` 更新 `state`。

## textarea tag

React 中，`<textarea>` 使用 `value` 来定义其中的文字，`defaultValue` 来显示默认值。

```js
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## select tag

原生的 `<select>` 组件，选中某个值，需要在该 `<option>` 上添加 `selected`。

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

在 React 中，也提供了 `value` 值，定义在根元素 `<select>` 上。

```js
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite La Croix flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

如果需要多选，可以采用如下方式：

```html
<select multiple={true} value={['B', 'C']}>
```

## file input tag

文件上传标签的值是只读的，因此在 React 中，它是一个 "uncontrolled component（非受控组件）"。

```
<input type="file" />
```

## 处理多个输入

如果需要处理多个受控组件的输入，如果每个组件都写一个相关的事件处理程序，会比较繁琐，因此可以统一写成一个事件处理程序，然后在该事件处理程序中根据 `name` 的不同，进行处理。

```js
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

注意，上边使用了 es6 的 _动态属性计算_ 语法。

## 受控组件遇到了 null 值

一般来说，受控组件指定了 value，那么如果没有添加对应的事件处理程序（例如 onChange），那么它将是无法编辑的。

不过，如果 value 的值变成了 `null` 或者 `undefined` 后，受控组件会进入可编辑的状态。

```js
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);
```

## 受控组件的缺点

繁琐，因为需要小心处理所有可能会改变状态的事件，尤其是旧代码库迁移到 React 的时候。

此时，可以考虑使用 "uncontrolled components"，React 中表单的另一种实现。