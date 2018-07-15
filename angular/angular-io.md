# angular.io 官网变更

- angular-cli is becoming important
- learn schematics, `ng generate`, `ng new`, `ng add` use schematics

> You can add pre-packaged functionality to a new project by using the ng add command. The ng add command transforms a project by applying the schematics in the specified package. For more information, see the Angular CLI documentation.

```shell
$ ng add @angular/material
$ ng generate @angular/material:material-nav --name main-nav
```

- `@Injectable` params, makes it tree-shakable

```ts
import { AppModule } from './app.module';
@Injectable({
  providedIn: 'root' | AppModule
})
```

When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an app by removing the service if it turns out not to be used after all.

generate a service in some module.

```shell
$ ng generate service hero --module=app
```

- get data in the OnInit lifecycle, not in the constructor, Reserve the constructor for simple initialization such as wiring constructor parameters to properties.

- rxjs 6 import things from two places:

1. types, helpers, creation from 'rxjs'
2. operators from 'rxjs/operators'

- `Observable.of()` transforms some value  intoObservables

- `HttpClient.get<Hero[]>()` which also returns an `Observable<Hero[]>` that emits a single value

- observable is lasy excuted, only excute when it is subscribed, If you neglect to subscribe(), the service will not send the delete request to the server! As a rule, an Observable does nothing until something subscribes!

- a service or property must be public when your are about to bind to it in the template（because angular compiles(like ivy) template into another class, so it cannot get private properties from the component class）

- The messageService property must be public because you're about to bind to it in the template. Angular only binds to public component properties.

- RouterModule(forRoot, forChild), Route(path, component, redirectTo, loadChildren), `[routerLink]`, `<router-outlet></router-outlet>`, activatedRoute, Router
- get router param（params -- queryParams, paramMap -- queryParamMap）

```ts
const id = +this.route.snapshot.paramMap.get('id');
```

- The method（`RouterModule.forRoot(routes)`） is called forRoot() because you configure the router at the application's root level. The forRoot() method supplies the service providers and directives needed for routing, and performs the initial navigation based on the current browser URL.

- HttpClient is Angular's new mechanism for communicating with a remote server over HTTP. `@angular/http` will be deprecated and move to `@angular/common/http`

- Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with the RxJS map operator.

```ts
// 1. imports HttpClientModule
// 2. import { HttpClient, HttpHeaders } from '@angular/common/http';
// 3. inject private http: HttpClient,
// 4. this.http.get<Hero[]>(this.heroesUrl)
```

- In general, an observable can return multiple values over time. An observable from HttpClient always emits a single value and then completes, never to emit again.

- rxjs 6.0 some operator names changed(do -> tap, catch -> catchError, switch -> switchAll, finnaly -> finalize)

```ts
// before
import { catch, map, do } from 'rxjs/operators';

// now
import { catchError, map, tap } from 'rxjs/operators';
```

- To catch errors, you "pipe" the observable result from http.get() through an RxJS catchError() operator. Import the catchError symbol from rxjs/operators, along with some other operators you'll need later.

```ts
import { catchError, map, tap } from 'rxjs/operators';

getHeroes (): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      // do 重命名成 tap，做一些操作，原封不动返回原来的流
      tap(heroes => this.log(`fetched heroes`)),

      // catch 由于与关键词冲突，重命名为 catchError
      catchError(this.handleError('getHeroes', []))
    );
}

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
```

- the RxJS tap operator, which looks at the observable values, does something with those values, and passes them along. The tap call back doesn't touch the values themselves.

- put data

```ts
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

this.http.put(this.heroesUrl, hero, httpOptions).pipe(
  // not interested in the result, use _ instead
  tap(_ => this.log(`updated hero id=${hero.id}`)),
  catchError(this.handleError<any>('updateHero'))
);
```

- post data

```ts
this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
  tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
  catchError(this.handleError<Hero>('addHero'))
);
```

- delete data

```ts
this.http.delete<Hero>(url, httpOptions).pipe(
  tap(_ => this.log(`deleted hero id=${id}`)),
  catchError(this.handleError<Hero>('deleteHero'))
);
```

- search term pattern

```ts
import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
```

