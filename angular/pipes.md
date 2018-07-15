# pipes

## built-in pipes

- date
- json
- number
- uppercase, lowercase
- percent

## Parameterizing a pipe

```html
{{ birthday | date: "MM/dd/yy" }}
```

## chaining pipes

```html
{{ birthday | date: 'fullDate' | uppercase }}
```

## pure vs impure pipes

Angular executes a pure pipe only when it detects a pure change to the input value. A pure change is either a change to a primitive input value (String, Number, Boolean, Symbol) or a changed object reference (Date, Array, Function, Object).

Angular executes an impure pipe during every component change detection cycle. An impure pipe is called often, as often as every keystroke or mouse-move.

With that concern in mind, implement an impure pipe with great care. An expensive, long-running pipe could destroy the user experience.

A pure pipe is preferable when you can live with the change detection strategy. When you can't, you can use the impure pipe.

```ts
@Pipe({
  name: 'flyingHeroesImpure',
  pure: false
})
export class FlyingHeroesImpurePipe extends FlyingHeroesPipe {}
```

The Angular AsyncPipe is an interesting example of an impure pipe. The AsyncPipe accepts a Promise or Observable as input and subscribes to the input automatically, eventually returning the emitted values.

The AsyncPipe is also stateful. The pipe maintains a subscription to the input Observable and keeps delivering values from that Observable as they arrive.

```html
<p>Message: {{ message$ | async }}</p>
```

Write one more impure pipe, a pipe that makes an HTTP request.

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient }          from '@angular/common/http';
@Pipe({
  name: 'fetch',
  pure: false
})
export class FetchJsonPipe  implements PipeTransform {
  private cachedData: any = null;
  private cachedUrl = '';

  constructor(private http: HttpClient) { }

  transform(url: string): any {
    if (url !== this.cachedUrl) {
      this.cachedData = null;
      this.cachedUrl = url;
      this.http.get(url).subscribe( result => this.cachedData = result );
    }

    return this.cachedData;
  }
}
```

## custom pipes

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exponentialStrength',
    pure: true
})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent: string): number {
    let exp = parseFloat(exponent);
    return Math.pow(value, isNaN(exp) ? 1 : exp);
  }
}
```

add the pipe to module declarations, and then use in template as follows:

```html
<p>Super power boost: {{2 | exponentialStrength: 10}}</p>
```
