# 清理本地无用分支

有时候远程分支删除后，在本地还留有分支，可以使用：

`git remote prune origin --dry-run`

查看。

确定没问题后，可以使用：

`git remote prune origin`

删除本地无效分支，保持和远端分支一致。
