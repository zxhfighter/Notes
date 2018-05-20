# what's new in Python 3

- 使用 `2to3` 脚本迁移 python2 到 python3
- python3 中有 `bytes` 和 `strings` 的概念，所有的字符串都是 Unicode 字符串
- `bytes` 和 `strings` 不会隐式转化，并且它们在 python3 中经常出现，需要注意
- 使用 `httplib2` 来处理网络服务请求，HTTP 头信息返回字符串，HTTP 正文返回字节，因此正文需要提供一个编码将字节转化为字符串
- 使用 `ElementTree` 来处理 XML，现在 `ElementTree` 已经添加到了标准库
- 使用 `pickle` 来序列化和反序列化对象
- 使用 PyPI（Python Package Index）来管理第三方 python3 包（类似 npm）
- 迭代器（iterators）在 python3 中无处不在，也需要仔细理解
