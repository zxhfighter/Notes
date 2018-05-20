# 高级迭代器

## re.findall

- `re.findall(pattern, string)` 返回所有匹配

```py
re.findall('[0-9]+', '16 2-by-4s in rows of 8')
re.findall('[A-Z]+', 'SEND + MORE == MONEY')

# 注意这里会有5个匹配，但是 findall 不会返回覆盖在一起的匹配，因此会返回三个
re.findall(' s.*? s', "The sixth sick sheikh's sixth sheep's sick.")
```

## string.join()

- `string.join(list)` 拼接字符串

```py
set(''.join(['SEND', 'MORE', 'MONEY']))
```

- 使用 `assert` 来约束参数

```py
assert 2 + 2 == 5, "Only for very large values of 2"
```

等同于：

```py
if 2 + 2 != 5:
    raise AssertionError('Only for very large values of 2')
```

## ord(...)

- `ord(...)` 函数返回某个字符串的整数码点。

```py
ord('0')
ord('a')
ord('中')
ord('𠮷')
```

## 生成器表达式

- `(expression for item in items)` 为一个生成器表达式，返回一个迭代器

```py
# 数组解析表达式
[x ** 2 for x in range(10)]

# 字典解析表达式
{x:x ** 2 for x in range(10)}

# 集合解析表达式
{x for x in range(10)}

# 生成器表达式
gen = (ord(c) for c in {'E', 'D', 'M', 'O', 'N', 'S', 'R', 'Y'})
list(gen)
next(gen)
next(gen)
```

等同于：

```py
def ord_map(str):
    for c in str:
        yield ord(c)
```

## 迭代器工具

`itertools` 模块提供了很多工具函数。

- `permutations(...)` 返回排列结果

```py
perms = itertools.permutations([1, 2, 3], 2)
next(perms)
next(perms)

perms = itertools.permutations('ABC', 3)
next(perms)
next(perms)

list(itertools.permutations('ABC', 3))
```

- `product(...)` 返回笛卡尔乘积排列

```py
list(itertools.product('ABC', '123'))
```

- `combinations` 返回组合（无序）

```py
list(itertools.combinations('ABC', 2))
```

## 排序

```py
# 返回文件行数组
names = list(open('examples/favorite-people.txt', encoding='utf-8'))

# rstrip 用于去掉 \n 换行符
names = [name.rstrip() for name in names]

# 字母表排序，sorted 为内置函数
help(sorted)
names = sorted(names)

# 也可以按照长度来排序，调用了 len 函数
names = sorted(names, key=len)
```

## 分组

如果一个数组排号序以后，可以对齐进行分组，使用 `groupby(...)` 方法。

```py
help(itertools.groupby)
groups = itertools.groupby(names, len)
for name_length, name_iter in groups:
    print('Names with {0:d} letters:'.format(name_length))
        for name in name_iter:
            print(name)
```

## zip 方法

`itertools.chain(...)` 方法用于拼接数组。

```py
help(itertools.chain)
list(itertools.chain(range(0, 3), range(10, 13)))
```

`zip(...)` 用于将数组一对一拼成元组。

```py
help(zip)
list(zip(range(0, 3), range(10, 13)))
```

如果超出范围，会取最短的拼接。

```py
list(zip(range(0, 3), range(10, 14)))
```

`itertools.zip_longest(...)` 会取最长的拼接，缺失的补充 None.

```py
list(itertools.zip_longest(range(0, 3), range(10, 14)))

characters = ('S', 'M', 'E', 'D', 'O', 'N', 'R', 'Y')
guess = ('1', '2', '0', '3', '4', '5', '6', '7')
tuple(zip(characters, guess))
dict(zip(characters, guess))
```

## 字符串的 translate 方法

字符串的 `translate` 方法可以用来进行字符替换。

```py
help(str.translate)
translation_table = {ord('A'): ord('O')}
'MARK'.translate(translation_table)

'SEND + MORE == MONEY'.translate(translation_table)
```

## eval 表达式

eval 可以动态计算表达式。

```py
help(eval)
eval('1 + 1 == 2')
eval('"MARK".translate({65: 79})')
eval("math.sqrt(x)")
```

但是 eval 能力太大，搞不好就会犯错。

```py
eval("__import__('subprocess').getoutput('rm -rf /')")
```

可以给 eval 添加约束，指定全局变量和局部变量上下文。

```py
# NameError
eval("x * 5", {}, {})

# NameError
eval("math.sqrt(x)", {"x": x}, {})

# NameError，限定 __builtins__ 方法无法访问，因此 __import__ 也无法工作
eval("__import__('subprocess').getoutput('rm -rf /')", {"__builtins__":None}, {})
```

但是，恶意的用户还是有办法来恶作剧，例如：

```py
eval("2 ** 2147483647", {"__builtins__":None}, {})
```

因此，当需要处理用户输入时，尽量避免使用 eval() 来运算用户，需要确保你当前 eval() 的内容。

总的来说: 这个程序通过暴力解决字母算术谜题， 也就是通过穷举所有可能的解法。为了达到目的，它

- 通过 re.findall() 函数找到谜题中的所有字母
- 使用集合和 set() 函数找到谜题出现的所有不同的字母
- 通过 assert 语句检查是否有超过10个的不同的字母 (意味着谜题无解)
- 通过一个生成器对象将字符转换成对应的ASCII码值
- 使用 itertools.permutations() 函数计算所有可能的解法
- 使用 translate() 字符串方法将所有可能的解转换成Python表达式
- 使用 eval() 函数通过求值 Python 表达式来检验解法
- 返回第一个求值结果为 True 的解法

…仅仅14行代码。
