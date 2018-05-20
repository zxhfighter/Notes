## 关于缩进

python 流程控制没有大括号 `{` 和 `}`，圆括号也是能省则省，使用缩进和分号（:）来分割代码块，不需要使用分号结尾。

python 中的空格至为关键，不一定要四个空格，两个空格也可以，不过需保持一致。

完整的空行不会当做代码块分隔符，主要用来增加可读性。

## 关于类型

python 中不需要显示指定变量类型，python 会根据赋予变量的值自动跟踪类型。

## 声明函数

函数用 `def` 定义，任何函数都有返回值（显示 return 或者 raise Error），如果没有指定，就返回 `None`。

函数中的 `pass` 表明空语句，类似其他语言中的 `{}` 空代码块。

## 命名风格

python 中的命名风格为下划线分割符风格。

```py
def approximate_size(size, a_kilobyte_is_1024_byte = True):
    pass
```

## 可选参数和默认值

上边的 a_kilobyte_is_1024_byte 参数即为可选参数，没有提供时，默认值为 `True`。

## 函数传入顺序

当函数传入命名参数时，顺序没有关系，不过命名参数后边的参数也必须都是命名参数。

```py
from humansize import approximate_size
approximate_size(4000, a_kilobyte_is_1024_bytes=False) # ok
approximate_size(size=4000, a_kilobyte_is_1024_bytes=False) # ok
approximate_size(a_kilobyte_is_1024_bytes=False, size=4000) # ok
approximate_size(a_kilobyte_is_1024_bytes=False, 4000) # not ok
approximate_size(size=4000, False) # not ok
```

## 函数注释

使用 ''' 来添加函数注释，这个函数注释将会成为函数运行时的 `docstring` 属性。

单行注释可以使用井号 `#` 来注释。

```py
def abc(a, b=1):
    '''what abc function does.

    Arguments:
    a -- what's a
    b -- What's b

    Returns: string
    '''
    pass
```

## 导入模块

导入模块时，python 会查找若干路径，这些路径定义在 sys 库里边的 path 字段。

```shell
>>> import sys
>>> sys.path
>>> sys.path.insert(0, '/Users/baidu/apps/notes/python3')
>>> sys.path
```

## 一切皆是对象

在 Python 里面所有东西都是对象。字符串是对象，列表是对象，函数是对象，类是对象，类的实例是对象，甚至模块也是对象。

在 python 中，一切皆是对象，例如刚才的函数，运行时可以查看自己的 docstring.

```
>>> import humansize
>>> print(humansize.approximate_size.__doc__)
```

另外，python 中，函数则是第一等公民，也就是说，函数也可以作为参数传递或者结果返回（这样就会形成高阶函数）。模块、以及类也都是第一等公民。

## 异常

python 鼓励抛出异常，不过要负责到底，需要对异常进行捕获处理。否则异常会冒泡到顶层，导致整个应用失败。

python 使用 `raise` 抛出异常，使用 `try...except` 捕获异常。

```py
if size < 0:
    raise ValueError('number must be non-negative')
```

在当前函数抛出的异常不一定要在当前函数处理，可以抛出由上层调用的函数去处理。

例如，处理一个常见的 `ImportError` 如下：

```py
try:
    import chardet
except ImportError:
    chardet = None
```

在你的代码中，就可以优雅的使用 chardet 了。

```py
if chardet:
    # do something awesome with chardet
else:
    # continue anyway
```

又如，很多类似的功能库代码实现了一样的功能，但是性能有优劣，可以先试着导入性能较高的库，失败了再导入性能差一点的库。

```py
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree
```

## 变量不需要先声明

变量不需要先声明，可以直接赋值定义。

不过，不能引用还未定义的变量，否则会抛出 NameError 异常。

## 大小写敏感

变量名、函数名、类名、模块名、异常名等等，都是大小写敏感的。

## 运行脚本

一切皆是对象，模块也是。

模块有个内置属性 `__name__`，如果是导入模块，那么其为模块的文件名（不包含路径和后缀名）；如果作为一个独立脚本运行，其为特定值 `__main__`。

```py
if __name__ == '__main__':
    print(approximate_size(1000000000000, False))
    print(approximate_size(1000000000000))
```
