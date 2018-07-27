# 自定义表单控件验证

## 内置验证

Angular 表单提供了几种内置的验证。

在模板表单中使用如下：

```html
<form novalidate>
  <input type="text" name="name" ngModel required>
  <input type="text" name="street" ngModel minlength="3">
  <input type="text" name="city" ngModel maxlength="10">
  <input type="text" name="zip" ngModel pattern="[A-Za-z]{5}">
</form>
```

在响应式表单中使用如下：

```ts
@Component()
class Cmp {

  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required)),
      street: new FormControl('', Validators.minLength(3)),
      city: new FormControl('', Validators.maxLength(10)),
      zip: new FormControl('', Validators.pattern('[A-Za-z]{5}'))
    });
  }
}
```

## 最简单的验证器

最简单的验证器就是一个函数，接受一个 FormControl，如果验证通过返回 null，否则返回错误对象。

```ts
interface Validator<T extends FormControl> {
   (c:T): {[error: string]:any};
}
```

一个自定义的 Email 验证器如下：

```ts
import { FormControl } from '@angular/forms';

function validateEmail(c: FormControl) {
  // just for show, dont use it
  let EMAIL_REGEXP = /^(\w+)@\.(\w+):$/i;

  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false,
      msg: '邮箱验证失败，请重新输入。'
    }
  };
}
```

这样的函数验证器目前只能在响应式表单中使用。

```ts
ngOnInit() {
  this.form = new FormGroup({
    ...
    email: new FormControl('', [
      Validators.required,
      validateEmail
    ])
  });
}
```

## 构建验证器指令

为了能够在模板中也能使用自定义的验证器，例如：

```ts
<form novalidate>
  ...
  <input type="email" name="email" ngModel validateEmail>
</form>
```

需要将自定义验证器的逻辑定义成一个指令。

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[validateEmail][ngModel]'
})
export class EmailValidator {}
```

同时，需要提供了一个 `NG_VALIDATORS` 服务，使用的值就是之前定义的 `validateEmail` 函数。

```ts
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEmail][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validateEmail, multi: true }
  ]
})
class EmailValidator {}
```

## 存在依赖关系的自定义验证器

还不完美，有时候一个自定义验证器有自己的依赖，一种方式是使用携带依赖关系的注入器，另一种则是使用类的构造函数注入。

首先创建一个工厂函数。

```ts
import { FormControl } from '@angular/forms';

function validateEmailFactory(emailBlackList: EmailBlackList) {
  return (c: FormControl) => {
    let EMAIL_REGEXP = ...

    let isValid = /* check validation with emailBlackList */

    return isValid ? null : {
      validateEmail: {
        valid: false
      }
    };
  };
}
```

然后通过依赖注入，同时指名依赖关系。

```ts
@Directive({
  ...
  providers: [
    {
      provide: NG_VALIDATORS,
      useFactory: (emailBlackList) => {
        return validateEmailFactory(emailBlackList);
      },
      deps: [EmailBlackList]
      multi: true
    }
  ]
})
class EmailValidator {}
```

注意，这里使用了 `useFactory` 而不是 `useValue`，因为我们不需要返回的构造工厂函数，而是构造工厂函数返回的验证器函数。

更好的方式，是使用类的构造函数依赖注入，只要该类实现了 `validate(c: FormControl)` 方法即可。

```ts
@Directive({
  ...
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
  ]
})
class EmailValidator {

  validator: Function;

  constructor(emailBlackList: EmailBlackList) {
    this.validator = validateEmailFactory(emailBlackList);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
```

需要注意的是 providers 的写法，使用了 `useExisting` 和 `forwardRef`。

## 完整代码如下

```ts
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

function validateEmailFactory(emailBlackList: EmailBlackList) {
  return (c: FormControl) => {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  };
}

@Directive({
  selector: '[validateEmail][ngModel],[validateEmail][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
  ]
})
export class EmailValidator {

  validator: Function;

  constructor(emailBlackList: EmailBlackList) {
    this.validator = validateEmailFactory(emailBlackList);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
```

## 参考资料

- https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html