# Angular 中的安全

## 最佳实践

- 时刻保持 Angualr 版本的更新
- 不要修改 Angular 本身版本代码
- 避免 Angular 文档中涉及到 *Security Risk* 的点

## XSS

XSS，跨站脚本攻击（cross-site scripting），欺骗用户通过 DOM 往页面插入有害内容，例如：

```
<script src="..."></script>
<img onerror="...">
<a href="javascript:...">
```

Angular 会将所有内容当做不可信内容，当 Angular 将属性、特性、样式、样式类、插值等内容插入模板时，会先进行清理和转义。

但是 Angular 会将模板自身当做可信内容，因此 Angular 的模板不能包含有用户输入。为了避免这种情况，可以使用离线模板编译功能，也被称作模板注入。


