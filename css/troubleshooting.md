## 清除浮动

如果一个元素只包含浮动元素，高度会塌缩。这是因为浮动元素会脱离渲染流，导致包含元素表现为没有子元素。

```css
/**
 * For modern browsers
 * 1. The space content is one way to avoid an Opera bug when the
 *    contenteditable attribute is included anywhere else in the document.
 *    Otherwise it causes space to appear at the top and bottom of elements
 *    that are clearfixed.
 * 2. The use of `table` rather than `block` is only necessary if using
 *    `:before` to contain the top-margins of child elements.
 */
.clearfix:before,
.clearfix:after {
    content: " "; /* 1 */
    display: table; /* 2 */
}

.clearfix:after {
    clear: both;
}

/**
 * For IE 6/7 only
 * Include this rule to trigger hasLayout and contain floats.
 */
.clearfix {
    *zoom: 1;
}
```

## inline-block 空白间距

如果元素都是 inline-block，那么标签之间的空格也会占据一定空间。

一种解决方案是去掉标签之间的空格。

另一种方案是设置包含元素字体大小为0，在子元素重设字体大小。

另外，还可以通过设置 letter-spacing 和 negative margin 来实现。

## 参考资料

- https://tympanus.net/codrops/2013/07/17/troubleshooting-css/
