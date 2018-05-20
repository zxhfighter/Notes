# Python 内置类型

python 中的类型不需要显示设置，它能根据设置的值进行类型推断。

python 内置类型有如下几种：

- Booleans: `True` or `False`
- Numbers: `int` 整数(1, 2)，`float` 浮点数(1.1, 1.2)，`fractions.Fraction` 分数（1/2, 2/3）甚至  Decimal 数以及 Complex 复数（3+5j）
- Strings: `str` Unicode 字符序列，用单引号或者双引号括起来
- Bytes: `bytes` 二进制字节数组，例如一个图片文件
- Lists: `list` 有序列表
- Tuples: `tuple` 有序，不变的值序列
- Sets: `set` 无序集合（去重）
- Dictionaries: `dict` 无序 key-value 字典

除了这些类型，还有如下对象类型：

- module
- function
- class & iterators
- files
- compiled code

## 判断类型

使用 `isinstance(var, type)` 来判断变量是否属于类型。

```
>>> isinstance(1, int) # True
>>> isinstance(1.0, int) # False
>>> isinstance(1.0, float) # True
>>> isinstance('1', str) # True
```

另外，可以使用 `type(var)` 来查看类型。

```
>>> type(1) # int
>>> type(1.0) # float
>>> type('1') # str
```

## 布尔类型

在布尔类型上下文环境中，不同的数据类型对于何值为真、何值为假有着不同的规则。

```sh
$ a = 100 if [] else 101
```

## 数值类型

Python 通过是否有 小数 点来分辨整型（int）和浮点型（float）。

整型和浮点型混合运算会得到浮点型数据。

```
type(1)
type(1.0)
```

### 类型转化

直接使用 `type(var)` 进行类型转化。

```
>>> float(2.5) # 2.5
>>> int(2.5) # 2（truncate not round，直接截断取整而不是四舍五入）
>>> int(-2.5) # -2，负数朝0取整
>>> int('2') # 2
>>> int('2.0') # ValueError
>>> float('2.0') # 2.0
```

### 数学运算

```
>>> 11 / 2 # 5.5, floating point division
>>> 11 // 2 # 5, positive, truncate
>>> -11 // 2 # -6, negative, floor
>>> 11.0 / 2 # 5.0
>>> 11 ** 2 # 121（现在 JS 中也有这个运算符了）
>>> 11 % 2 # 1
```

### 分数

分数运算需要引入 `fractions` 模块。

```
>>> import fractions
>>> x = fractions.Fraction(1, 3)
>>> x * 2
>>> fractions.Fraction(6, 4)
>>> fractions.Fraction(0, 0) # raise ZeroDivisionError
```

### 三角函数

三角函数运算需要引入 `math` 模块。

```
>>> import math
>>> math.pi
>>> math.sin(math.pi / 2)
# python does not have infinite precision，Python 并不支持无限精度
# 预期返回，实际返回 0.99999999999999989
>>> math.tan(math.pi / 4)
```

### 数字转布尔

0 值为 False，非 0 值为 Truth。

## 列表（List）

List 和 JavaScript 中的数组很像，可以存储任意类型。

List 可以支持负数逆向取值，如果超出范围会报 IndexError 异常。

```
>>> a_list = [1, True, '1.0', 1.0]
>>> a_list[0] # 1
>>> a_list[3] # 1.0
>>> a_list[-1] # 1.0
>>> a_list[4] # IndexError
```

### 列表切片

列表切片不像 JavaScript 使用 `slice` 方法来切片，而是直接使用 `[start: end]` 语法来进行切片，其中 end 不包括在内。

```
>>> a_list = [1, True, '1.0', 1.0, 2.0]
>>> a_list[1:3] # slice between
>>> a_list[1:-1] # slice between
>>> a_list[:3] # slice from start
>>> a_list[3:] # slice to end
>>> a_list[:] # make a copy of list
```

### 添加元素

