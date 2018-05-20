# 字符串

一个字节序列，用不同的字节编码方式，可以得到不同的文本。

## Unicode 编码

UTF-32 用4个字节（32 bit）来表示地球上所有的文字。优点是，每个码点表示一个明确的字符；缺点是太浪费存储空间了，英文字母明明1个字节能存储，却需要用4个字节。

UTF-16 用两个字节（16 bit）来编码，优点是，比 UTF-32 节省一半的空间，缺点是，只能编码 0~65535 之间的字符，超出这个范围的字符（星芒层 astral plane）无法表示。

另外，UTF-32 和 UTF-16 有字节序（Byte Order Mark）的问题，例如一个字节序列 `4E 2D`，如果字节序标记为 `\uFFFE`，表示大端，UTF-16表示的字符为 `\u4E2D`，如果字节序标记为 `\uFEFF`，表示小端，UTF-16表示的字符为 `\u2D4E`。

UTF-8 是一个**可变字节长度**的 Unicode 编码方式，也就是说不同的字符占用不同数量的字节，ASCII 字符占1个字节，`ñ` 占2个字节，`中` 占3个字节，`乁` 占四个字节。

UTF-8 的优点是，存储空间利用非常高效，且不存在字节序的问题（位操作的天性使然）。缺点是找到某个字符的时间复杂度是 O(n)，也就是说，字符串越长，找到某个特定字符需花费的时间也越多。

## Python 中的字符串

python 中的字符串就是一个 Unicode 字符序列。

字节是字节，字符是使用某种编码方式编码而成，字符串则是一个字符的序列。

```py
s = '深入 Python'
len(s)
s[0]
s + '3'
```

## 字符串格式化

最简单的是使用占位符 `{nth}`。

```py
username = 'mark'
password = 'PapayaWhip'
"{0}'s password is {1}".format(username, password)
```

另外，占位符可以使用更复杂的表达式。

```py
si_suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
'1000{0[0]} = 1{0[1]}'.format(si_suffixes)
```

所以下边这个不难理解了吧？

```py
import humansize, sys
'1MB = 1000{0.modules[humansize].SUFFIXES[1000][0]}'.format(sys)
```

注意，上面 modules 引用 humansize 不需要用引号。

另外，还可以使用格式控制字符，类似 c 语言的 `printf` 函数。

```py
'{0: .1f} {1}'.format(698.24, 'GB')
```

## 字符串方法

- `splitlines()` 将多行字符串拆分成字符串数组
- `lower()` 小写格式，`upper()` 大写格式
- `count(substring)` 统计 substring 的出现次数
- `split(substring)` 拆分字符串为数组

```py
query = 'user=pilgrim&database=master&password=PapayaWhip'
a_list = query.split('&')
a_list_of_lists = [v.split('=', 1) for v in a_list if '=' in v]
a_dict = dict(a_list_of_lists)
```

上边模拟了一个解析 URL 字符串的代码，实际的情况会更加复杂，可以使用 `urllib.parse.parse_qs()` 方法来解析。

## 字符串切片

同 list 切片。

```py
a_string = 'My alphabet starts where your alphabet ends.'
a_string[3:11]
a_string[3:-3]
a_string[0:2]
a_string[:18]
a_string[18:]
```

## 字符串 vs 字节

定义字节类型，字符串前添加 `b` 前缀（注意范围在 0~255 之间）。

```py
by = b'abcd\x65'
type(by)
len(by)
by += b'\xff'
by
by[0]
by[0] = 102 # TypeError
```

`bytes` 对象是不可变的，因此上边直接给字节重新赋值会抛出 TypeError 异常。可以使用字符串截取、`+`、或者将 `bytes` 对象转化为 `bytearray` 对象。

```py
by = b'abcd\x65'
barr = bytearray(by)
barr[0] = 102
barr
```

**绝对，绝对不要将 bytes 和 strings 混合在一起使用**。

```py
by = b'd'
s = 'abcde'
by + s # TypeError
s.count(by) # TypeError
s.count(by.decode('ascii')) # ok
```

bytes 对象有 `decode()` 方法将字节按照某种编码方式转化为字符串。strings 对象也有 `encode()` 方法将字符串按照某种编码方式转化为字节对象。

```py
a_string = '深入 Python'
len(a)
by = a_string.encode('utf-8')
len(by)
by = a_string.encode('gb18030')
len(by)
by = a_string.encode('big5')
len(by)
roundtrip = by.decode('big5')
a_string == roundtrip
```

## python 源文件编码

Python3 文件默认编码为 utf-8，Python2 文件默认编码为 ASCII。

另外，可以在文件头部指定编码方式。

```py
# -*- coding: windows-1252 -*-
```
