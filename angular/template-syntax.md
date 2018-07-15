# template syntax

- interpolation
- template expression
- template statements
- template Microsyntax(the sugar asterisk (*) syntax)

```html
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```

- html attributes VS dom properties
- template input variable VS template reference variable
- binding syntax（property binding, event binding, two-way binding）
- attribute binding
- view child VS content child
- one-time string initialization
- Property binding or interpolation?
- $event
- @Input and @Output
- Custom events with EventEmitter
- Two-way binding `[(...)]`
- builtin attribute directives（NgModel，NgStyle，NgClass）
- Built-in structural directives（NgForOf，NgIf，NgSwitch）
- NgModel - Two-way binding to form elements with [(ngModel)]
- emplate expression operators: `|`，`?.`，`!.`
- The $any type cast function `$any(<expression>)`
- ng-content
- ng-container
- ng-template, ngTemplateOutlet，NgComponentOutlet
- ViewContainerRef, TemplateRef，ElementRef，ViewRef，EmbeddedViewRef， ComponentRef，ModuleRef

```ts
@Injectable()
class Greeter {
  suffix = '!';
}

@Component({
  selector: 'complete-component',
  template: `Complete: <ng-content></ng-content> <ng-content></ng-content>{{ greeter.suffix }}`
})
class CompleteComponent {
  constructor(public greeter: Greeter) {}
}

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

