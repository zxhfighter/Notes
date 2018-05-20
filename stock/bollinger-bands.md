# 布林带

## 什么是布林带

布林带（BB，bollinger bands）指标属于 K 线应用的一种，用于衡量近期股价的波动性（volatility）。

布林带结合了移动平均线（MA，moving averages）和标准差（standard deviations），有三个组成部分：

PS: 标准差应用于投资上，可作为量度回报稳定性的指标。标准差数值越大，代表回报远离过去平均数值，回报较不稳定故风险越高。相反，标准差数值越小，代表回报较为稳定，风险亦较小。

![2个标准差占据95%](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Standard_deviation_diagram.svg/350px-Standard_deviation_diagram.svg.png)

* 移动平均线：默认为 20 个周期的简单移动平均线（SMA, simple moving average）
* 布林带上轨：离移动平均线 2 个标准差的上方（20 个周期的收盘价参与计算）
* 布林带下轨：离移动平均线 2 个标准差的下方

看一个标普 500 的例子。

![img](http://www.onlinetradingconcepts.com/images/technicalanalysis/BollingerBandsESbasics.gif)

布林带会保证尽可能多的收盘价都落在布林带的上轨和下轨之间。

## 布林带的应用

布林带主要有三种用途。

### 简单的买入和卖出信号

基于绝大多数收盘价落在布林带上轨和下轨之间，会趋于 20 日平均线的假设，如果某个周期的股价刺穿了上轨或者下轨，那么就是一个潜在的卖出或者买入信号。

激进一点，可以在当个周期刺穿后，第二天就进行操作，不过风险较大，因为**布林带上轨和下轨并没有阻力和支撑的概念**，刺穿后接下来可能会出现多个刺穿（一般此时会有明显的上升和下降趋势）。

保守一点，可以等待一两天，当出现预期的回调时，再进行操作，不过此时会损失一部分机会和利润。

但是，这种简单的买入和卖出位置并不可靠！

### 引入支撑和阻力的买入和卖出信号

举例来说，如果股价（收盘价）刺穿了下轨，同时当前股价打破了之前的支撑（例如创了新低），那么此时并不是一个明智的买入信号。

如果股价刺穿了上轨，但是同时还打破了支撑的阻力（例如创了新高），那么股价很有可能继续上涨，此时也不适合进行卖空操作。

看个 WMT 的例子。

![img](http://www.onlinetradingconcepts.com/images/technicalanalysis/BollingerBandsWMTbreakouts.gif)

另外，在比较明显的上涨和下降趋势中，布林带可以用来显示强趋势。

如果股价持续上涨，那么股价大多数都位于布林带上轨和移动平均线之间，同时移动平均线用作支撑；相反如果股价持续下跌，那么股价大多数位于布林带下轨和移动平均线之间，同时移动平均线用作阻力。

![img](http://www.onlinetradingconcepts.com/images/technicalanalysis/BollingerBandsEStrending.gif)

### 用布林带发现波动率

在期权交易中，期权的价格受波动率影响，因此可以利用布林带寻找波动率的高点和低点。

* 在低波动率处购买期权，同时在高价的时候卖出
* 在高波动率处卖出期权，同时在底价的时候买入

如果一个布林带急剧收缩，说明股价刚刚经历了一次大的波动，目前进入波动的尾声，趋于平稳，此时的波动率会比较低，此时适合买入期权。

如果一个布林带急剧膨胀，说明股价会有一个较大的波动（无法预测上涨和下跌），此时波动率会比较高，此时适合卖出期权。

## 实战

单独使用 Bollinger Bands 无法得出有效结论（除了最基本的波动率外），可以结合肯特纳通道指标，步骤如下：

1. 打开 https://www.tradingview.com，输入 JD 进入图表区域。
2. 关闭其它指标，选择 Indicators - Bollinger Bands
3. 设置布林带参数，关闭 Basis 均线，周期长度选择 21，标准差选择 2 个标准差，加粗曲线
4. 选择 Indicators - Keltner Channels
5. 设置肯特纳通道，关闭 Basis 和 Background，周期长度选择 21，标准差选择 2 个标准差，加粗曲线

仔细观察曲线，结论如下：

1. 如果布林带上轨进入肯特纳通道，说明将来一段时间股价波动性不会太大
2. 如果布林带上轨出了肯特纳通道，说明将来一段时间股价波动性会很剧烈

# [Bollinger Band®](http://www.investopedia.com/terms/b/bollingerbands.asp)

What is a 'Bollinger Band®'

A Bollinger Band®, developed by famous technical trader John Bollinger, is plotted two standard deviations away from a simple moving average.

In this example of Bollinger Bands®, the price of the stock is bracketed by an upper and lower band along with a 21-day simple moving average. Because standard deviation is a measure of volatility, when the markets become more volatile, the bands widen; during less volatile periods, the bands contract.

BREAKING DOWN 'Bollinger Band®'

Bollinger Bands® are a highly popular technical analysis technique. Many traders believe the closer the prices move to the upper band, the more overbought the market, and the closer the prices move to the lower band, the more oversold the market. John Bollinger has a set of 22 rules to follow when using the bands as a trading system.

Want to know more? Read The Basics of Bollinger Bands

The Squeeze

The squeeze is the central concept of Bollinger Bands®. When the bands come close together, constricting the moving average, it is called a squeeze. A squeeze signals a period of low volatility and is considered by traders to be a potential sign of future increased volatility and possible trading opportunities. Conversely, the wider apart the bands move, the more likely the chance of a decrease in volatility and the greater the possibility of exiting a trade. However, these conditions are not trading signals. The bands give no indication when the change may take place or which direction price could move.

Breakouts

Approximately 90% of price action occurs between the two bands. Any breakout above or below the bands is a major event. The breakout is not a trading signal. The mistake most people make is believing that that price hitting or exceeding one of the bands is a signal to buy or sell. Breakouts provide no clue as to the direction and extent of future price movement.

Not a Standalone System

Bollinger Bands® are not a standalone trading system. They are simply one indicator designed to provide traders with information regarding price volatility. John Bollinger suggests using them with two or three other non-correlated indicators that provide more direct market signals. He believes it is crucial to use indicators based on different types of data. Some of his favored technical techniques are moving average divergence/convergence (MACD), on-balance volume（OBV） and relative strength index (RSI).

The bottom line is that Bollinger Bands® are designed to discover opportunities that give investors a higher probability of success.

# The Basics Of Bollinger Bands®

In the 1980s, John Bollinger, a long-time technician of the markets, developed the technique of using a moving average with two trading bands above and below it. Unlike a percentage calculation from a normal moving average, Bollinger Bands® simply add and subtract a standard deviation calculation.

Standard deviation is a mathematical formula that measures volatility, showing how the stock price can vary from its true value. By measuring price volatility, Bollinger Bands® adjust themselves to market conditions. This is what makes them so handy for traders: they can find almost all of the price data needed between the two bands. Read on to find out how this indicator works, and how you can apply it to your trading.(For more on volatility, see Tips For Investors In Volatile Markets.)

What's a Bollinger Band®?

Bollinger Bands® consist of a center line and two price channels (bands) above and below it. The center line is an exponential moving average; the price channels are the standard deviations of the stock being studied. The bands will expand and contract as the price action of an issue becomes volatile (expansion) or becomes bound into a tight trading pattern (contraction). (Learn about the difference between simple and exponential moving averages by checking out Moving Averages: What Are They?)

A stock may trade for long periods in a trend, albeit with some volatility from time to time. To better see the trend, traders use the moving average to filter the price action. This way, traders can gather important information about how the market is trading. For example, after a sharp rise or fall in the trend, the market may consolidate, trading in a narrow fashion and criss-crossing above and below the moving average. To better monitor this behavior, traders use the price channels, which encompass the trading activity around the trend.

We know that markets trade erratically on a daily basis even though they are still trading in an uptrend or downtrend. Technicians use moving averages with support and resistance lines to anticipate the price action of a stock. Upper resistance and lower support lines are first drawn and then extrapolated to form channels within which the trader expects prices to be contained. Some traders draw straight lines connecting either tops or bottoms of prices to identify the upper or lower price extremes, respectively, and then add parallel lines to define the channel within which the prices should move. As long as prices do not move out of this channel, the trader can be reasonably confident that prices are moving as expected.

When stock prices continually touch the upper Bollinger Band®, the prices are thought to be overbought; conversely, when they continually touch the lower band, prices are thought to be oversold, triggering a buy signal.

When using Bollinger Bands®, designate the upper and lower bands as price targets. If the price deflects off the lower band and crosses above the 20-day average (the middle line), the upper band comes to represent the upper price target. In a strong uptrend, prices usually fluctuate between the upper band and the 20-day moving average. When that happens, a crossing below the 20-day moving average warns of a trend reversal to the downside. (For more about gauging an asset's direction and profiting from it, see Track Stock Prices With Trendlines.)
