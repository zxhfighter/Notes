# Angular 表单

## 模板驱动表单

第一步：导入 `FormsModule`，该模块提供了所有模块驱动表单的指令和组件等，例如 `ngModel`。

```ts
import {FormsModule} from '@angular/forms';
```

第二步：定义表单模型类。

```ts
export class Hero {
    constructor(
        public id: number,
        public name: string,
        public power: string,
        public alterEgo?: string
    ) {}
}
```

第三步：创建一个 form 表单。

```html
<div class="container">
    <h1>Hero Form</h1>
    <form (ngSubmit)="onSubmit()" #heroForm="ngForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" required
            [(ngModel)]="model.name" name="name" #name="ngModel">

        <div [hidden]="name.valid || name.pristine"
            class="alert alert-danger">
            Name is required
        </div>
      </div>

      <div class="form-group">
        <label for="alterEgo">Alter Ego</label>
        <input type="text" class="form-control" id="alterEgo"
            [(ngModel)]="model.alterEgo" name="alterEgo">
      </div>

      <div class="form-group">
        <label for="power">Hero Power</label>
        <select class="form-control" id="power" required
            [(ngModel)]="model.power" name="power">
            <option *ngFor="let pow of powers" [value]="pow">{{pow}}</option>
        </select>
      </div>

      <button type="submit" class="btn btn-success" [disabled]="!heroForm.form.valid">Submit</button>


    </form>
</div>
```

表单中的 `required` 为 HTML5 的属性，如果不想使用，可以在 `form` 标签上使用 `novalidate` 属性禁用掉。

如果你引入了 FormsModel，`form` 标签会自动转化为 `NgForm` 指令，因此如果你使用模板变量引用它（暴露变量名(exportAs )为 `ngForm`），可以使用 `NgForm` 的所有属性和方法。`NgForm` 为一个顶层的 `FormGroup` 实例，用来绑定到某个表单追踪表单的值和验证状态。

`FormGroup` 和 `FormControl`，以及 `FormArray` 为创建表单应用的三驾马车。

需要注意的是，如果使用 `[(ngModel)]` 双向绑定，必须提供 `name` 属性。事实上，如果你希望 `NgForm` 指令管理表单控件，都必须要提供 `name` 属性，作为 `FormControl` 的键。



## 模型驱动表单(响应式表单)

- 需引入 FormsModule 模块
- 可以考虑使用 bootstrap 来给表单添加样式
- 表单使用 [(ngModel)] 时，必须要定义 name 属性
- NgModelChange 并不是 `<input>` 元素的事件。它实际上是来自 NgModel 指令的事件属性。当 Angular 在表单中看到[(x)]的绑定目标时， 它会期待这个x指令有一个名为x的输入属性，和一个名为xChange的输出属性。
- touched-untouched（被访问过），dirty-pristine（被修改过），valid-invalid（有效的）。
- #name="ngModel" #heroForm="ngForm" exportAs
- HTML attribute value指定了初始值；DOM value property 是当前值。
- 在 Angular 的世界中，attribute 唯一的作用是用来初始化元素和指令的状态。 当进行数据绑定时，只是在与元素和指令的 property 和事件打交道，而 attribute 就完全靠边站了。

```html
<div [hidden]="true"></div>
```
