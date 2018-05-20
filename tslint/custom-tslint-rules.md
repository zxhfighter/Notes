# 编写自己的 TSLint 规则

TSLint 有默认的一套规则（[Rules](https://palantir.github.io/tslint/rules/)），同时 Angular 团队基于 TSLint 和 Angular 开发最佳实践，开发了 [codelyzer](http://codelyzer.com/)。

这两套规则可以覆盖绝大多数情况，但是还是有些情况我们需要编写自己的规则来 Lint 代码。

## 问题复现

RxJS 5.5+ 版本新增了 lettable operators，推荐使用 `pipe` 的方式来链式操作流，而不推荐使用 patch 的方式：

```ts
// patch Observable, not recommended anymore
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

Observable.of(1, 2, 3).map(x => x + '!');
```

推荐的方式如下：

```ts
// pipe Observable streams
import { of } 'rxjs/observable/of';
import { map } 'rxjs/operators/map';

of(1, 2, 3).pipe(map(x => x + '!'));
```

因此，我们需要在将来使用 RxJS 时，不希望还编写 `import 'rxjs/add/...'` 之类的代码，同时还能够 Lint 出之前的类似代码，便于重构。

## 编写规则

根目录新建一个文件夹 `tslint-rules`，添加文件 `noRxjsPatchImportRule.ts`。

```ts
// 引入必要依赖
import * as path from 'path';
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as minimatch from 'minimatch';

// 定义错误信息
const ERROR_MESSAGE = 'RxJS patch imports are not allowed.'

// 定义规则类，继承自 Lint.Rules.AbstractRule
export class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

// 这才是重点，规则遍历器，校验逻辑一般都在这里实现
class Walker extends Lint.RuleWalker {

    // 是否需要校验该文件
    private _enabled: boolean;

    // 构造函数，传入 ts 源文件和选项
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        // 获取要校验的匹配文件
        const fileGlobs = options.ruleArguments || [];

        // 获取当前源文件的相对路径
        const relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);

        // 查看当前文件是否符合文件列表
        this._enabled = fileGlobs.some(p => minimatch(relativeFilePath, p));
    }

    // 访问 import 语句时调用，在语法遍历器 SyntaxWalker 中定义了很多方法，根据需要调用
    visitImportDeclaration(node: ts.ImportDeclaration) {

        // 当前文件需要检测，并且 import 的文件中包含 rxjs/add，说明使用了 patch，需要报错
        if (this._enabled && node.moduleSpecifier.getText().startsWith('rxjs/add', 1)) {

            // 在该节点报一个错误信息
            this.addFailureAtNode(node, ERROR_MESSAGE);
        }

        // 父类方法调用
        super.visitImportDeclaration(node);
    }
}
```

自定义规则都继承自 `Lint.Rules.AbstractRule`，重写其中的 `apply` 方法，一般来说，这段代码无需变更。

关键需要自己来实现的是一个遍历器，也就是上文中的 `Walker`。

在 `Walker` 中，根据校验目的不同，提供了不同代码片段的访问方式，例如要访问 import 语句，可以通过 `visitImportDeclaration` 方法来遍历；要访问所有定义 for 循环的地方，可以通过 `visitForStatement` 来遍历。

另外，还可以结合 `tsutils` 中的相关方法来实现更细粒度的控制，例如下面的代码就能对每个 comment 进行遍历。

```ts
import * as utils from 'tsutils';

class NoExposedTodoWalker extends Lint.RuleWalker {

  visitSourceFile(sourceFile: ts.SourceFile) {
    utils.forEachComment(sourceFile, (text, commentRange) => {
      const isTodoComment = text.substring(commentRange.pos, commentRange.end).includes('TODO:');

      if (commentRange.kind === ts.SyntaxKind.MultiLineCommentTrivia && isTodoComment) {
        this.addFailureAt(commentRange.pos, commentRange.end - commentRange.pos, ERROR_MESSAGE);
      }
    });

    super.visitSourceFile(sourceFile);
  }
}
```

## 配置规则

在 tslint.json 中配置如下：

```
{
    "rulesDirectory": [
        "node_modules/codelyzer",
        "./config/tslint-rules/"
    ],

    "rules": [

        // custom rules
        "no-rxjs-patch-imports": [
            true,
            "src/app/**/*.ts"
        ]
    ]
}
```

这里需要注意，规则的名称为文件名称的驼峰风格转化为中划线名称。