方法一，使用 `+` 操作符，需要注意处理大数组相加时的内存消耗问题。

```
>>> a_list = [1, True, '1.0', 1.0, 2.0]
>>> a_list = a_list + [3.0, 4]
```

方法二，使用 `append` 方法，添加单个元素至末尾。

```
L.append(object) -> None -- append object to end

>>> a_list.append(True)
```

方法三，使用 `insert` 方法，添加元素到指定位置（insert(0, x) 实现 `unshift` 功能）。

```
L.insert(index, object) -- insert object before index

>>> a_list.insert(1, False)
```

方法四，使用 `extend` 方法，添加可迭代对象（iterable）元素至末尾。

```
L.extend(iterable) -> None -- extend list by appending elements from the iterable

>>> a_list.extend(['oo', 5])
```

### 移除元素

方法一，使用 `del` 删除指定索引位置的元素。

```
>>> del a_list[1]
```

方法二，使用 `remove()` 删除指定内容的元素（第一次出现的元素，如果不存在了，会抛出 ValueError 的异常）。

```
>>> a_list.remove('new')
```

方法三，使用 `pop()` 方法移除末尾元素（如果指定位置没有待 pop 的元素，会抛出 IndexError 的异常）。

```
L.pop([index]) -> item -- remove and return item at index (default last).
    Raises IndexError if list is empty or index is out of range.

>>> a_list = ['a', 'b', 'new', 'mpilgrim']
>>> a_list.pop()
>>> a_list.pop(1)
```

### 查找元素

使用 `in` 查看列表是否包含某个元素。

```
>>> 'new' in a_list
```

使用 `count()` 方法统计出现次数。

```
>>> a_list.count('new')
```

使用 `index()` 方法查找第一次出现的索引（如果不存在，会报 ValueError 异常，与其它语言返回 -1 不同，这里不返回 -1，是因为 -1 可以作为列表的索引）。

```
>>> a_list.index('mpilgrim')
```

### 列表转布尔

如果为空数组，则为 False，否则为 True。

```
a = 1 if [] else 0
b = 1 if [1] else 0
```

## 元组（Tuples）

一个元组是不可改变的列表（也就是说没有能够变更数组的方法），使用圆括号括起来。

```
>>> a_tuple = ("a", "b", "mpilgrim", "z", "example")
>>> a_tuple[0]
>>> a_tuple[-1]
>>> a_tuple[1:3]
```

具体来说，元组无法调用 `append()`，`insert()`，`extend()`，`remove()`，`pop()` 方法，之所以能够使用 `[start:end]` 语法，是因为该语法创建了一个新的元组。

那为什么要使用元组呢？

- 比列表快
- 更加安全，因为有"写保护"
- 元组还可以用作字典的 key，列表永远不能当做字典键使用，因为列表不是不可变的

### 列表转元组

元组可转换成列表，反之亦然。内建的 tuple() 函数接受一个列表参数，并返回一个包含同样元素的元组，而 list() 函数接受一个元组参数并返回一个列表。

从效果上看， tuple() 冻结列表，而 list() 融化元组。

使用 `tuple(list)` 转化。

### 元组转列表

使用 `list(tuple)` 转化。

### 元组转布尔

空元组为 False，其余为 True。

```
a = 1 if (False,) else 0
b = 1 if () else 0
```

注意，上边第一个表达式中的逗号至关重要，如果没有逗号，会认为是一个表达式外边套了一层括号。

### 使用元组解构

解构其实也是利用了右侧对象的可迭代性。

```
>>> (x, y, z) = ('a', 2, True)
>>> (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY) = range(7)
```

## 集合（Sets）

集合保存了一组无序，独一无二的值，集合用大括号包裹起来。

需要注意，如果是一个空的大括号 `{}`，那么这将是一个字典。

```
>>> a_set = {1}
>>> type(a_set) # <class 'set'>
>>> type({}) # <class 'dict'>
```

