# Git

## Core Concepts

- working directory
- staging area(index)
- commits(snapshot)
- remote repository

## Config

```ts
git help config
git config --list
git config --global user.name '<your name>'
git config --global user.email '<your email>'
```

## Starting a working area

```ts
git clone <github address or local address> --depth 3
git init
```

## Common Commands

```
git --version
git init
git add .
git rm --cached <file>
git checkout -- <file>
git commit -m 'commit message'
git status
git log
```

## log

```
git log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short

--pretty="..." defines the format of the output.
%h is the abbreviated hash of the commit
%d are any decorations on that commit (e.g. branch heads or tags)
%ad is the author date
%s is the comment
%an is the author name
--graph informs git to display the commit tree in an ASCII graph layout
--date=short keeps the date format nice and short
```

## Remote

```ts
git help remote
git remote add origin <your github address>
git remote -v
git remote prune
git push -u origin master
```

## Branching

```ts
git help branch
git branch -a
git checkout -b hot-fix

```

## alias

Git Aliases，编辑 `vim ~/.gitconfig`，输入如下内容：

```ts
[alias]
    co = checkout
    ci = commit
    st = status
    br = branch
    hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
    type = cat-file -t
    dump = cat-file -p
```

Shell Aliases, 输入 `vim ~/.bash_profile`，编辑输入如下内容：

```
# add this short git command
alias gs='git status && say "good day"'
alias ge='git clone '
alias gc='git commit '
alias gd='git diff '
alias go='git checkout '
alias gb='git branch '
alias ga='git add '
alias hist='log --pretty=format:\"%C(yellow)%h %C(red)%d %C(reset)%s %C(green)[%an] %C(blue)%ad\" --topo-order --graph --date=short'
```

## tag

```ts
git help tag
git tag --list
git tag v1
git checkout v1^ # parent of v1
git checkout v1^2 # parent of parent of v1
git tag -d list
```

