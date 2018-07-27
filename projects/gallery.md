图形	升级/新增	优先级	所需系统	开发进度
需求图谱	升级	高	涟漪	100%
媒体转移	新增	高	灵犀	100%
余弦图	新增	高	灵犀	100%
地图散点	新增	低	灵犀	100%，功能开发完毕
字词云	新增	中	涟漪	100%，基于 wordcloud2
韦恩图	新增	中	方物、灵犀	100%，目前支持三个集合
折线图	功能升级(坐标轴截断)	中	精益、指数等	100%
散点图	功能升级	低	精益、指数等	80%
柱状图	功能升级(坐标轴截断)	中	灵犀	100%
桑基图	新增	低	精益、灵犀	下一期做
信息接触点	新增	高	精益	已投入精益使用


2. 开发折线图，由于折线图功能比较多，这里选择了一些核心的，基础的功能进行开发，其余功能后续看业务要求进一步完善，一些需求点如下：

- 横坐标支持时间(done)，类目(doing)。
- 支持多条曲线(done)，以及图例开关(done)。
- 支持坐标轴提示(done)、单条曲线提示(done)。
- 支持网格显示(done)。
- 支持数据漫游(done)。
- 支持数据截断(done)。
- 支持区域缩放。

3. 开发柱状图，实现的基本功能如下：
- 横坐标支持类目(done)。
- 支持多条序列以及图例开关(done)。
- 支持坐标轴提示(done)、单条曲线提示(done)。
- 支持网格显示(done)。
- 支持数据漫游。
- 支持数据截断。
- 支持区域缩放。

4. 完善信息接触点图形，与RD沟通数据接口格式，新增如下需求点：
- 完善测试按理，支持多个节点情况(最多81个子节点)(done)。
- 选中任一路径，高亮整条路径(done)。
- 高度能够根据节点数目自适应(预计下周完成)。

调研数据可视化的服务端渲染方案，需要重点调研：在原有栅格化图片的基础上，能不能尽可能的保留交互操作？
暂时没想到好的方案，预计下周调研。


使用工厂方法封装完善之后，可以直接调用一个API，隐藏了内部实现，便于扩展，唯一需要注意的是，options 参数中必须传递 type 参数，或者 series 字段中必须传递 type 参数，代码如下：

进一步完善韦恩图，发现之前实现的韦恩图实现有不少缺陷，主要存在于：
1. 交集的面积和集合的大小不成正比
2. 交集之间无法hover显示

后来查阅了相关资料，计算多个集合的位置，使交集面积尽可能与集合面积成比例是一个比较复杂的数学问题，具体见 http://www.benfrederickson.com/better-venn-diagrams/。

因此韦恩图决定直接使用比较成熟的 venn.js(https://github.com/benfred/venn.js)，在此基础上，实现了 legend、title 等功能。

0. 代码全部基于 d3(v4.0) 开发，没有引入 echarts。
1. 采用 es2015 module 来进行模块化管理
2. 以及采用 rollup 来打包代码，这样可以达到符号级别的代码打包
3. 同时开发时，使用了 webpack 来进行资源管理、gulp 来进行流程调度、browser-sync 进行服务托管、多浏览器端测试等、fecs 来进行代码 lint。


## 如何在服务器生成图片

选择使用 phantomjs + node。

- 前端请求后端数据
- 前端根据后端返回的数据构造图形库参数
- 前端发送参数给后端请求，等待后端返回图片地址
- 后端接受请求后，获取图形参数，并调用 node 生成图片，并返回图片地址（node 使用了 phantomjs 和 gallery）
- 后端返回给前端实时生成的图片地址


# d3 图形库设计

## HTML 结构设计

以余弦图（Chord）为例，生成的结构如下：

```html
<!-- 所有图形元素需要放在一个类名为 chart-${chartType} 的 div 元素下边 -->
<!-- 这样的好处便于一些坐标计算，因此最好将该 div 元素定位为 relative -->
<div class="chart-base chart-chord">

    <!-- svg 根元素 -->
    <svg class="chart-svg chart-chord-svg" width="600" height="300" viewBox="0 0 600 300">

        <!-- 元素定义区域 -->
        <defs class="chart-defs">
            <clip-path id="clip-path"></clip-path>
            <path id="triangle" d="M0,0 L1,1Z"></path>
        </defs>

        <!-- 坐标轴(如果有的话) -->
        <g class="chart-axis chart-axis-x"></g>

        <!-- svg中心点(如果有的话，用于绘制圆和弧线等结构) -->
        <g class="chart-center-point" transform="translate(300, 150)"></g>

        <!-- 实际绘图区域，考虑边距，平移后的结果 -->
        <g class="chart-area" transform="translate(20, 20)">

            <!-- 图形数据等存放区域 -->
            <g class="chart-data" clip-path="url(#clip-path)"></g>
        </g>
    </svg>

    <!-- 如果比较复杂的图形，可能会有多个 svg -->
    <svg class="chart-svg-other"></svg>

    <!-- 提示框(如果有的话) -->
    <div class="chart-tooltip chart-chord-tooltip"></div>
</div>
```

## SVG 结构设计

SVG边距最好留白，否则在绘制坐标轴的时候，可能会出现一些截断，因此参考了 Mike 的设计，参加下图。

![svg-convention.png](svg-convention.png)

边距设置默认为20，例如：

```js
let margin = {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20
};
```

因此，假如图形大小为 600 * 300，那么实际的绘图区域将是 560 * 260，绘图的起点是(20, 20)，同时可以使用 clip-path 等来对图形范围进行截断显示。

## 引入 Echarts 3

### 利

aaa.

### 弊

bbb.