- switchMap() preserves the original request order while returning only the observable from the most recent HTTP method call. Results from prior calls are canceled and discarded.

Note that canceling a previous searchHeroes() Observable doesn't actually abort a pending HTTP request. Unwanted results are simply discarded before they reach your application code.

- The AsyncPipe subscribes to an Observable automatically so you won't have to do so in the component class.
- Remember that the component class does not subscribe to the heroes$ observable. That's the job of the AsyncPipe in the template.

- Observables and event processing: How to use observables with components and services to publish and subscribe to messages of any type, such as user-interaction events and asynchronous operation results.

- Server-side Rendering: Angular Universal generates static application pages on the server through server-side rendering (SSR). This allows you to run your Angular app on the server in order to improve performance and show the **first page** quickly on mobile and low-powered devices, and also facilitate web crawlers.

- Service Workers: A service worker is a script that runs in the web browser and **manages caching for an application**. Service workers function as a network proxy. They intercept outgoing HTTP requests and can, for example, deliver a cached response if one is available. You can significantly improve the user experience by using a service worker to reduce dependency on the network. Service Workers is the key tech to PWA（Progressive Web Applications）。

- Animations: Animate component behavior without deep knowledge of animation techniques or CSS with Angular's animation library.

- Internationalization: Angular's internationalization (i18n) tools can help you make your app available in multiple languages.

- a11y，accessbility。

- Security guidelines: Learn about Angular's built-in protections against common web-app vulnerabilities and attacks such as cross-site scripting attacks.

- Docker

- Material Libaray

- More precisely, the redisplay occurs after some kind of asynchronous event related to the view, such as a keystroke, a timer completion, or a response to an HTTP request. Angular uses Zone to monkey-patch this async event.

- Though this is not exactly true. Interpolation is a special syntax that Angular converts into a property binding, as is explained below.

- As with expressions, avoid writing complex template statements. A method call or simple property assignment should be the norm.

- Attributes are defined by HTML. Properties are defined by the DOM (Document Object Model).

A few HTML attributes have 1:1 mapping to properties. id is one example.

Some HTML attributes don't have corresponding properties. colspan is one example.

Some DOM properties don't have corresponding attributes. textContent is one example.

Attributes initialize DOM properties and then they are done. Property values can change; attribute values can't.

This fact bears repeating: Template binding works with properties and events, not attributes.

You must use attribute binding when there is no element property to bind.

```html
<tr><td colspan="{{1 + 1}}">Three-Four</td></tr>
<tr><td [attr.colspan]="1 + 1">Three-Four</td></tr>
```

- While this is a fine way to toggle a single class name, the NgClass directive is usually preferred when managing multiple class names at the same time.

- While this is a fine way to set a single style, the NgStyle directive is generally preferred when setting several inline styles at the same time.

- The shape of the event object is determined by the target event. If the target event is a native DOM element event, then $event is a DOM event object, with properties such as target and target.value.

- If the event belongs to a directive (recall that components are directives), $event has whatever shape the directive decides to produce.

- The [(x)] syntax is easy to demonstrate when the element has a settable property called x and a corresponding event named xChange.

```html
<app-sizer [(size)]="fontSizePx"></app-sizer>
<app-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></app-sizer>
```

- The details are specific to each kind of element and therefore the NgModel directive only works for an element supported by a ControlValueAccessor that adapts an element to this protocol. The <input> box is one of those elements. Angular provides value accessors for all of the basic HTML form elements and the Forms guide shows how to bind to them.

You can't apply [(ngModel)] to a non-form native element or a third-party custom component until you write a suitable value accessor, a technique that is beyond the scope of this guide.

- Angular can avoid this churn with trackBy. Add a method to the component that returns the value NgForOf should track. In this case, that value is the hero's id.

```html
<div *ngFor="let hero of heroes; trackBy: trackByHeroes">
  ({{hero.id}}) {{hero.name}}
</div>
```

```ts
trackByHeroes(index: number, hero: Hero): number { return hero.id; }
```

- If Angular hadn't taken it over when you imported the FormsModule, it would be the HTMLFormElement. The heroForm is actually a reference to an Angular NgForm directive with the ability to track the value and validity of every control in the form.

- You can always bind to a public property of a component in its own template. It doesn't have to be an Input or Output property

