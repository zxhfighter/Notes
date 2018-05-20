# XML

## 解析 XML

Python可以使用几种不同的方式解析 xml 文档。它包含了 dom 和 sax 解析器，但是我们焦点将放在另外一个叫做 ElementTree 的库上边。

```py
import xml.etree.ElementTree as etree
tree = etree.parse('examples/feed.xml')
root = tree.getroot()
```

### 元素即列表

在 ElementTree API 中，元素的行为就像列表一样。列表中的项即该元素的子元素，该列表只包含直接子元素。

```py
root.tag
for child in root:
    print(child)
```

### 属性即字典

xml 不只是元素的集合；每一个元素还有其属性集。一旦获取了某个元素的引用，我们可以像操作 Python 的字典一样轻松获取到其属性。

可以通过 `attrib` 来获取元素属性字典。

```py
root.attrib
root[4].attrib
```

## 在 XML 文档中查找结点

findfall() 方法查找匹配特定格式的子元素列表，没找到，返回空列表 []。

```py
root.findall('{http://www.w3.org/2005/Atom}entry')
root.findall('{http://www.w3.org/2005/Atom}feed')
```

find() 方法用来返回第一个匹配到的元素，没找到，返回 None。

```py
title_element = entries[0].find('{http://www.w3.org/2005/Atom}title')
```

上边的查询语言使用的是 XPath，不过是"有限的XPath支持"。

## 深入 LXML

lxml 是一个开源的第三方库，以流行的 libxml2 解析器为基础开发。提供了与 ElementTree 完全兼容的 api，并且扩展它以提供了对 XPath 1.0 的全面支持，以及改进了一些其他精巧的细节。

```py
from lxml import etree
tree = etree.parse('examples/feed.xml')
root = tree.getroot()
root.findall('{http://www.w3.org/2005/Atom}entry')
```

但是 lxml 不只是一个更快速的 ElementTree。它的 findall() 方法能够支持更加复杂的表达式。

```py
tree.findall('//{http://www.w3.org/2005/Atom}*[@href]')
tree.findall("//{http://www.w3.org/2005/Atom}*[@href='http://diveintomark.org/']")
tree.findall('//{NS}author[{NS}uri]'.format(NS=NS))
```

## 生成 XML

Python 对 xml 的支持不只限于解析已存在的文档。我们也可以从头来创建 xml 文档。

```py
import lxml.etree
NSMAP = {None: 'http://www.w3.org/2005/Atom'}
new_feed = lxml.etree.Element('feed', nsmap=NSMAP)
print(lxml.etree.tounicode(new_feed))
new_feed.set('{http://www.w3.org/XML/1998/namespace}lang', 'en')

title = lxml.etree.SubElement(new_feed, 'title', attrib={'type':'html'})
title.text = 'dive into &hellip;'
```

## 解析破损的 XML

例如下边就是一个破损的 XML 片段，因为字符实体 `&hellip;` 在 XML 没有被定义。

```xml
<?xml version='1.0' encoding='utf-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xml:lang='en'>
  <title>dive into &hellip;</title>
...
</feed>
```

使用 lxml 的 recover 模式读取如下：

```py
parser = lxml.etree.XMLParser(recover=True)
tree = lxml.etree.parse('examples/feed-broken.xml', parser)
parser.error_log

tree.findall('{http://www.w3.org/2005/Atom}title')
title = tree.findall('{http://www.w3.org/2005/Atom}title')[0]
title.text
print(lxml.etree.tounicode(tree.getroot()))
```

由于不知道如果处理该未定义的 `&hellip;` 实体，解析器默认会将其省略掉。title 元素的文本内容变成了'dive into '。