### 列表转集合

使用 `set(list)` 将列表转化为集合，会进行去重。

```
>>> a_list = ['a', 'b', 'mpilgrim', True, False, 42, 'a', 'b']
>>> a_set = set(a_list)
```

也可以使用 `set()` 创建一个空的集合。

不过不能使用 `{}` 来创建集合，因为这将会创建一个字典。

```
>>> a_set = set()
>>> len(a_set)
>>> a_dict = {}
>>> type(a_dict)
```

### 集合添加元素

方法一，使用 `add(item)` 添加元素。

```
>>> a_set.add(4)
```

方法二，使用 `update(set)` 添加新的集合。

```
Update a set with the union of itself and others.

>>> a_set.update({2, 4, 6}) # 可以传入集合
>>> a_set.update({3, 6, 9}, {1, 2, 3, 5, 8, 13}) # 可以传入多个集合
>>> a_set.update([10, 20, 30]) # 还可以传入列表
```

### 集合移除元素

方法一，使用 `discard()` 方法根据内容移除元素。

```
>>> a_set = {1, 3, 6, 10, 15, 21, 28, 36, 45}
>>> a_set.discard(10)
>>> a_set.discard(10) // No Exception
```

方法二，使用 `remove()` 方法根据内容移除元素（不存在时，会抛出 KeyError 异常）。

```
>>> a_set.remove(21)
>>> a_set.remove(21) # KeyError Exception
```

方法三，使用 `pop()` 移除元素，由于集合是无序的，因此你永远不知道下一个移除的是哪个元素，最后如果对空集合进行 `pop`，会抛出 KeyError 的异常。

```
>>> a_set = {1, 3, 6, 10, 15, 21, 28, 36, 45}
>>> a_set.pop()
>>> a_set.pop()
>>> a_set.clear()
>>> a_set.pop() # KeyError
```

方法四，使用 `clear()` 清空集合。

```
>>> a_set.clear()
```

### 其余集合操作

使用 `in` 查看集合中是否有哪个元素。

使用 `union()` 获取并集，`intersection()` 获取交集，`difference()` 获取差集，`symmetric_difference()` 获取。

其中除了 `difference()` 不是对称的，其余三个方法都是对称的。

```
>>> a_set = {2, 4, 5, 9, 12, 21, 30, 51, 76, 127, 195}
>>> b_set = {1, 2, 3, 5, 6, 8, 9, 12, 15, 17, 18, 21}
>>> 30 in a_set
>>> a_set.union(b_set)
>>> a_set.intersection(b_set)
>>> a_set.difference(b_set)
>>> a_set.symmetric_difference(b_set) # only exists in one set
```

另外，可以使用 `issubset` 和 `issuperset` 来获取集合之间的关系。

```
>>> a_set = {1, 2, 3}
>>> b_set = {1, 2, 3, 4}
>>> a_set.issubset(b_set)
>>> b_set.issuperset(a_set)
```

### 集合转布尔

空集合为 False，其余则为 True。

```
a = 1 if set() else 0
b = 1 if {1} else 0
```

## 字典（Dictionaries）

### 创建字典

创建字典很容易，使用 `{}` 即可（注意和 Set 的区别）。

```
>>> a_dict = {'server': 'db.diveintopython3.org', 'database': 'mysql'}
>>> a_dict['server']
>>> a_dict['database']
>>> a_dict['db.diveintopython3.org'] # KeyError
```

### 修改字典

```
>>> a_dict['database'] = 'blog'
>>> a_dict['user'] = 'mark'
```

如果 key 不存在，则会添加到字典。

### 遍历字典

使用 `for...in` 遍历字典的 `items()`。

```
>>> for key, value in a_dict.items()
```

### 字典转布尔

空字典为 False，否则为 True。

```
a = 1 if {} else 0
b = 1 if {a: 1} else 0
```

## None

表示一个空值（null）。
