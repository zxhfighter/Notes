# angular.json

首先看下 angualr.json 的大致结构。

```json
{
    // 当前文件 schema， 不同字段的解释说明，值类型等等
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "newProjectRoot": "projects",

    // 项目列表
    "projects": {
        "lego": {
            // 主项目
        },
        "lego-e2e": {
            // 主项目 e2e 测试项目
        }
    },

    // 默认项目
    "defaultProject": "lego"
}
```

然后深入看下 `lego` 项目的结构。

```json
{
    // 项目目录
    "root": "",

    // 项目源代码目录
    "sourceRoot": "src",

    // 项目类型，可选：应用（application）和库（library）
    "projectType": "application",

    // 使用 ng generate 生成组件的选择器前缀
    "prefix": "app",

    // 核心 schematcis 集合，默认为空
    "schematics": {},

    // 架构
    "architect": {

        // 构建
        "build": {

            // 针对浏览器的构建器
            "builder": "@angular-devkit/build-angular:browser",

            // 构建属性
            "options": {

                // 输出路径
                "outputPath": "dist/lego",

                // 首页地址
                "index": "src/index.html",

                // 主文件地址
                "main": "src/main.ts",

                // polyfills 地址
                "polyfills": "src/polyfills.ts",

                // 编译文件地址
                "tsConfig": "src/tsconfig.app.json",

                // 全局资源地址
                "assets": [
                    "src/favicon.ico",
                    "src/assets"
                ],

                // 全局样式
                "styles": [
                    {
                        "input": "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
                    },
                    "src/styles.css"
                ],

                // 全局脚本
                "scripts": []
            },

            // 配置
            "configurations": {

                // 传递给 webpack 构建的一些参数
                "production": {

                    // 构建过程中替换文件
                    "fileReplacements": [
                        {
                            "replace": "src/environments/environment.ts",
                            "with": "src/environments/environment.prod.ts"
                        }
                    ],

                    // 是否压缩优化
                    "optimization": true,

                    // 指定输出文件是否使用 hash
                    "outputHashing": "all",

                    // 是否生成 sourcemap
                    "sourceMap": false,

                    // 是否提取 css
                    "extractCss": true,

                    // 对于懒加载模块使用文件名
                    "namedChunks": false,

                    // 是否使用 AOT 构建
                    "aot": true,

                    // 提取所有版权声明到一个文件，只出现一次
                    "extractLicenses": true,

                    // 将 vendor 打包成一个独立的包
                    "vendorChunk": false,

                    // 当开启 aot 时，启用 @angular-devkit/build-optimizer 优化
                    "buildOptimizer": true
                }
            }
        },

        // 托管
        "serve": {

            // 启动 dev-server
            "builder": "@angular-devkit/build-angular:dev-server",
            "options": {

                // 托管之前 lego:build 构建产物
                "browserTarget": "lego:build"
            },
            "configurations": {
                "production": {
                    "browserTarget": "lego:build:production"
                }
            }
        },

        // 提取国际化字符
        "extract-i18n": {
            "builder": "@angular-devkit/build-angular:extract-i18n",
            "options": {
                "browserTarget": "lego:build"
            }
        },

        // 测试
        "test": {

            // 启动 karma
            "builder": "@angular-devkit/build-angular:karma",
            "options": {

                // 测试主入口文件
                "main": "src/test.ts",

                // 测试 polyfills
                "polyfills": "src/polyfills.ts",

                // 测试编译设置
                "tsConfig": "src/tsconfig.spec.json",

                // 测试配置文件
                "karmaConfig": "src/karma.conf.js",

                // 测试引用样式
                "styles": [
                    {
                        "input": "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
                    },
                    "src/styles.css"
                ],
                "scripts": [],

                // 测试引用资源
                "assets": [
                    "src/favicon.ico",
                    "src/assets"
                ]
            }
        },

        // 代码检测
        "lint": {

            // 启动 tslint
            "builder": "@angular-devkit/build-angular:tslint",
            "options": {
                "tsConfig": [
                    "src/tsconfig.app.json",
                    "src/tsconfig.spec.json"
                ],
                "exclude": [
                    "**/node_modules/**"
                ]
            }
        }
    }
}
```

关于 `lego-e2e` 的项目结构，读者可以自己去分析。

```json
"lego-e2e": {
  "root": "e2e/",
  "projectType": "application",
  "architect": {
    "e2e": {
      "builder": "@angular-devkit/build-angular:protractor",
      "options": {
        "protractorConfig": "e2e/protractor.conf.js",
        "devServerTarget": "lego:serve"
      }
    },
    "lint": {
      "builder": "@angular-devkit/build-angular:tslint",
      "options": {
        "tsConfig": "e2e/tsconfig.e2e.json",
        "exclude": [
          "**/node_modules/**"
        ]
      }
    }
  }
}
```
