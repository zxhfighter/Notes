# Angular 中的动态组件

有很多应用场景，我们需要动态生成组件，动态组件一般借助 `ComponentFactoryResolver` 服务来实现，之前需要了解一些先验知识。

## Embedded View 和 Host View

Angular 有一个概念叫做视图（View），视图由其引用对象（ViewRef）表示，其源码说明如下：

> A View is a fundamental building block of the application UI. It is the smallest grouping of Elements which are created and destroyed together.
>
> Properties of elements in a View can change, but the structure (number and order) of elements in a View cannot. Changing the structure of Elements can only be done by inserting, moving or removing nested Views via a {@link ViewContainerRef}. Each View can contain many View Containers.

也就是说，视图是应用UI的构建单元，里边的元素需要一同创建或者一同销毁。可以更改视图中元素的属性，但是如果要改变元素的数量和顺序，就只有通过视图容器（ViewContainerRef）进行插入、移动、移除等操作来实现。每个视图能够包含多个视图容器。

例如下边的模板：

```html
Count: {{items.length}}
<ul>
  <ng-template ngFor let-item [ngForOf]="items"></ng-template>
</ul>
```

会编译成：

```html
 <!-- ViewRef: outer-0 -->
 Count: 2
 <ul>
   <ng-template view-container-ref></ng-template>
   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 </ul>
 <!-- /ViewRef: outer-0 -->
```

视图又分为两种具体的类型：

- 一种是与模板（ng-template）关联的 **embedded view**
- 另一种是与组件关联的 **host view**

## 定义动态组件插入位置

一般推荐使用 `ng-container`，它不会生成额外的 HTML 元素。

```html
<ng-container #container></ng-container>
```

## 获取插入元素的 ViewContainerRef

上面提到过，在视图中要改变元素的数量和顺序，就只有通过视图容器（ViewContainerRef）来实现，因此我们需要获取插入元素的 ViewContainerRef。

```ts
export class AppComponent {
  @ViewChild('container', { read: ViewContainerRef }) _vc: ViewContainerRef;
}
```

上面通过了 `ViewChild` 的第二个参数设置，来获取元素的 ViewContainerRef。如果只是普通的 ElementRef 和 TemplateRef，`ViewChild` 可以自动推断，但是 ViewContainerRef 则需要显示指定。

## 注入 ComponentFactoryResolver 和 Injector

另外，需要注入 ComponentFactoryResolver 和 Injector 服务。

ComponentFactoryResolver 服务用来获取组件工厂创建方法，之后创建组件。但是应用中的组件必须要与一个 Injector 关联起来，因此也额外注入了当前组件的 Injector 服务。

```ts
export class AppComponent {
  constructor(private r: ComponentFactoryResolver, private injector: Injector) { }
}
```

## 创建动态组件

例如，我们需要动态创建一个 xdesign 中的 Button 组件。

```ts
import { ButtonComponent } from 'xdesign';

export class AppComponent implements AfterViewInit {
    // ...
    ngAfterViewInit() {

        // 创建一个 node 节点
        const node = document.createTextNode('click me !');

        // 解析组件工厂方法
        const buttonComponentFactory = this.r.resolveComponentFactory(ButtonComponent);

        // 工厂方法创建组件，关联 injector，并且注入 <ng-content> 中的内容
        const buttonComponent = buttonComponentFactory.create(this.injector, [[node]]);

        // 可以通过 `instance` 来获取组件实例，动态更改组件的属性，监听 Output 的事件等
        buttonComponent.instance.theme = 'default';

        // 获取 ComponentRef 的 host view
        const buttonComponentHostView = buttonComponent.hostView;

        // 通过 ViewContainerRef 插入 host view
        this._vc.insert(buttonComponentHostView);
    }
}
```

## 不要忘记修改 entryComponents

需要动态创建的组件，需要事先添加到模块或者组件的 `entryComponents` 属性中，这样才能保证动态组件编译进最终的代码，并且保证组件之间的正确依赖关系。

## 更方便的 ngComponentOutlet

正如使用 `ngTemplateOutlet` 可以省去模板视图之间的手动创建和管理问题，使用 `ngComponentOutlet` 指令也可以省去手动创建节点，获取 ViewContainerRef 和插入的相关代码。

一个例子如下：

```ts
// Greeter 服务
@Injectable()
class Greeter {
  suffix = '!';
}

// 需要动态创建的组件，模板中有俩 ng-content，还额外引入了一个 Greeter 服务
@Component({
  selector: 'complete-component',
  template: `Complete: <ng-content></ng-content> <ng-content></ng-content>{{ greeter.suffix }}`
})
class CompleteComponent {
  constructor(public greeter: Greeter) {}
}

// 主组件
@Component({
  selector: 'ng-component-outlet-complete-example',
  template: `
    <ng-container *ngComponentOutlet="CompleteComponent;
                                      injector: myInjector;
                                      content: myContent"></ng-container>`
})
class NgTemplateOutletCompleteExample {
  // This field is necessary to expose CompleteComponent to the template.
  CompleteComponent = CompleteComponent;
  myInjector: Injector;

  myContent = [[document.createTextNode('Ahoj')], [document.createTextNode('Svet')]];

  constructor(injector: Injector) {
    this.myInjector = ReflectiveInjector.resolveAndCreate([Greeter], injector);
  }
}
```

另外，可以直接使用 `ViewContainerRef` 对象的 `createComponent` 方法来动态创建组件。

```ts
let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
let viewContainerRef = this.adHost.viewContainerRef; // adHost is <ng-template>
viewContainerRef.clear();

let componentRef = viewContainerRef.createComponent(componentFactory);
(<AdComponent>componentRef.instance).data = adItem.data;
```

## 参考资料

- https://angular.io/guide/dynamic-component-loader
- https://angular.io/api/common/NgComponentOutlet
- https://blog.angularindepth.com/exploring-angular-dom-abstractions-80b3ebcfc02
