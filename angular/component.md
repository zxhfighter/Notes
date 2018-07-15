# 组件

## 基本概念

组件定义了页面中的基本视觉单元（view）。组件也是指令，不过相比指令，有自己的模板。

应用启动后，整个应用，从根组件开始会构建成一个组件树。

## 组件实例

```ts
import { Component } from '@angular/core';

@Component({

    // 组件选择符，符合 css selector 规范，可以是标签(app-root)，类(.app-root)，或者属性([app-root])等
    selector: 'app-root'

    // 组件输入属性，优先通过 @Input() 来定义
    inputs: [],

    // 组件输出属性（事件），优先通过 @Output() 来定义
    outputs: []

    // 组件服务
    providers: [ UserService ],

    // 在模板中通过模板变量赋值时使用，可以多个名称，用逗号分割
    // 例如在模板中 #rootComp = 'appRoot'
    exportAs: 'appRoot,root'

    // 定义宿主元素的 properties, attributes 和 events
    host: {
        'class': 'nb-widget nb-button-toggle',
        '[class.nb-button-toggle-checked]': 'checked',
        '[class.nb-button-toggle-disabled]': 'disabled',
        '(click)': 'onToggle()'
    },

    // 定义将注入组件的 queries
    queries: { },

    // ** 以上为 Directive 的属性，以下则为 Component 独有的属性配置 **

    // 内联模板
    template: '<div>{{ name }} </div>',

    // 外联模板，模板最终会编译成 JS 文件，因此在模板中只能引用组件的公共变量
    templateUrl: './app.component.html',

    // 内联样式
    styles: [ 'h1 { color: "red" }' ],

    // 外联样式
    styleUrls: [ './app.component.less' ],

    // 定义只有 View DOM children 才能使用的服务，Content DOM children 无法使用
    viewProviders: [],

    // 模板样式的封装方式，三种：
    // Emulated：通过属性模拟 scoped css
    // None：全局样式
    // Native：使用 shadow roots
    encapsulation: ViewEncapsulation.Emulated,

    // 组件变更检测方式，两种：
    // OnPush：只按需检测一次
    // Default：每次都检测
    changeDetection: ChangeDetectionStrategy.OnPush,

    // 动画，动画元素在模板中使用 [@heroState]="hero.state" 引用动画
    animations: [
        trigger('heroState', [
            state('inactive', style({
                backgroundColor: '#eee',
                transform: 'scale(1)'
            })),
            state('active',   style({
                backgroundColor: '#cfd8dc',
                transform: 'scale(1.1)'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ],

    // 插值表达式符号，默认为 `{{}}`
    interpolation: ['{{', '}}'],

    // 需要和组件一起编译的预定义组件
    entryComponents: [],

    // 是否保留模板中的多个空格，去掉空格可以大量节省模板体积
    // 默认为 false，即去掉空格，可以通过编译选项覆盖
    preserveWhitespaces: false
})
export class AppComponent {

}
```

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

## 组件交互

- @Input 和 @Output 交互
- setter 拦截
- ngOnChanges
- template reference variable
- ViewChild/ViewChildren，ContentChild/ContentChildren
- service
- observables
- ngrx

## angular styles

- encapsulation
- :host， ::ng-deep
- styles, styleUrls
- @import
- NgStyle，NgClass，[class.]="expression"，[style.font.em]="expression"
- less/sass support
- extern or global style files
