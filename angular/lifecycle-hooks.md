# lifecycle hooks

## 组件生命周期

Angular 提供了组件的各个生命周期钩子，以便完成特定的任务。

`constructor` 最早执行，此时还没法获取绑定的 `Input` 元素。

`ngOnChanges` 随后执行，此时携带 SimpleChanges 对象，包含 `currentValue` 和 `previousValue`，并且之后每次 `Input` 元素值变更后都会触发。需要注意的是，如果 `Input` 元素使用了 `setter`，那么 `setter` 会先执行，之后 SimpleChanges 对象的 `currentValue` 为 `setter` 执行之后的值。

`ngOnInit` 执行，此时 `Input` 元素已经被赋值了，只会执行一次，第一次 `ngOnChanges` 执行后触发。

`ngDoCheck`，检测 Angular 没法覆盖的事件变化，每次变更检测都会执行，因此需要严格审查该方法中的代码，尽量不要使用该生命周期，否则性能会大打折扣。在 `ngOnChanges()` 和 `ngOnInit` 后执行。

`ngAfterContentInit`，当 `<ng-content>` 元素内容被映射进来后触发，第一次 `ngDoCheck` 后触发一次。

`ngAfterContentChecked`，当 Angular 检测了 `<ng-content>` 中的组件后触发，第一次 `ngAfterContentInit` 和每次 `ngDoCheck` 后触发。

`ngAfterViewInit`，组件自身的 view 初始化完成后触发，第一次 `ngAfterContentChecked` 后触发。

`ngAfterViewChecked`，组件自身的 view 检查后触发，第一次 `ngAfterViewInit` 和每次的 `ngAfterContentChecked` 后触发。

`ngOnDestroy`，组件被销毁时触发，取消订阅 Observables，移除定时器，解绑事件等。

