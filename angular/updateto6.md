node > 8.9 npm > 5.6
rm -rf node_modules
rm package-lock.json
npm i

1. less 中不支持 `~` 路径引用了

```less
// bofore
@import '~xdesign/asset/less/index';

// after
@import '../../../../../node_modules/xdesign/asset/less/index';
```

2. rxjs 所有类型，创建方法，帮助类型都直接从 `rxjs` 引用，所有操作符都直接从 `rxjs/operators` 引用

```ts
// before
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

// after
import { Observable, Subscription, of, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
```

3. rxjs 不支持 chain 操作，都需要使用 pipe 操作

```ts
//before
Observable.of(1, 2, 3)
    .filter(x => x % 2 === 0)
    .map(x => x + x)
    .subscribe(console.log);

// after
of(1, 2, 3).pipe(
    filter(x => x % 2 === 0),
    map(x => x + x)
).subscribe(console.log);
```

4. tree-shakable providers

```ts
// before
@NgModule({
    providers: [ UserService ]
})

// after
@Injectable({
    providedIn: 'root';
})
export class UserService {

}

@NgModule({
    providers: []
})
```

5. ElementRef is now more strictly typed

```ts
@ViewChild('loginInput') loginInput: ElementRef<HTMLInputElement>;
this.loginInput.nativeElement.focus();
```

6. Angular Elements allow to wrap angular components as standard web components, you can then embed them in non-Angular applications.

```ts
@Component({
    selector: 'ns-pony',
    template: `<p>{{ ponyName }}</p>`
})
export class PonyComponent {
    @Input() ponyName: string;
}
```

```ts
import { createCustomElement } from '@angular/elements';
platformBrowserDynamic().bootstrapModule(PonyModule)
    .then({ injector }) => {
        const PonyElement = createCustomElement(PonyComponent, { injector });
        customElements.define('ns-pony', PonyElement);
    }
```

see https://angular-elements.firebaseapp.com/
see https://ng-embedded-test.firebaseapp.com/progress-bars.html

7. Ivy Render(new template compiler), faster, smaller

```ts
'angularCompilerOptions': {
    'enableIvy': true
}
```

8. Angular Material/CDK updated to 6, add tree, table, drag-drop

9. Http Related, allow HttpInterceptors to Inject HttpClient

```ts
@deprecated
'@angular/http' => '@angular/common/http'
Http => HttpClient
HttpModule => HttpClientModule
```

10. Improved Angular Universal, Improved App Shell Support

11. improved Angular CLI, schematics（ng add, ng generate）
