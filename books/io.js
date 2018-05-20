const http = require('http');
const urls = ['www.baidu.com', 'www.so.com', 'www.bing.com'];

function fetchPage(url) {
    const startTime = +new Date();
    http.get({host: url}, res => {
        const ms = +new Date() - startTime;
        console.log(`got response from ${url}, took: ${ms} ms`);
    }).on('error', e => {
        console.log(`got error: ${e.message}`);
    })
}

for (const url of urls) {
    fetchPage(url);
}
