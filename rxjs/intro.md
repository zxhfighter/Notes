## RxJS 安装和使用

ES6 版本：

```bash
npm install -S rxjs-es
```

也可以安装 commonjs 版本（推荐），webpack 可以同样处理。

```bash
npm install -S rxjs
```

当然，开发时，可以直接使用 CDN 版本：

https://unpkg.com/@reactivex/rxjs@version/dist/global/Rx.js

## 使用

### 一次性加载

加载所有 RxJS 代码，所有操作符算子都会添加到对应的 `Observable` 和 `Observable.prototype` 上。

由于代码量较大，不推荐使用。

```ts
import Rx from 'rxjs/Rx';

Observable.of(1, 2, 3).map(x => x + '!!!'); // etc
```

### 选择性加载

选择性加载 RxJS，只有选择的操作符算子会添加（patch）到对应的 `Observable` 和 `Observable.prototype` 上。

一般来说，位于 `add` 文件夹中的算子会自动 patch。

```ts
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
```

### 使用 pipe

对于库开发者，使用上述方式都不合理。因为一个库如果使用了 RxJS 中的某个算子，应用开发者可能会使用该算子，之后库决定不使用该算子了，应用开发者就会遇到错误。

在 RxJS 5.5+ 版本中，引入了 lettable 算子的概念。

```ts
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } 'rxjs/operators';

Observable.of(1, 2, 3).pipe(map(x => x + '!!!'));
```

### 使用 bind operator

不过 bind operator 目前只有 babel 支持转译，typescript 还不支持该语法。

```ts
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';

Observable::of(1, 2, 3)::map(x => x + '!!!'); // etc
```
