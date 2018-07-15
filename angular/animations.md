# animations

Angular 动画基于 [Web Animation API](https://w3c.github.io/web-animations/)，如果浏览器不支持 Web Animation API，会回退使用 CSS keyframes 动画（Angular 6+）。

因此，如果代码不依赖 [AnimationBuilder](https://angular.io/api/animations/AnimationBuilder)，之前依赖的polyfill  `web-animations-js` 也无需引用了。


## 引入

需要引入 `BrowserAnimationsModule` 模块。

```ts
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule ],
  // ... more stuff ...
})
export class AppModule { }
```

## 设置

```ts
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({

    animations: [
        trigger('heroState', [
            // 定义状态1
            state('inactive', style({
                backgroundColor: '#eee',
                transform: 'scale(1)'
            })),
            // 定义状态2
            state('active',   style({
                backgroundColor: '#cfd8dc',
                transform: 'scale(1.1)'
            })),
            // 状态变更，动画时长和渐变
            transition('inactive => active', animate('100ms ease-in')),
            // 状态变更，动画时长和渐变
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class AppComponent {

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
}
```

在模板中使用如下：

```html
<ul>
    <li *ngFor="let hero of heroes"
        [@heroState]="hero.state"
        (click)="hero.toggleState()">
      {{hero.name}}
    </li>
</ul>
```

如果动画一致，可以合并写法：

```ts
transition(
    'inactive => active, active => inactive',
    animate('100ms ease-out')
)
```

更简洁的写法如下：

```ts
transition('inactive <=> active', animate('100ms ease-out'))
```

还可以定义临时状态：

```ts
transition('inactive => active', [
  style({
    backgroundColor: '#cfd8dc',
    transform: 'scale(1.3)'
  }),
  animate('80ms ease-in', style({
    backgroundColor: '#eee',
    transform: 'scale(1)'
  }))
]),
```

通配符状态 `*`：

- active => *：从 active 状态到任何状态
- * => *：任何状态变更

void 状态：

- * => void：元素从 view 中移除时触发动画
- void => *：元素添加到 view 时触发动画

```ts
animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
]
```

进入和离开的别名：

```ts
transition(':enter', [ ... ]); // void => *
transition(':leave', [ ... ]); // * => void
```

单位，默认 px：

- '50px'
- '3em'
- '100%'

自动属性计算，有些属性需要运行时才能知道，此时使用 '*' 来代替。

```ts
animations: [
  trigger('shrinkOut', [
    state('in', style({height: '*'})),
    transition('* => void', [
      style({height: '*'}),
      animate(250, style({height: 0}))
    ])
  ])
]
```

时间：

100，'100ms'，'0.1s'

Wait for 100ms and then run for 200ms, with easing: '0.2s 100ms ease-out'

```ts
animations: [
  trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateX(0)'})),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.2s ease-in')
    ]),
    transition('* => void', [
      animate('0.2s 0.1s ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ])
]
```

keyframes 动画：

提供 offset 表明动画阶段。

```ts
animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(300, keyframes([
        style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
        style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
      ]))
    ])
  ])
]
```

使用分组动画：

```ts
animations: [
  trigger('flyInOut', [
    state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
    transition('void => *', [
      style({width: 10, transform: 'translateX(50px)', opacity: 0}),
      group([
        animate('0.3s 0.1s ease', style({
          transform: 'translateX(0)',
          width: 120
        })),
        animate('0.3s ease', style({
          opacity: 1
        }))
      ])
    ]),
    transition('* => void', [
      group([
        animate('0.3s ease', style({
          transform: 'translateX(50px)',
          width: 10
        })),
        animate('0.3s 0.2s ease', style({
          opacity: 0
        }))
      ])
    ])
  ])
]
```

## 动画回调

```ts
template: `
  <ul>
    <li *ngFor="let hero of heroes"
        (@flyInOut.start)="animationStarted($event)"
        (@flyInOut.done)="animationDone($event)"
        [@flyInOut]="'in'">
      {{hero.name}}
    </li>
  </ul>
`,
```

其中 $event 包含  fromState, toState and totalTime

see https://angular.io/guide/animations
