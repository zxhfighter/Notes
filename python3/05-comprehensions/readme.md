# 推导

## os 模块

os 模块提供一些路径，目录，文件相关的 API。

- 获取当前工作路径：`os.getcwd()`
- 改变当前工作路径：`os.chdir('/Users/abc/def')`

```py
import os

print(os.getcwd())
os.chdir('/Users/abc/def')
print(os.getcwd())
```

- 拼接路径：`os.path.join(path1, path2, path3)`
- 回到用户目录（类似 cd ~）：`os.path.expanduser('~')`

```py
import os

print(os.path.join('/Users/pilgrim/', 'humansize.py'))
# default add slash according to the os platform
print(os.path.join('/Users/pilgrim', 'humansize.py'))
print(os.path.join(os.path.expanduser('~'), 'diveintopython3', 'examples', 'humansize.py'))
```

- 分割路径和文件名：`os.path.split(pathname)`
- 分割文件名和后缀：`os.path.splitext(filename)`

```py
import os

pathname = '/Users/pilgrim/diveintopython3/examples/humansize.py'
(dirname, filename) = os.path.split(pathname)
(shortname, extension) = os.path.splitext(filename)
```

- 获取文件属性：`os.stat(filename)`

```py
os.stat('feed.xml')
```

- 获取文件绝对路径：`os.path.realpath(filename)`

```py
print(os.path.realpath('feed.xml'))
```

## glob 模块

glob 模块提供了使用正则来匹配多个文件和目录的功能。

```py
import glob

glob.glob('examples/*.xml')
glob.glob('*test*.py')
```

## time 模块

time 模块提供时间、日期处理 API。

```py
import os
import time

metadata = os.stat('feed.xml')
time.localtime(metadata.st_mtime)

time.localtime()
# time.struct_time(tm_year=2018, tm_mon=4, tm_mday=9, tm_hour=15, tm_min=1, tm_sec=12, tm_wday=0, tm_yday=99, tm_isdst=0)
```

## 列表推导

推导是将一个列表快捷转化为另一个列表的操作，通用格式为：

```
expression for item in list if filter(item)
```

```py
import os, glob, humansize

a_list = [1, 9, 8, 4]
[(item, item ** 2) for item in a_list if item > 4]

[os.path.realpath(f) for f in glob.glob('*.xml')]
[f for f in glob.glob('*.py') if os.stat(f).st_size > 6000]
[(humansize.approximate_size(os.stat(f).st_size), f) for f in glob.glob('*.xml')]
```

## 字典推导

字典推导是将一个字典快捷转化为另一个字典的操作，通用格式为：

```
{newKey:newValue for oldKey[, oldValue] in list if filter}
```

```py
metadata_dict = {f:os.stat(f) for f in glob.glob('*test*.py')}
list(metadata_dict.keys())

humansize_dict = {os.path.splitext(f)[0]:humansize.approximate_size(meta.st_size) for f, meta in metadata_dict.items() if meta.st_size > 6000}
```

如果键和值都是不可变的值（例如 value 不能为 list），那么可以很方便的交换 key 和 value。

```py
{value: key} for key, value in a_dict.items()}
```

## 集合推导

集合推导是将一个集合快捷转化为另一个集合的操作，通用格式为：

```
{expression for item in list if filter(item)}
```

与字典推导不同的是，由于集合只有值，因此没有 `newKey:newValue` 结构。

```py
a_set = set(range(10))
{x for x in a_set if x % 2 == 0}
```
