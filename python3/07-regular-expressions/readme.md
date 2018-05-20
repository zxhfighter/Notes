# 正则表达式

正则表达式可以用来快速检索、替换和提取特定模式的文本，相关功能由标准库 `re` 模块提供。

正则表达式可以由字符串表示，字符串表示时一些特殊字符需要转义，例如 `\\bROAD$` 中的反斜杠就需要用反斜杠来转义。

正则表达式也可以用字面量表示，以 `r` 开头，跟上字符串。

## 替换字符串

使用 `re.sub()` 来替换字符串。

```js
re.sub(pattern, replacement, originStr)
```

```py
import re
s = '100 NORTH MAIN ROAD'
re.sub('ROAD$', 'RD.', s)

s = '100 BROAD'
re.sub('\\bROAD$', 'RD.', s)
re.sub(r'\bROAD$', 'RD.', s)

s = '100 BROAD ROAD APT. 3'
re.sub(r'\bROAD$', 'RD.', s)
re.sub(r'\bROAD\b', 'RD.', s)
```

## 搜索字符串

使用 `re.search()` 来检测字符串是否包含某种模式，若包含，返回一个匹配对象，否则返回 None.

```js
re.search(pattern, originStr)
```

```py
import re

# 检测罗马数字的千分位
# '^M{0,3}$'
pattern = '^M?M?M?$'
re.search(pattern, 'M')
re.search(pattern, 'MM')
re.search(pattern, 'MMM')
re.search(pattern, 'MMMM')
re.search(pattern, '')

# 检测罗马数字的百分位
pattern = '^M?M?M?(CM|CD|D?C?C?C?)$'
re.search(pattern, 'MCM')
re.search(pattern, 'MMMCCC')
re.search(pattern, 'MCMC')

# 检测十分位
pattern = '^M?M?M?(CM|CD|D?C?C?C?)(XC|XL|L?X?X?X?)$'
re.search(pattern, 'MCMLXXX')
re.search(pattern, 'MCMLXXXX')

# 检测个位
pattern = '^M?M?M?(CM|CD|D?C?C?C?)(XC|XL|L?X?X?X?)(IX|IV|V?I?I?I?)$'
pattern = '^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$'
re.search(pattern, 'MMMDCCCLXXXVIII')
re.search(pattern, 'I')
```

## 正则表达式的松散写法

为了增加正则表达式的可读性，可以采用正则表达式的松散写法。

- 使用 `'''` 开头和结束
- 忽略空格，缩进，回车等
- 忽略 `#` 注释

注意，调用 `search()` 方法时最后需要添加 `re.VERBOSE` 标志。

```py
pattern = '''
    ^                   # beginning of string
    M{0,3}              # thousands - 0 to 3 Ms
    (CM|CD|D?C{0,3})    # hundreds - 900 (CM), 400 (CD), 0-300 (0 to 3 Cs),
                        #            or 500-800 (D, followed by 0 to 3 Cs)
    (XC|XL|L?X{0,3})    # tens - 90 (XC), 40 (XL), 0-30 (0 to 3 Xs),
                        #        or 50-80 (L, followed by 0 to 3 Xs)
    (IX|IV|V?I{0,3})    # ones - 9 (IX), 4 (IV), 0-3 (0 to 3 Is),
                        #        or 5-8 (V, followed by 0 to 3 Is)
    $                   # end of string
    '''

re.search(pattern, 'M', re.VERBOSE)
re.search(pattern, 'M')
```

## compile 方法

`compile()` 方法可以对指定的正则表达式进行编译。

```py
phonePattern = re.compile(r'^(\d{3})-(\d{3})-(\d{4})$')
phonePattern.search('800-555-1212').groups()

phonePattern.search('800-555-1212-1234')
phonePattern.search('800-555-1212-1234').groups() # Attribute Error

phonePattern = re.compile(r'^(\d{3})\D+(\d{3})\D+(\d{4})\D+(\d+)$')
phonePattern.search('800 555 1212 1234').groups()

phonePattern = re.compile(r'''
                # don't match beginning of string, number can start anywhere
    (\d{3})     # area code is 3 digits (e.g. '800')
    \D*         # optional separator is any number of non-digits
    (\d{3})     # trunk is 3 digits (e.g. '555')
    \D*         # optional separator
    (\d{4})     # rest of number is 4 digits (e.g. '1212')
    \D*         # optional separator
    (\d*)       # extension is optional and can be any number of digits
    $           # end of string
    ''', re.VERBOSE)

phonePattern.search('work 1-(800) 555.1212 #1234').groups()
phonePattern.search('800-555-1212')
```

## 否定

```py
re.search('[^aeiou]y$', 'vacancy')
```

## 分组替换

```py
re.sub('([^aeiou])y$', r'\1ies', 'vacancy')
```

## 常见模式

- ^ 匹配开头，$ 匹配结尾
- \b 匹配字符边界，\B 匹配非字符边界
- \s 匹配空格，\S 匹配非空格
- \w 匹配字符，\W 匹配非字符
- \d 匹配数字，\D 匹配非数字
- x? x 可选
- x* x 出现 0 到多次
- x+ x 出现 1 到多次
- x{n, m} x 出现 n 到 m 次
- (a|b|c) 匹配单独的任意一个a或者b或者c
- [abc] a 或 b 或 c
- (x) 分组
