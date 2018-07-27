# typescript 源码分析

## 分析过程

```
SourceCode ~~ scanner ~~> Token Stream
Token Stream ~~ parser ~~> AST
AST ~~ binder ~~> Symbols
AST + Symbols ~~ checker ~~> Type Validation
AST + Checker ~~ emitter ~~> JS
```

核心对象。

## TextRange

文本范围。

```ts
interface TextRange {
    // 开始位置
    pos: number;

    // 结束位置
    end: number;
}
```

## Node

代表 AST 中的一个节点，每个节点有：

- 节点类型：kind
- 位置信息：（pos: 开始位置，end: 结束位置，由 TextRange 提供）
- 父节点(parent)
- 可选修饰器(decorators)
- 节点特征(let const, export)
- 节点修饰符(public, async, const)

```ts
interface Node extends TextRange {

    // 节点类型，例如 EOF 标记，字符串常量，分号标记，逗号标记，行内注释，块级注释
    // 双等号标记，Import 关键字，构造函数，CallExpression 等
    kind: SyntaxKind;

    // 节点特征，例如 Let、Const、ExportContext，ThisNodeHasError 等等
    flags: NodeFlags;

    // 节点修饰器数组
    decorators?: NodeArray<Decorator>;

    // 属性修饰符 Token 数组（例如 AsyncKeyword, ConstKeyword, StaticKeyword）
    modifiers?: ModifiersArray;

    // 父节点
    parent?: Node;
}
```

## SourceFile

代表了一个 TypeScript 文件，同时也是 AST 树的顶级节点，常见属性如下：

- fileName：文件名
- text：文件内容
- moduleName：模块名
- statements：所有语句 Statement

```ts
interface Declaration extends Node {
    _declarationBrand: any;
}

interface SourceFile extends Declaration {
    kind: SyntaxKind.SourceFile;
    statements: NodeArray<Statement>;
    endOfFileToken: Token<SyntaxKind.EndOfFileToken>;
    fileName: string;
    text: string;
    amdDependencies: ReadonlyArray<AmdDependency>;
    moduleName: string;
    referencedFiles: ReadonlyArray<FileReference>;
    typeReferenceDirectives: ReadonlyArray<FileReference>;
    languageVariant: LanguageVariant;
    isDeclarationFile: boolean;
    /**
     * lib.d.ts should have a reference comment like
     *
     *  /// <reference no-default-lib="true"/>
     *
     * If any other file has this comment, it signals not to include lib.d.ts
     * because this containing file is intended to act as a default library.
     */
    hasNoDefaultLib: boolean;
    languageVersion: ScriptTarget;
}
```

## Bundle

- sourceFiles：SourceFile 数组。

```ts
interface Bundle extends Node {
    kind: SyntaxKind.Bundle;
    sourceFiles: ReadonlyArray<SourceFile>;
}
```

## ScriptReferenceHost

脚本宿主环境。

```ts
interface ScriptReferenceHost {
    getCompilerOptions(): CompilerOptions;
    getSourceFile(fileName: string): SourceFile | undefined;
    getSourceFileByPath(path: Path): SourceFile | undefined;
    getCurrentDirectory(): string;
}
```

## Program

程序。

```ts
Program -uses-> CompilerHost -uses-> System
```

包含多个 SourceFile，有 `emit()` 方法生成对应的 JS 和 声明文件。

```ts
interface Program extends ScriptReferenceHost {
    /**
    * Get a list of root file names that were passed to a 'createProgram'
    */
    getRootFileNames(): ReadonlyArray<string>;
    /**
    * Get a list of files in the program
    */
    getSourceFiles(): ReadonlyArray<SourceFile>;
    /**
    * Emits the JavaScript and declaration files.  If targetSourceFile is not specified, then
    * the JavaScript and declaration files will be produced for all the files in this program.
    * If targetSourceFile is specified, then only the JavaScript and declaration for that
    * specific file will be generated.
    *
    * If writeFile is not specified then the writeFile callback from the compiler host will be
    * used for writing the JavaScript and declaration files.  Otherwise, the writeFile parameter
    * will be invoked when writing the JavaScript and declaration files.
    */
    emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
    getOptionsDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getGlobalDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getDeclarationDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    /**
     * Gets a type checker that can be used to semantically analyze source files in the program.
     */
    getTypeChecker(): TypeChecker;
    isSourceFileFromExternalLibrary(file: SourceFile): boolean;
}
```

创建一个 Program 并输出相应的编译文件。

```ts
let program = ts.createProgram(fileNames, compilerOptions);
let emitResult = program.emit();
```

## TypeFlags

类型标志。

```ts
enum TypeFlags {
    Any = 1,
    String = 2,
    Number = 4,
    Boolean = 8,
    Enum = 16,
    StringLiteral = 32,
    NumberLiteral = 64,
    BooleanLiteral = 128,
    EnumLiteral = 256,
    ESSymbol = 512,
    UniqueESSymbol = 1024,
    Void = 2048,
    Undefined = 4096,
    Null = 8192,
    Never = 16384,
    TypeParameter = 32768,
    Object = 65536,
    Union = 131072,
    Intersection = 262144,
    Index = 524288,
    IndexedAccess = 1048576,
    Conditional = 2097152,
    Substitution = 4194304,
    NonPrimitive = 134217728,
    Literal = 224,
    Unit = 13536,
    StringOrNumberLiteral = 96,
    PossiblyFalsy = 14574,
    StringLike = 524322,
    NumberLike = 84,
    BooleanLike = 136,
    EnumLike = 272,
    ESSymbolLike = 1536,
    UnionOrIntersection = 393216,
    StructuredType = 458752,
    TypeVariable = 1081344,
    InstantiableNonPrimitive = 7372800,
    InstantiablePrimitive = 524288,
    Instantiable = 7897088,
    StructuredOrInstantiable = 8355840,
    Narrowable = 142575359,
    NotUnionOrUnit = 134283777,
}
```

