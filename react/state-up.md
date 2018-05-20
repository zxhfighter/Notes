# React 中的状态上提

经常，几个组件可能会依赖同一状态，此时我们可以将这个状态提升到它们最近的父组件，子组件通过回调函数更改父组件的状态。

看个例子：

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />

        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />

        <BoilingVerdict
          celsius={parseFloat(celsius)} />

      </div>
    );
  }
}
```

`TemperatureInput` 代码如下：

```js
import React from 'react';

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

export class TemperatureInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature}
                    onChange={this.handleChange} />
            </fieldset>
        );
    }
}
```

`BoilingVerdict` 代码如下：

```js
import React from 'react';

export function BoilingVerdict({ celsius }) {
    return celsius >= 100 ? (<p>水开了！</p>) : (<p>一潭死水!</p>);
}
```

注意，**该组件初看起来没必要引入 React，如果不引入，会报错 React 没定义**。

仔细一想，由于 JSX 是依赖 React 的，因此必须引入 React。
