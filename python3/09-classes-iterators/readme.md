# 类和迭代器

迭代器在 Python3 中无处不在，迭代器的实现需要用类来实现。

```py
# 定义一个迭代器类
class Fib:
    '''iterator that yields numbers in the Fibonacci sequence'''

    # 实例化后立即运行，类似构造函数
    def __init__(self, max):

        # 定义实例属性
        self.max = max

    # 有这个方法的类才是迭代器，迭代器开始的初始化工作，然后一般返回自身
    # 返回的对象需要有 __next__ 方法
    def __iter__(self):
        self.a = 0
        self.b = 1
        return self

    # 调用 next() 执行的方法
    def __next__(self):
        fib = self.a
        if fib > self.max:
            # 迭代器没有值了，或者异常，终止迭代
            raise StopIteration

        self.a, self.b = self.b, self.a + self.b

        # 返回迭代值
        return fib

# 不需要用 new 来实例化对象
fib = fibonacci2.Fib(100)
fib.__class__
fib.__doc__

# for...in 会自动调用 next()
for n in Fib(1000):
    print(n, end=' ')
```

有几个点需要注意下：

- 类名一般大写
- 双下划线开头的函数为类内部方法
- `__init__` 函数不是构造函数，属于实例化后第一个调用的方法
- 类方法的第一个参数都必须是当前实例的引用，一般约定俗成为 `self`
- 新建对象不需要使用 `new`
- 一个迭代器就是定义有 `__iter__()` 方法的类，其中该方法返回的对象必须具有 `__next__()` 方法
- 实例的 `__class__` 为类的原型对象，修改这个原型对象会影响到对象的所有实例化对象

现在可以用迭代器来实现之前将单词变复数的功能。

```py
class LazyRules:

    rules_filename = 'plural6-rules.txt';

    def __init__(self):
        self.pattern_file = open(self.rules_filename, encoding='utf-8')
        self.cache = []

    def __iter__(self):
        self.cache_index = 0
        return self

    def __next__(self):
        self.cache_index += 1
        if len(self.cache) >= self.cache_index:
            return self.cache[self.cache_index - 1]

        if self.pattern_file.closed:
            raise StopIteration

        line = self.pattern_file.readline()
        if not line:
            self.pattern_file.close()
            raise StopIteration

        pattern, search, replace = line.split(None, 3)
        funcs = build_match_apply_functions(pattern, search, replace)
        self.cache.append(funcs)
        return funcs

rules = LazyRules()
```

优点：

- 最小的启动开销
- 最大的运行性能，使用了 cache 缓存函数规则
- 代码和数据分离

缺点：

文件打开一直没有关闭，一直会占有内存（可以一次性打开，获取数据，然后关闭，也可以使用其他方式优化），不过代码会变得更加复杂。

编程即是设计，而设计牵扯到所有的权衡和限制。让一个文件一直打开太长时间可能是问题；让你代码太复杂也可能是问题。哪一个是更大的问题，依赖于你的开发团队，你的应用，和你的运行环境。