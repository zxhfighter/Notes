# 模块

## 基本概念

模块是 Angular 应用的基本构建单元，同时提供了组件的编译环境。

模块一般按照特征功能来划分，例如核心模块，路由模块，表单模块等等。

一个应用一般有一个启动模块和多个特征模块，启动模块启动后，按需或者实时加载特征模块。

## 模块例子

```ts
import { NgModule } from '@angular/core';

@NgModule({

    // 声明属于该模块的指令、组件（带有模板的指令）和 Pipe
    // 注意：指令、组件或者 Pipe 只能属于一个模块
    declarations: [ MyComponent, MyDirective, MyPipe ]

    // 他山之石，可以攻玉
    // 引入别的模块，可以在模板中使用别的模块中 exports 的指令、组件和 Pipe
    imports: [ CommonModule, MaterialModule ]

    // 乐于奉献，成就他人，投桃报李
    // 声明别的模块导入该模块后，模板中能够使用的指令、组件和 Pipe
    // 注意：可以导出一个模块，这样可以实现导入模块的买一送一，级联导入
    exports: [ MyComponent, MyDirective, MyPipe, MaterialModule ]

    // 模块服务
    // 注意：模块定义的服务，会默认添加到全局的 injector 容器，因此你也可以在组件级别添加 providers
    // 组件级别的 providers 包括 providers 和 viewProviders
    providers: [
        DialogService,
        UserService,
        { provide: HeroService, useFactory: heroServiceFactory, deps: [ Logger, UserService ]}
    ],

    // 定义模块时要预先编译的组件，每个组件会提供一个 ComponentFactory，并存储在 ComponentFactoryResolver 中
    // 联想：组件中 forwardRef() 方法也可以声明预先编译的组件
    entryComponents: [ DialogComponent ],

    // 如果是启动根模块，定义需要启动的组件列表
    // 注意：这里列出的组件会自动添加到 entryComponents
    bootstrap: [ AppComponent ],

    // 不属于 Angular 指令的自定义元素和属性放这里，目前可选为： NO_ERRORS_SCHEMA 和 CUSTOM_ELEMENTS_SCHEMA
    schemas: [  ],

    // getModuleFactory 返回的唯一标志模块的名称或者路径
    id: ''
})
export class MyModule { }
```

