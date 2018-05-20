import urllib.request
from http.client import HTTPConnection

def main():
    HTTPConnection.debuglevel = 1
    fetch_data()

def fetch_data():
    url = 'http://www.qq.com'
    response = urllib.request.urlopen(url)
    print(response.headers.as_string())

    data = response.read()
    print(len(data))

if __name__ == '__main__':
    main()