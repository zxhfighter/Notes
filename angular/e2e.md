# e2e 测试

端到端测试，也即在真实的浏览器环境中模拟用户操作进行测试，使用 [Protractor](http://www.protractortest.org/#/) 来对 [Angular](http://angular.io/) 项目进行端到端测试。

有意思的是，Angular 中文意思为"角"，而 Protractor 中文意思为"量角器"。

## 安装

本地安装 Protractor，输入 `./node_modules/.bin/protractor --version` 查看是否安装成功（如果全局安装了，可以省略前面的路径，即运行 `protractor --version` 即可）。

```
$ npm install -D protractor
$ ./node_modules/.bin/protractor --version
Version 5.3.2
```

查看安装后的 Protractor 的 package.json 中的 `bin` 字段，不难发现提供了两个命名：`protractor` 和 `webdriver-manager`。

```json
{
    "bin": {
        "protractor": "bin/protractor",
        "webdriver-manager": "bin/webdriver-manager"
    }
}
```

## 配置 webdriver-manager

`webdriver-manager` 是一个帮助工具，用来获取当前正在运行的 Selenium 服务实例，使用时，先需要下载必要的包：

```shell
$ webdriver-manager update
```

不过在国内，下载很可能被墙掉，因此在本地测试时需要使用参数 `--proxy` 加上代理。

```shell
$ webdriver-manager update --proxy http://awesome-proxy.com:8188
```

之后，启动一个 Selenium 服务实例。

```shell
$ webdriver-manager start
```

启动后，可以通过地址 [http://localhost:4444/wd/hub](http://localhost:4444/wd/hub.) 查看服务器运行状态。

Protractor 测试将会发送请求给该服务器，来控制本地浏览器。

## 编写测试

Protractor 运行起来至少需要两个文件：一个测试文件和配置文件。

### 测试文件

先编写一个简单的测试文件 `todo.spec.ts`。

```ts
describe('angular homepage todo list', function () {
    it('should add a todo', function () {
        browser.get('https://angular.io/');

        // 获取输入框，模拟用户输入一些文字
        element(by.model('todoList.todoText')).sendKeys('write first protractor test');

        // 获取添加按钮，模拟用户点击
        element(by.css('[value="add"]')).click();

        // 测试是否添加成功
        var todoList = element.all(by.repeater('todo in todoList.todos'));
        expect(todoList.count()).toEqual(3);
        expect(todoList.get(2).getText()).toEqual('write first protractor test');

        // 移除添加的项
        todoList.get(2).element(by.css('input')).click();
        var completedAmount = element.all(by.css('.done-true'));
        expect(completedAmount.count()).toEqual(2);
    });
});
```

其中的 `describe` 和 `it` 来自 Jasmine 单测框架，而 `browser` 则是 Protractor 创建的一个全局变量，`element` 和 `by` 等对象也是来自 Protractor。

### 配置文件

另外一个必须提供的是配置文件，配置需要测试的文件，以及和 Selenium 服务的一些交互，其余未显示设置的会提供默认值，例如默认的 framework 为 'jasmine'，默认 browser 为 'chrome'。

```ts
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['todo-spec.js']
}
```

## 启动测试

运行：

```shell
$ protractor conf.js
```

此时会打开一个 chrome 浏览器，并导航到相应界面，运行完毕后就会关闭浏览器窗口，测试结果大致如下：

```
1 test, 3 assertions, 0 failures
```


## Setting Up the Selenium Server

When working with Protractor, you need to specify how to connect to the browser drivers which will start up and control the browsers you are testing on.

使用 Protractor 时，需要如何能够控制浏览器驱动器来执行测试（例如点击某个按钮，选择某项数据等）。

You will most likely use the Selenium Server. The server acts as proxy between your test script (written with the WebDriver API) and the browser driver (controlled by the WebDriver protocols).

可以使用 Selenium Server，它可以当做代理服务器，用来测试脚本和浏览器驱动之间的通信。

The server forwards commands from your script to the driver and returns responses from the driver to your script. The server can handle multiple scripts in different languages. The server can startup and manage multiple browsers in different versions and implementations.

     [Test Scripts] < ------------ > [Selenium Server] < ------------ > [Browser Drivers]
