# 小程序开发

微信客户端在打开小程序之前，会把整个小程序的代码包下载到本地。

开发的时候，小程序提供了丰富的基础组件给开发者，开发者可以像搭积木一样，组合各种组件拼合成自己的小程序。

另外，为了让开发者可以很方便的调起微信提供的能力，例如获取用户信息、微信支付等等，小程序提供了很多 API 给开发者去使用。

为了保证小程序的质量，以及符合相关的规范，小程序的发布是需要经过审核的。

需要注意的是，**请开发者严格测试了版本之后，再提交审核**，过多的审核不通过，可能会影响后续的时间。

文件类型：

- .json 后缀的 JSON 配置文件
- .wxml 后缀的 WXML 模板文件
- .wxss 后缀的 WXSS 样式文件
- .js 后缀的 JS 脚本逻辑文件

注意：为了方便开发者减少配置项，描述页面的四个文件必须具有相同的路径与文件名。

app.json 配置项列表：

- pages
- window?
- tabBar?
- networkTimeout?
- debug?

JS 逻辑层注意事项：

- 增加了 `App` 和 `Page` 对象，进行程序和页面的注册
- 增加了 `getApp()` 和 `getCurrentPages()` 方法，用来获取当前 App 实例和当前页面栈
- 提供了丰富的 API，例如微信扫一扫和支付等功能，由 `wx.` 开头
- 每个页面有独立的作用域，并提供模块化能力
- **由于框架并非运行在浏览器中，宿主对象变了**，所以 JavaScript 在 web 中一些能力都无法使用，如 document，window 等
- 开发者写的所有代码最终将会打包成一份 JavaScript，并在小程序启动的时候运行，直到小程序销毁。类似 **ServiceWorker**，所以逻辑层也称之为 App Service。

**前台、后台定义**： 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台；当再次进入微信或再次打开小程序，又会从后台进入前台。需要注意的是：只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁。

object 内容在页面加载时会进行一次深拷贝，需考虑数据大小对页面加载的开销

- **直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致**。
- 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
- 请不要把 data 中任何一项的 value 设为 undefined ，否则这一项将不被设置并可能遗留一些潜在问题。

在小程序中所有页面的路由全部由框架进行管理。框架以栈的形式维护了当前的所有页面。

在 JavaScript 文件中声明的变量和函数只在该文件中有效；不同的文件中可以声明相同名字的变量和函数，不会互相影响。

通过全局函数 getApp() 可以获取全局的应用实例，如果需要全局的数据可以在 App() 中设置。

可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块只有通过 module.exports 或者 exports 才能对外暴露接口。

小程序目前不支持直接引入 node_modules , 开发者需要使用到 node_modules 时候建议拷贝出相关的代码到小程序的目录中。

​在需要使用这些模块的文件中，使用 require(path) 将公共代码引入， require 暂时不支持绝对路径。

小程序开发框架提供丰富的微信原生 API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等。

## 视图层

### WXML

- 数据绑定 `{{}}`，注意，组件属性、控制属性，布尔值都需要在 `{{}}` 内
- 列表循环 `wx:for`，`wx:for-item`，`wx:for-index`
- 条件渲染 `wx:if`，`wx:elif`，`wx:else`，wx:if vs hidden
- 分组 `<block wx:if>`，`<block wx:for>`
- 模板 `<template name="tplName">`，`<template is="tplName" data="{{...data}}">`
- 事件 `<view bindtap="add">{{ count }}</view>`
- 特征标志 `wx:key`，类似 angular 中的 trackBy 字段，提高动态循环效率，保持列表项状态
- key 以bind或catch开头，然后跟上事件的类型，如bindtap、catchtouchstart。自基础库版本 1.5.0 起，bind和catch后可以紧跟一个冒号，其含义不变，如bind:tap、、catch:touchstart
- bind事件绑定不会阻止冒泡事件向上冒泡，catch事件绑定可以阻止冒泡事件向上冒泡。
- 在组件中可以定义数据，这些数据将会通过事件传递给 SERVICE。 书写方式： 以data-开头，多个单词由连字符-链接，不能有大写(大写会自动转成小写)如data-element-type，最终在 event.currentTarget.dataset 中会将连字符转成驼峰elementType。
- WXML 提供两种文件引用方式import和include。
- import 有作用域的概念，即只会 import 目标文件中定义的 template，而不会 import 目标文件 import 的 template。
- include 可以将目标文件除了 <template/> <wxs/> 外的整个代码引入，相当于是拷贝到 include 位置，如：

