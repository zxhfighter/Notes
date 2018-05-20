# 序列化 Python 对象

序列化和反序列化，需要引入 `pickle` 标准库模块。

```py
import pickle, time

entry = {}
entry['title'] = 'Dive into history, 2009 edition'
entry['comments_link'] = None
entry['internal_id'] = b'\xDE\xD5\xB4\xF8'
entry['tags'] = ('diveintopython', 'docbook', 'html')
entry['published'] = True
entry['published_date'] = time.strptime('Fri Mar 27 22:20:42 2009')
```

## pickle

### 序列化

使用 `pickle.dump()` 来序列化对象保存到文件。

```py
import pickle
with open('entry.pickle', 'wb') as f:
    pickle.dump(entry, f)
```

### 反序列化

使用 `pickle.load()` 来反序列化文件到对象。

```py
import pickle
with open('entry.pickle', 'rb') as f:
    entry = pickle.load(f)
```

`pickle.dump()` / `pickle.load()` 循环的结果是一个和原始数据结构等同的新的数据结构。

```py
# True, 内容相同
entry2 == entry

# False, 但是不是同一个对象了
entry2 is entry
```

### 序列化到字节对象

除了序列化到文件，还可以序列化到内存字节数组。

```py
b = pickle.dumps(entry)
entry3 = pickle.loads(b)
```

注意，两个方法相比序列化到文件方法名称多了 `s`。

### 调试 pickle 文件

使用 `pickletools.dis()` 方法来查看具体的内容。

```py
import pickletools

with open('entry.pickle', 'rb') as f:
    pickletools.dis(f)

highest protocol among opcodes = 3
```

这个反汇编中最有趣的信息是最后一行, 因为它包含了文件保存时使用的 pickle 协议的版本号（opcodes）。

## json

如果跨语言兼容是你的需求之一，你得去寻找其它的序列化格式。一个这样的格式是 json。

### 数据保存至 JSON 文件

使用 `json.dump()` 来将数据保存至文件流。

```py
import json
with open('basic.json', mode='w', encoding='utf-8') as f:
    json.dump(entry, f, indent=2)
```

映射关系如下：

- dictionary: object
- array: list
- string: string
- integer: integer
- float: real number
- True: true
- False: false
- None: null

另外，元组（tuple）和字节串（bytes）需要怎样转换呢？

### 序列化json不支持的数据类型

json 模块提供了编解码未知数据类型的扩展接口。

可以自定义序列化格式（其他结构会使用默认规则，不需要手动指定）。

```py
def to_json(python_object):
    # 如果是时间结构，返回一个字典
    if isinstance(python_object, time.struct_time):
        return {'__class__': 'time.asctime',
                '__value__': time.asctime(python_object)}
    # 如果是字节，返回一个字典
    if isinstance(python_object, bytes):
        return {'__class__': 'bytes',
                '__value__': list(python_object)}
    raise TypeError(repr(python_object) + ' is not JSON serializable')
```

使用的时候，指定 `default` 转化方法。

```py
with open('entry.json', 'w', encoding='utf-8') as f:
    json.dump(entry, f, default=to_json)
```

### 从json文件加载数据

使用 `json.load()` 来加载 JSON 数据。

同样，读取时，如果有特殊结构（字节数组等），也需要定义一个转换函数。

```py
def from_json(json_object):
    if '__class__' in json_object:
        if json_object['__class__'] == 'time.asctime':
            return time.strptime(json_object['__value__'])
        if json_object['__class__'] == 'bytes':
            return bytes(json_object['__value__'])
    return json_object

with open('entry.json', 'r', encoding='utf-8') as f:
    entry = json.load(f, object_hook=from_json)
```

有一个注意点，json 并不区分元组和列表，因此原来的元组读取后会变成列表。
