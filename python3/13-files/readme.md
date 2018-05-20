# 文件

[TOC]

## 读取文本文件

读取文本文件可以使用内置函数 `open()` 打开。

```
a_file = open('examples/chinese.txt', encoding='utf-8')
```

## 流对象

`open()` 函数返回一个流对象（stream object）。

```py
# 读取整个文件
a_file.read()

# 重新指向文件开头，定位到特定的字节
a_file.seek(0)

# 读取16个字符
a_file.read(16)

# 返回当前指针位置（字节位置）
a_file.tell()
```

其中 `seek()` 和 `tell()` 方法以字节的方式计数，而 `read()` 方法以字符个数计数。

因此，如果一个字符由三个字节构成，而 `seek()` 到其中间字节，重新读取字符会报错，无法解码。

## 关闭文件

文件流对象有个属性 `closed` 指示文件是否关闭，然后可以调用 `close()` 方法关闭文件，释放资源。

```py
if not a_file.closed:
    a_file.close()
```

Python 3 可以使用 with 语句来自动关闭文件，即使发生了异常，整个程序突然中止了。

```py
with open('examples/chinese.txt', encoding='utf-8') as a_file:
    a_file.seek(17)
    a_character = a_file.read(1)
    print(a_character)
```

另外，也可以使用 try...finally 来关闭文件句柄。

## 一次读取一行

流对象也是一个迭代器(iterator)，它能在你每次请求一个值时分离出单独的一行，因此可以使用 for 循环一次读取一行。

```py
line_number = 0
with open('examples/favorite-people.txt', encoding='utf-8') as a_file:
    for a_line in a_file:
        line_number += 1
        # 使用最多4个空格右对齐，rstrip 移除尾随的空白符，包括回车符
        print('{:>4} {}'.format(line_number, a_line.rstrip()))
```

## 写入文本文件

写入文件的方式和从它们那儿读取很相似。首先打开一个文件，获取流对象，然后你调用一些方法作用在流对象上来写入数据到文件，最后关闭文件。

为了写入而打开一个文件，可以使用open()函数，并且指定写入模式。有两种文件模式用于写入：

- “写”模式会重写文件。传递mode='w'参数给open()函数。
- “追加”模式会在文件末尾添加数据。传递mode='a'参数给open()函数。

```py
with open('test.log', mode='w', encoding='utf-8') as a_file:
    a_file.write('test succeeded')

with open('test.log', mode='a', encoding='utf-8') as a_file:
    a_file.write('and again')
```

## 二进制文件

使用 `mode=rb` 来读取，因为是二进制，也不需要编码了。

```py
an_image = open('examples/beauregard.jpg', mode='rb')
an_image.tell()
data = an_image.read(3)
an_image.seek(0)
data = an_image.read()
len(data)
```

写入二进制文件也很方便，指定 `mode=wb` 来写就行了。

## 非文件来源的流对象

使用 `read()` 方法即可从虚拟文件读取数据。

```py
import io
a_string = 'PapayaWhip is the new black.'
a_file = io.StringIO(a_string)
a_file.read()
a_file.seek(0)
a_file.read(10)
```

另外还有一个 `io.ByteIO` 类，它允许你将字节数组当做二进制文件来处理。

## 处理压缩文件

`gzip` 模块允许你创建用来读写 gzip 压缩文件的流对象。

```py
import gzip
with gzip.open('out.log.gz', mode='wb') as z_file:
    z_file.write('A nine mile walk is no joke, especially in the rain.'.encode('utf-8'))
```

## 标准输入、输出和错误

- sys.stdout
- sys.stdin
- sys.stderr

```py
for i in range(3):
    sys.stdout.write('is the')
```

## 标准输出重定向

```py
import sys

class RedirectStdoutTo:
    def __init__(self, out_new):
        self.out_new = out_new

    def __enter__(self):
        self.out_old = sys.stdout
        sys.stdout = self.out_new

    def __exit__(self, *args):
        sys.stdout = self.out_old

print('A')
with open('out.log', mode='w', encoding='utf-8') as a_file, RedirectStdoutTo(a_file):
    print('B')
print('C')
```

其中上面的古怪的 with 语句可以改写如下：

```py
with open('out.log', mode='w', encoding='utf-8') as a_file:
    with RedirectStdoutTo(a_file):
        print('B')
```

另外，`__enter__` 方法在进入一个上下文环境时 Python 会调用它（例如，with 语句的开始处）。

而 `__exit__` 方法，则当离开一个上下文环境时，Python 会调用它。
