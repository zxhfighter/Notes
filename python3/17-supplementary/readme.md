# 查漏补缺

## python 脚本设置

设置可以直接运行的 python 脚本如下：

```
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
```

## 注释

单行注释用 `#`，多行注释用 '''，多行字符串。

## 字符串

字符串转义用反斜杠，或者单引号和双引号混用。

如果不想转义字符串，可以在字符串前边加上前缀 `r`。

```py
'doesn\'t'
"doesn't"
print(r'C:\some\name')
```

另外，两个字符串字面量可以用空格来连接。

```py
a = 'Py' 'thon'
text = ('Put several strings within parentheses '
        'to have them joined together.')
```

多行字符串可以用 """ 或者 ''' 来表示，可以用字符串的 `splitlines()` 方法来分割行。

```py
# 反斜杠这里用来去掉换行符
msg = """\
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
"""

print(msg)
msg.splitlines()
```

最后字符串一旦创建好以后是不可变的，要修改字符串，获得新字符串，只能创建新字符串。

```py
word = 'abc'
word[0] = 'x' # TypeError
word = word.replace('a', 'x')
word = 'x' + word[1:]
```

## 流程控制

### 条件判断

```py
if expression1:
    pass
elif expression2:
    pass
elif expression3:
    pass
else:
    pass
```

简洁 if 语句。

```py
a = value1 if expression else value2
```

另外可以通过关键字 `and`, `or`, `not` 来组合逻辑。

```py
if not True:
    pass

v = string1 or string2 or defaultString
isOK = condition1 and condition2 and condition3
```

### 循环

```py
# 迭代器
for w in range(10):
    print(w)

# 集合
for s in {1,2,3}:
    pass

# 字典
knights = {'gallahad': 'the pure', 'robin': 'the brave'}
for k, v in knights.items():
    print(k, v)

# 通过 range 和 len 函数获取索引
for i in range(len(words[:])):
    print((i, words[i]))

# 另外可以通过 enumerate 方法获取索引
for i, v in enumerate(['tic', 'tac', 'toe']):
    print(i, v)

# 通过 zip 构造元组来循环
questions = ['name', 'quest', 'favorite color']
answers = ['lancelot', 'the holy grail', 'blue']
for q, a in zip(questions, answers):
    print(q, a)

# 逆向循环
for i in reversed(range(1, 10, 2)):
    print(i)

# 排序循环
basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
for f in sorted(set(basket)):
    print(f)
```

注意的是，range 函数是一个迭代器。

## 函数

### 任意参数

函数支持多参数传递。

```py
def write_multiple_items(file, separator, *args):
    file.write(separator.join(args))

def concat(*args, sep="/"):
    return sep.join(args)

concat("earth", "mars", "venus")
concat("earth", "mars", "venus", sep=".")
```

同样可以将多个参数数组解析成一个个参数，使用 range() 函数。

```py
args = [3, 6]
list(range(*args))
```

### Lambda 函数

```py
def make_incrementor(n):
    return lambda x: x + n

f = make_incrementor(42)
f(0)
f(1)

pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]
pairs.sort(key=lambda pair: pair[1])
```

## 模块

### 模块导入语法。

```py
import sys
import sys as sys2
from sys import *
from sys import path, byteorder
from sys import path as path2
```

### 编译好的模块

python 脚本执行后，会在 `__pycache__` 生成一个文件名为 module.version.pyc 的缓存文件。

Python 会检查源文件和编译后的文件的修改时间，如果都没有变化，那么会使用编译好的文件执行。

### dir 函数

dir 函数可以查看对象所有方法和属性。

```py
import builtins
dir(builtins)
```

### 包

可以通过 A.B.C 方式来引入模块，这间接表明了一个包结构。

```
A/                  --- Top-level package
  __init__.py       --- Initialize the A package
  a1.py
  a2.py
  B/                --- Subpackage for file format conversions
    __init__.py
    b1.py
    b2.py
      C/
        __init__.py
        c1.py
        c2.py
```

```py
import sound.effects.echo
from sound.effects import echo
from sound.effects.echo import echofilter
```

