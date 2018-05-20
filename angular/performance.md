## Angular 项目性能优化策略

### 减少变更检测

- 使用 ChangeDetectionStrategy.OnPush
- 注入 ChangeDetectorRef，使用 detach/reattach、markForCheck、detectChanges 等方法

### ngFor 循环使用 trackBy

- 使用 trackBy 可以减少 DOM 的操作
- 注意 trackBy 需要返回的字段是唯一的

### 事件代码优化

- 事件中使用时间更优的算法
- 事件中的操作可以使用异步处理

### 使用 `preserveWhitespaces: false` 来优化模板大小

- 使用组件的 `preserveWhitespaces: false` 优化模板中的空格
- 因此需要注意模板中的空格如果用作内容，可能会有影响，需要注意



