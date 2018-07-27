## 勿删分支怎么办？

使用 `git branch -D e2e` 删除了 e2e 分支，后来后悔了，要怎么办？

可以使用 `git log -g` 查看所有提交日志（包括所有分支的），然后找到对应日志的 commit，最后使用 `git branch e2e <commit>` 即可恢复。

```
commit 3eac14d05bc1264cda54a7c21f04c3892f32406a
Reflog: HEAD@{1} (fdipzone <fdipzone@sina.com>)
Reflog message: commit: add test.txt
Author: fdipzone <fdipzone@sina.com>
Date:   Sun Jan 31 22:26:33 2016 +0800

    add test.txt
```

创建分支。

```ts
git branch recover_branch_abc 3eac14d05bc1264cda54a7c21f04c3892f32406a

git branch -a
* develop
  recover_branch_abc
  remotes/origin-dev/develop
```

## 如果在当前分支修改了一些内容，但是突然最好还是把这些修改提交到一个新的分支比较好，要怎么做？

1. 先暂存变更 `git add .`，
2. 然后使用 `git stash` 将变更压入一个临时堆栈
3. 使用 `git checkout -b new_branch` 新建新的分支
4. 使用 `git stash pop` 将堆栈的变更应用到新的分支

还有一种方法：

我们不需要在A分支做commit,只需要在A分支新建B分支，然后切换过去。这个时候你会发现修改的东西在A，B分支都有。这个时候在B分支commit，那么这些修改保留在B分支上，再切换到A分支上会发现修改都没有保留下来。

