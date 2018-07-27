# 状态组件和无状态组件

状态（Stateful），一般是应用或者组件中在内存中存储的数据，并且这些数据会随着时间而变（例如用户操作）。

无状态（Stateless），应用或者组件会消费某些数据，但是从来不会去改变这些数据。并且对于同样的输入，会得到同样的渲染结果。

将状态和无状态的概念应用到组件，就得到了状态组件和无状态组件。

另外，为了辅助思考，可以将状态组件和无状态组件，分别与非纯函数（impure function）和纯函数（pure function）进行对比。

- impure function == stateful component
- pure function == stateless component

## 纯函数

纯函数，是幂等的，对于每个相同的输入，输出是不变的。

纯函数易于测试和复用。

```ts
const getBMI = (weight, height) => {
  let newWeight = parseInt(weight, 10);
  let newHeight = parseInt(height, 10);
  return (newWeight / (newHeight /100 * newHeight / 100)).toFixed(1);
};
```

## 非纯函数

非纯函数，依赖输入的状态，相同的输入获得的结果不一定相同。

```ts
const getTime = () => {
    return Date.now();
}
```

## 状态组件

一个状态组件一般有如下特点：

- 存在函数，处理状态变更
- 提供数据（例如从 HTTP 层）
- 从路由层获取初始数据

一般状态组件会有多个无状态组件构成，当然也有可能有状态组件。

```ts
import { Component, OnInit } from '@angular/core';
import { TodoService } from './todo.service';

@Component({
  selector: 'todos',
  template: `
  <div>
    <todo-form
      (onAdd)="addTodo($event)">
    </todo-form>
    <todo-list
      [todos]="todos"
      (onComplete)="completeTodo($event)"
      (onDelete)="removeTodo($event)">
    </todo-list>
  </div>
  `
})
export class TodosComponent implements OnInit {
  todos: any[];
  constructor(private todoService: TodoService) {}
  ngOnInit() {
    this.todos = this.todoService.getTodos();
  }
  addTodo({label}) {
    this.todos = [{label, id: this.todos.length + 1}, ...this.todos];
  }
  completeTodo({todo}) {
    this.todos = this.todos.map(
      item => item.id === todo.id ? Object.assign({}, item, {complete: true}) : item
    );
  }
  removeTodo({todo}) {
    this.todos = this.todos.filter(({id}) => id !== todo.id);
  }
}
```

## 无状态组件

无状态组件具有如下特点：

- 不请求数据
- 通过属性传递接受数据
- 通过事件输出数据
- 渲染子组件（无状态或者有状态）
- 允许包含内部的 UI 状态

```ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'todo-form',
  template: `
  <form (ngSubmit)="submit()">
    <input name="label" [(ngModel)]="label">
    <button type="submit">Add todo</button>
  </form>
  `
})
export class TodoFormComponent {
  label: string;
  @Output() onAdd = new EventEmitter();
  submit() {
    if (!this.label) return;
    this.onAdd.emit({label: this.label});
    this.label = '';
  };
}
```

TODO列表也是一个无状态组件。

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'todo-list',
  template: `
  <ul>
    <li *ngFor="let todo of todos">
      <todo
        [item]="todo"
        (onChange)="onComplete.emit($event)"
        (onRemove)="onDelete.emit($event)">
      </todo>
    </li>
  </ul>
  `
})
export class TodoListComponent {
  @Input() todos;
  @Output() onComplete = new EventEmitter();
  @Output() onDelete = new EventEmitter();
}
```