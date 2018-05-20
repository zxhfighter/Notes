# 闭合和迭代器

本小节会通过一个例子，英语名词变复数的形式讲解**高阶函数**、**正则表达式的进阶用法**以及**生成器**。

## 普通函数

最简单的方式是使用正则表达式：

```py
import re

def plural(noun):
    # match s, or x, or z, but only one of them
    if re.search('[sxz]$', noun):
        # $ is the end of the string
        return re.sub('$', 'es', noun)
    # negative ^
    elif re.search('[^aeioudgkprt]h$', noun):
        return re.sub('$', 'es', noun)
    # negative ^
    elif re.search('[^aeiou]y$', noun):
        return re.sub('y$', 'ies', noun)
    else:
        return noun + 's'
```

## 高阶函数

Python 中一切皆是对象，函数也是，函数可以用作参数传递，也可以作为参数返回。

返回函数的函数称之为高阶函数。

对上面的例子优化，可以将检测规则和替换规则都定义成函数，然后循环这些函数列表。

```py
import re

def match_sxz(noun):
    return re.search('[sxz]$', noun)

def apply_sxz(noun):
    return re.sub('$', 'es', noun)

rules = ((match_sxz, apply_sxz))

def plural(noun):
    for matches_rule, apply_rule in rules:
        if matches_rule(noun):
            return apply_rule(noun)
```

可以看到，rules 是一个函数对元组的序列。

## 函数工厂

还可以进一步抽象，可以定义一个工厂函数，返回函数元组对，这样可以将规则数据与代码逻辑分来开。

```py
import re

def build_match_and_apply_functions(pattern, search, replace):
    def matches_rule(word):
        return re.search(pattern, word)
    def apply_rule(word):
        return re.sub(search, replace, word)
    return (matches_rule, apply_rule)

patterns = (
    ('[sxz]$',           '$',  'es'),
    ('[^aeioudgkprt]h$', '$',  'es'),
    ('(qu|[^aeiou])y$',  'y$', 'ies'),
    ('$',                '$',  's')
)

rules = [build_match_and_apply_functions(pattern, search, replace)
         for (pattern, search, replace) in patterns]
```

## 数据和代码分离

还可以将规则数据保存到一个独立文件，然后使用 `with open()` 语句打开文件读取规则内容。

```py
rules = []
with open('plural4-rules.txt', encoding='utf-8') as pattern_file:
    for line in pattern_file:
        # 针对空白分隔 3 次，丢弃该行剩下的部分
        pattern, search, replace = line.split(None, 3)
        rules.append(build_match_and_apply_functions(
                pattern, search, replace))
```

注意的是，文件存储是以位存储，因此需要读取时指定编码方式。

## 生成器

可以使用 `yield` 来自动获取下一个值。

看个斐波那契的例子。

```py
def fib(max):
    a, b = 0, 1
    while a < max:
        yield a
        a, b = b, a + b

# 调用 next 获取下一个值
fib1 = fib(1000)
fib1.next()
fib1.next()
fib1.next()

# 使用 for 循环会自动调用迭代器的 next() 方法
for n in fib(1000):
    print(n, end=' ')

# 使用数组初始化，也会自动调用迭代器的 next() 方法
list(fib(1000))
```

因此上边的例子可以改写如下，rules 方法现在是一个生成器。

```py
def rules(rules_filename):
    with open(rules_filename, encoding='utf-8') as pattern_file:
        for line in pattern_file:
            pattern, search, replace = line.split(None, 3)
            yield build_match_and_apply_functions(pattern, search, replace)

def plural(noun, rules_filename='plural5-rules.txt'):
    for matches_rule, apply_rule in rules(rules_filename):
        if matches_rule(noun):
            return apply_rule(noun)
    raise ValueError('no matching rule for {0}'.format(noun))
```

不过上面代码存在性能问题，每次调用 plural 都会重新打开文件，文件 I/O 又是很慢的，后面可以自己来写迭代器来解决。

最后，生成器是懒执行的，只有在实际调用时才会执行。
