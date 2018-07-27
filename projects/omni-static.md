# OMNI

OMNI

从5月份开始到现在，目前已与多家广告代理商合作（阳狮，电通安吉斯，华扬，群邑，国双），与多个品牌（例如宝马、捷豹、林肯，维京邮轮，香奈儿等）签署了 26+ 个广告预算投放协议，总投放金额达到 2745.88 万元

投放渠道产品有：开屏，聚屏，GD，序章，非标等

定向策略有：重定向，新品上市，圈层营销，竞品拦截，城市定向，千人千面，竞品，兴趣人群定向

## 项目类型

大型商业平台项目，广告投放设置项目

## 项目亮点

### 项目结构抽象

负责整个项目的搭建，文件夹目录划分，以及后续的相应底层架构升级

```
business layer: login main manage
common layer: interface enum service pipe component directive validator form list（扩展下）
framework layer: angular echarts lodash-es rxjs xdesign moment
```

该结构可以适用于多种大型商业平台管理系统，并依据此构建脚手架。

以后，可以一个命令生成所需的脚手架，并提供多种参数配置，进行细粒度的生成。

### 常见业务场景抽象

商业系统中最常见的两个场景：一个是表单，一个是列表，并对此进行了抽象。

#### 表单抽象

表单都有一个操作实体，叫做 entity，一般表单都有两种操作，新建（createEntity）和编辑（editEntity）。

创建和编辑表单前，都需要获取实体对象（getEntity），在其中进行一些格式化的操作。

表单操作成功后，会有一个成功处理函数（suceessHandler）。当然表单操作不一定成功，因此还需要一个错误处理函数（errorHandler）。

如果编辑表单时，会存在表单 formId，可以根据 formId 是否存在判断当前的操作模式，formId 一般从路由获取，路由约定 formId 参数从 id 参数获取。

之后，在编辑模式下，会加载表单数据（loadEntity），加载完成后会将状态渲染到表单元素上去（renderEntity）。

最后，在表单提交之前会有一个验证过程，这一块 Angular 的底层机制已经实现了，只需要编写对应 form 组件的验证规则即可。

表单都会有返回链接。

```ts
class BaseForm {
    entity = 'brand-share';
    entityName = '品牌份额';
    formId;

    constructor() {
        this.formId = router.getFormId(); // get form id from router
    }

    async ngOnInit() {
        if (this.formId) {
            // 实际这里需要 try...catch，为了演示暂时省略
            const entity = await this.loadEntity(this.formId);
            this.renderEntity(entity);
        }
    }

    getEntity() {
        const entity = {}; // format entity
        return entity;
    }

    suceessHandler(successData) {}
    errorHandler(errorData) { }

    onSubmit() {
        const entity = this.getEntity();
        const action = this.formId
            ? this.editEntity(this.formId, entity)
            : this.createEntity(entity);

        action.then(
            this.suceessHandler.bind(this),
            this.errorHandler.bind(this)
        );
    }

    onCancel() {}
}
```

#### 列表抽象

列表也进行了抽象，列表包括：

- 操作区
- 筛选区
- 表格
- 分页

表格数据有各种各样的过滤方式。

- 排序
- 分页
- 过滤条件

```ts
/** 表格搜索、过滤、排序、分页参数接口格式 */
export interface TableArgs {
    /** 排序方式，可选 asc 或 desc，默认 desc */
    order: string;

    /** 排序字段 */
    orderBy: string;

    /** 当前显示页码 */
    page: number;

    /** 每页显示条数 */
    size: number;

    /** 过滤参数 */
    filterMap: {};
}
```

同时提供一个 Subject 对象（类似 EventEmitter），对表格参数进行监听。

```ts
/** 表格参数变动的主题（rxjs） */
paramSubject: Subject<TableArgs> = new Subject<TableArgs>();

paramSubject.subscribe(tableArgs => {

});

// sort
paramSubject.next(tableArgs);

// filter
paramSubject.next(tableArgs);
```

如果参数变不是 filter，还提供表格数据缓存功能。

### 封装 HTTP 服务

提供参数处理，错误处理。

### MOCK服务

基于 express 的 mock 服务（使用 Koa 也可以，主要对 express 熟悉）

### 开发

Angular 提供

### 构建

Angular 封装了 webpack，现在改成了 bazel，也无法进行优化。

### 脚手架

angular cli 提供了部分，不过还可以使用 schematics 来进行脚手架搭建。
