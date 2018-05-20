# typescript 源码分析

核心对象。

## TextRange

文本范围。

```ts
interface TextRange {
    pos: number;
    end: number;
}
```

## Node

代表 AST 中的一个节点。

```ts
interface Node extends TextRange {

    // 节点类型，例如 EOF 标记，字符串常量，分号标记，逗号标记，
    // 双等号标记，Import 关键字，构造函数，CallExpression等
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

代表了一个 TypeScript 文件，常见属性如下：

- fileName
- text
- moduleName

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

多个 SourceFile 数组。

```ts
interface Bundle extends Node {
    kind: SyntaxKind.Bundle;
    sourceFiles: ReadonlyArray<SourceFile>;
}
```

## ScriptReferenceHost

```ts
interface ScriptReferenceHost {
    getCompilerOptions(): CompilerOptions;
    getSourceFile(fileName: string): SourceFile | undefined;
    getSourceFileByPath(path: Path): SourceFile | undefined;
    getCurrentDirectory(): string;
}
```

## Program

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

## TypeFlags

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
    foundNode = foundNode || findNode(childNode, kind, text);
});
```

## createSourceFile

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



## Reference

- https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- https://basarat.gitbooks.io/typescript/docs/compiler/overview.html
- https://ts-ast-viewer.com/