### WXS

- WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构
- wxs 与 javascript 是不同的语言，有自己的语法，并不和 javascript 一致
- wxs 的运行环境和其他 javascript 代码是隔离的，wxs 中不能调用其他 javascript 文件中定义的函数，也不能调用小程序提供的API
- 页面的脚本逻辑是在JsCore中运行，JsCore是一个没有窗口对象的环境，所以不能在脚本中使用window，也无法在脚本中操作组件
- wxs 函数不能作为组件的事件回调
- 由于运行环境的差异，在 iOS 设备上小程序内的 wxs 会比 javascript 代码快 2 ~ 20 倍。在 android 设备上二者运行效率无差异
- JSCore全称为JavaScriptCore，是苹果公司在iOS中加入的一个新的framework。该framework为OC与JS代码相互操作的提供了极大的便利。https://developer.apple.com/documentation/javascriptcore


```js
<!--wxml-->
<!-- 下面的 getMax 函数，接受一个数组，且返回数组中最大的元素的值 -->
<wxs module="m1">
var getMax = function(array) {
  var max = undefined;
  for (var i = 0; i < array.length; ++i) {
    max = max === undefined ?
      array[i] :
      (max >= array[i] ? max : array[i]);
  }
  return max;
}

module.exports.getMax = getMax;
</wxs>

<!-- 调用 wxs 里面的 getMax 函数，参数为 page.js 里面的 array -->
<view> {{m1.getMax(array)}} </view>
```

- WXS 代码可以编写在 wxml 文件中的 <wxs> 标签内，或以 .wxs 为后缀名的文件内。
- 一个模块要想对外暴露其内部的私有变量与函数，只能通过 module.exports 实现。
- wxs 模块均为单例，wxs 模块在第一次被引用时，会自动初始化为单例对象

### WXSS

- 与 CSS 相比，WXSS 扩展的特性有：**尺寸单位**，**样式导入**
- rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。
- 建议：开发微信小程序时设计师可以用 iPhone6 作为视觉稿的标准。
- 注意： 在较小的屏幕上不可避免的会有一些毛刺，请在开发时尽量避免这种情况。
- 使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用;表示语句结束。
- style：静态的样式统一写到 class 中。style 接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。
- class：用于指定样式规则，其属性值是样式规则中类选择器名(样式类名)的集合，样式类名不需要带上.，样式类名之间用空格分隔。
- 定义在 app.wxss 中的样式为全局样式，作用于每一个页面。在 page 的 wxss 文件中定义的样式为局部样式，只作用在对应的页面，并会覆盖 app.wxss 中相同的选择器。


目前小程序分包大小有以下限制：

整个小程序所有分包大小不超过 4M
单个分包/主包大小不能超过 2M

小程序一开始时代码包限制为 1MB，但我们收到了很多反馈说代码包大小不够用，经过评估后我们放开了这个限制，增加到 2MB 。代码包上限的增加对于开发者来说，能够实现更丰富的功能，但对于用户来说，也增加了下载流量和本地空间的占用。

对小程序进行分包，可以优化小程序首次启动的下载时间，以及在多团队共同开发时可以更好的解耦协作。

## 多线程 Worker

一些异步处理的任务，可以放置于 Worker 中运行，待运行结束后，再把结果返回到小程序主线程。Worker 运行于一个单独的全局上下文与线程中，不能直接调用主线程的方法。 Worker 与主线程之间的数据传输，双方使用 Worker.postMessage() 来发送数据，Worker.onMessage() 来接收数据，传输的数据并不是直接共享，而是被复制的。