- The Angular compiler won't bind to properties of a different component unless they are Input or Output properties.

- All data bound properties must be TypeScript public properties. Angular never binds to a TypeScript private property.

- The safe navigation operator ( ?. ) and null property paths（!.）

- Sometimes a binding expression will be reported as a type error and it is not possible or difficult to fully specify the type. To silence the error, you can use the $any cast function to cast the expression to the any type.

```html
<!-- Accessing an undeclared member -->
<div>
  The hero's marker is {{$any(hero).marker}}
</div>
```

- constructor

- ngOnChanges()

Respond when Angular (re)sets data-bound input properties. The method receives a SimpleChanges object of current and previous property values.

Called before ngOnInit() and whenever one or more data-bound input properties change.

- ngOnInit()

Initialize the directive/component after Angular first displays the data-bound properties and sets the directive/component's input properties.

Called once, after the first ngOnChanges().

- ngDoCheck()

Detect and act upon changes that Angular can't or won't detect on its own.

Called during every change detection run, immediately after ngOnChanges() and ngOnInit().

- ngAfterContentInit()

Respond after Angular projects external content into the component's view / the view that a directive is in.

Called once after the first ngDoCheck().

- ngAfterContentChecked()

Respond after Angular checks the content projected into the directive/component.

Called after the ngAfterContentInit() and every subsequent ngDoCheck().

- ngAfterViewInit()

Respond after Angular initializes the component's views and child views / the view that a directive is in.

Called once after the first ngAfterContentChecked().

- ngAfterViewChecked()

Respond after Angular checks the component's views and child views / the view that a directive is in.

Called after the ngAfterViewInit and every subsequent ngAfterContentChecked().

- ngOnDestroy()

Cleanup just before Angular destroys the directive/component. Unsubscribe Observables and detach event handlers to avoid memory leaks.

Called just before Angular destroys the directive/component.

Remember also that a directive's data-bound input properties are not set until after construction. That's a problem if you need to initialize the directive based on those properties. They'll have been set when ngOnInit() runs.

The ngOnChanges() method is your first opportunity to access those properties. Angular calls ngOnChanges() before ngOnInit() and many times after that. It only calls ngOnInit() once.

`OnDesctroy()` This is the place to free resources that won't be garbage collected automatically. Unsubscribe from Observables and DOM events. Stop interval timers. Unregister all callbacks that this directive registered with global or application services. You risk memory leaks if you neglect to do so.

Content projection is a way to import HTML content from outside the component and insert that content into the component's template in a designated spot.

Recall that Angular calls both AfterContent hooks before calling either of the AfterView hooks. Angular completes composition of the projected content before finishing the composition of this component's view. There is a small window between the AfterContent... and AfterView... hooks to modify the host view.

Then Angular calls the ngAfterViewInit lifecycle hook at which time it is too late to update the parent view's display of the countdown seconds. Angular's unidirectional data flow rule prevents updating the parent view's in the same cycle. The app has to wait one turn before it can display the seconds.

An element that would be a shadow DOM host in native encapsulation has a generated _nghost attribute. This is typically the case for component host elements.

An element within a component's view has a _ngcontent attribute that identifies to which host's emulated shadow DOM this element belongs.

```html
<hero-details _nghost-pmm-5>
  <h2 _ngcontent-pmm-5>Mister Fantastic</h2>
  <hero-team _ngcontent-pmm-5 _nghost-pmm-6>
    <h3 _ngcontent-pmm-6>Team</h3>
  </hero-team>
</hero-detail>
```

Angular elements are Angular components packaged as custom elements, a web standard for defining new HTML elements in a framework-agnostic way.

Custom elements are a Web Platform feature currently supported by Chrome, Opera, and Safari, and available in other browsers through polyfills (see Browser Support). A custom element extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code. The browser maintains a CustomElementRegistry of defined custom elements (also called Web Components), which maps an instantiable JavaScript class to an HTML tag.

We are working on custom elements that can be used by web apps built on other frameworks. A minimal, self-contained version of the Angular framework will be injected as a service to support the component's change-detection and data-binding functionality. For more about the direction of development, check out this video presentation.


