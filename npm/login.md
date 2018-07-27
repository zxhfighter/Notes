## npm 登录相关

查看当前登录用户。

```
npm whoami
```

退出登录。

```
npm logout
```

重新登录。

```
npm login
Username:
Password:
Email:
```

需要 **注意两点**：

- 用户名登录需要带前缀 `~`
- 使用 npm config list 查看登录的 registry，如果不是官方 registry（https://registry.npmjs.org/），需要重新设置

```
npm config set registry https://registry.npmjs.org/
```

发布。

```
npm publish
```
