import httplib2

h = httplib2.Http('.cache')

def main():
    # fetch_data()
    # fetch_data_nocache()
    check_etags()

def fetch_data():
    response, content = h.request('http://www.qq.com')
    print(response.status)
    print(response.fromcache)
    print(len(content))

def fetch_data_nocache():
    response, content = h.request('http://www.qq.com', headers={
        'cache-control': 'no-cache'
    })
    print(response.status)
    print(response.fromcache)
    print(len(content))
    print(dict(response.items()))

def check_etags():
    response, content = h.request('http://diveintopython3.org/')
    print(dict(response.items()))

    response, content = h.request('http://diveintopython3.org/')
    print(dict(response.items()))

if __name__ == '__main__':
    main()