- host view, component view, embedded view
- Views are typically arranged hierarchically, allowing you to modify or show and hide entire UI sections or pages as a unit. The template immediately associated with a component defines that component's **host view**. The component can also define a view hierarchy, which contains **embedded views**, hosted by other components.
- A view hierarchy can include views from components in the same NgModule, but it also can (and often does)  includeviews from components that are defined in different NgModules.

- The injector is the main mechanism. You don't have to create an Angular injector. Angular creates an application-wide injector for you during the bootstrap process.
- The injector maintains a container of dependency instances that it has already created, and reuses them if possible.
- A provider is a recipe for creating a dependency.
- When Angular discovers that a component depends on a service, it first checks if the injector already has any existing instances of that service. If a requested service instance does not yet exist, the injector makes one using the registered provider, and adds it to the injector before returning the service to Angular.
- When all requested services have been resolved and returned, Angular can call the component's constructor with those services as arguments.

- The [(x)] syntax is easy to demonstrate when the element has a settable property called x and a corresponding event named xChange. Here's a SizerComponent that fits the pattern. It has a size value property and a companion sizeChange event:

Clearly the two-way binding syntax is a great convenience compared to separate property and event bindings.

- Angular processes all data bindings once per JavaScript event cycle, from the root of the application component tree through all child components.

- Angular templates are dynamic. When Angular renders them, it transforms the DOM according to the instructions given by directives. There are two kinds of directives besides components: structural and attribute directives.

It would be convenient to use two-way binding with HTML form elements like `<input>` and `<select>`. However, no native HTML element follows the x value and xChange event pattern.

Fortunately, the Angular NgModel directive is a bridge that enables two-way binding to form elements.

The ngModel data property sets the element's value property and the ngModelChange event property listens for changes to the element's value.

The details are specific to each kind of element and therefore the NgModel directive only works for an element supported by a ControlValueAccessor that adapts an element to this protocol. The <input> box is one of those elements. Angular provides value accessors for all of the basic HTML form elements and the Forms guide shows how to bind to them.

You can't apply [(ngModel)] to a non-form native element or a third-party custom component until you write a suitable value accessor, a technique that is beyond the scope of this guide.

You don't need a value accessor for an Angular component that you write because you can name the value and event properties to suit Angular's basic two-way binding syntax and skip NgModel altogether. The sizer shown above is an example of this technique.

Notice that this example captures the subscription and unsubscribe() when the AstronautComponent is destroyed. This is a memory-leak guard step. There is no actual risk in this app because the lifetime of a AstronautComponent is the same as the lifetime of the app itself. That would not always be true in a more complex application.

You don't add this guard to the MissionControlComponent because, as the parent, it controls the lifetime of the MissionService.

## styles

The styles specified in @Component metadata apply only within the template of that component.

Reminder: these styles apply only to this component. They are not inherited by any components nested within the template nor by any content projected into the component.

Use /deep/, >>> and ::ng-deep only with emulated view encapsulation. Emulated is the default and most commonly used view encapsulation. For more information, see the Controlling view encapsulation section.

The shadow-piercing descendant combinator is deprecated and support is being removed from major browsers and tools. As such we plan to drop support in Angular (for all 3 of /deep/, >>> and ::ng-deep). Until then ::ng-deep should be preferred for a broader compatibility with the tools.

The link tag's href URL must be relative to the application root, not relative to the component file.

When building with the CLI, be sure to include the linked style file among the assets to be copied to the server as described in the CLI documentation.

Style strings added to the @Component.styles array must be written in CSS because the CLI cannot apply a preprocessor to inline styles.

encapsulation: ViewEncapsulation.(Native | Emulated | None)

There are two kinds of generated attributes:

An element that would be a shadow DOM host in native encapsulation has a generated _nghost attribute. This is typically the case for component host elements.

An element within a component's view has a _ngcontent attribute that identifies to which host's emulated shadow DOM this element belongs.

```html
<hero-details _nghost-pmm-5>
  <h2 _ngcontent-pmm-5>Mister Fantastic</h2>
  <hero-team _ngcontent-pmm-5 _nghost-pmm-6>
    <h3 _ngcontent-pmm-6>Team</h3>
  </hero-team>
</hero-detail>
```
