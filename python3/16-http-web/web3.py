from urllib.parse import urlencode

import httplib2

h = httplib2.Http('.cache')

def main():
    post_data()


def post_data():
    data = {'status': 'Test update from Python 3'}
    h.add_credentials('diveintomark', 'MY_SECRET_PASSWORD', 'identi.ca')
    resp, content = h.request(
        'https://identi.ca/api/statuses/update.xml',
        'POST',
        urlencode(data),
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    print(content.decode('utf-8'))

    url = 'https://identi.ca/api/statuses/destroy/{0}.xml'.format('5131472')
    resp, deleted_content = h.request(url, 'DELETE')

if __name__ == '__main__':
    main()
