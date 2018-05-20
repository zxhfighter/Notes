# Web 服务

Python3 有两个库用来请求 Web 服务。

- `http.client`：底层的，实现了 RFC 2616 规范的 HTTP 协议
- `urllib.request`：基于 `http.client` 的抽象层，提供了标准的 API 访问 HTTP 和 FTP 协议

那一般用哪个呢？**都不用，你应该用 `httplib2`。**这是一个第三方开源的库，比上边两个更好用。

## 缓存控制

Python 标准的 HTTP 库不支持缓存，但是 `httplib2` 支持。

## 上一次修改时间检查

Python 标准的 HTTP 库不支持上一次修改时间检查，但是 `httplib2` 支持。

## Etag 检查

Python 标准的 HTTP 库不支持 Etag 检查，但是 `httplib2` 支持。

## 压缩

Python 标准的 HTTP 库不支持压缩，但是 `httplib2` 支持。

## 重定向

Python 标准的 HTTP 库不支持永久重定向，但是 `httplib2` 支持。


## GET 例子

```py
import httplib2

# 创建一个实例，并创建关联的缓存文件夹
h = httplib2.Http('.cache')

# 请求响应头和内容，其中 response 为对象，content 为字节序列
response, content = h.request('http://diveintopython3.org/examples/feed.xml', headers={'cache-control':'no-cache'})
```

## POST 例子

```py
from urllib.parse import urlencode
import httplib2
httplib2.debuglevel = 1
h = httplib2.Http('.cache')
data = {'status': 'Test update from Python 3'}
h.add_credentials('diveintomark', 'MY_SECRET_PASSWORD', 'identi.ca')
resp, content = h.request(
    'https://identi.ca/api/statuses/update.xml',
    'POST',
    urlencode(data),
    headers={'Content-Type': 'application/x-www-form-urlencoded'}
)
```

## DELETE 例子

```py
url = 'https://identi.ca/api/statuses/destroy/{0}.xml'.format(status_id)
resp, deleted_content = h.request(url, 'DELETE')
```