## forEachChild

遍历节点。

```ts
ts.forEachChild(node, childNode => {
    if (!childNode) {
        return;
    }

    foundNode = foundNode || findNode(childNode, kind, text);
});
```

## createSourceFile

构建一个 SourceFile。

```ts
function createSourceFile(
    fileName: string,
    sourceText: string,
    languageVersion: ScriptTarget,
    setParentNodes?: boolean,
    scriptKind?: ScriptKind
) : SourceFile;
```

## updateSourceFile

更新一个 SourceFile。

```ts
function updateSourceFile(
    sourceFile: SourceFile,
    newText: string,
    textChangeRange: TextChangeRange,
    aggressiveChecks?: boolean
) : SourceFile;
```

## CompilerOptions

编译选项。

## Diagnostics

诊断信息。

## Trivia

代码中不重要的信息，例如 空格、注释以及冲突的标记等等，AST 为了精简不存储这些信息，不过这些信息可以用 `ts.*` API来获取。例如 `ts.getLeadingCommentRanges` 和 `ts.getTrailingCommentRanges`。

另外需要注意不重要信息的归属问题（属于哪个 Token），同一行的属于当前 Token，从下一行开始属于下一个 Token。


## 转化 AST

使用 `ts.transform(sourceFile, [transformer])` 来进行 AST 节点转化。

```ts
const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
  sourceFile, [ transformer ]
);

const transformedSourceFile: ts.SourceFile = result.transformed[0];
```

其中相关接口定义如下：

```ts
function transform<T extends Node>(source: T | T[],
    transformers: TransformerFactory<T>[],
    compilerOptions?: CompilerOptions): TransformationResult<T>;

type TransformerFactory<T extends Node> =
    (context: TransformationContext) => Transformer<T>;

type Transformer<T extends Node> = (node: T) => T;
```

使用 `ts.forEachChild` 来遍历 AST。使用 `ts.visitEachChild` 来遍历修改 AST。

```ts
function visitEachChild<T extends Node>(node: T,
    visitor: Visitor,
    context: TransformationContext): T;
```

The important thing to note here is that `visitEachChild` iterates over the children, but returns us the (possibly updated) node it is called on. First lets build up the stupidest transformer which simply logs the types of nodes it encounters:

```ts
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        console.log("Visiting " + ts.SyntaxKind[node.kind]);
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};
```

If I call this with input let x = n + 42; I get the result:

```ts
Visiting SourceFile
Visiting VariableStatement
Visiting VariableDeclarationList
Visiting VariableDeclaration
Visiting Identifier
Visiting BinaryExpression
Visiting Identifier
Visiting FirstLiteralToken
```

We’ll apply this to a simple tree transformation, eliminating arithmetic expressions on constants to constants, i.e. replacing 2 + 2 with 4.

```ts
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binary = node as ts.BinaryExpression;
            if (binary.left.kind === ts.SyntaxKind.NumericLiteral
              && binary.right.kind === ts.SyntaxKind.NumericLiteral) {
                const left = binary.left as ts.NumericLiteral;
                const leftVal = parseFloat(left.text);
                const right = binary.right as ts.NumericLiteral;
                const rightVal = parseFloat(right.text);
                if (binary.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    return ts.createLiteral(leftVal + rightVal);
                }
            }
        }
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};
```

This seems to work! When run with input var x = 2 + 2;, it outputs var x = 4;. However, when run with var x = 1 + 2 + 3, it outputs var x = 3 + 3;. Run it a second time and it would simplify again, but what we want is a bottom-up recursive traversal. The fix is simple, first we transform the node by visiting the children, then construct the results (also catering for another couple of cases):

```ts
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        node = ts.visitEachChild(node, visit, context);
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binary = node as ts.BinaryExpression;
            if (binary.left.kind === ts.SyntaxKind.NumericLiteral
              && binary.right.kind === ts.SyntaxKind.NumericLiteral) {
                const left = binary.left as ts.NumericLiteral;
                const leftVal = parseFloat(left.text);
                const right = binary.right as ts.NumericLiteral;
                const rightVal = parseFloat(right.text);
                switch (binary.operatorToken.kind) {
                    case ts.SyntaxKind.PlusToken:
                        return ts.createLiteral(leftVal + rightVal);
                    case ts.SyntaxKind.AsteriskToken:
                        return ts.createLiteral(leftVal * rightVal);
                    case ts.SyntaxKind.MinusToken:
                        return ts.createLiteral(leftVal - rightVal);
                }
            }
        }
        return node;
    }
    return ts.visitNode(rootNode, visit);
};
```

## Reference

- https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- https://basarat.gitbooks.io/typescript/docs/compiler/overview.html
- https://astexplorer.net/#/KJ8AjD6maa
- https://ts-ast-viewer.com/
- https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
- https://zhuanlan.zhihu.com/p/30360931