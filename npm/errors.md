## npm ERR! Unexpected end of JSON input while parsing near '..."directories":{},"dis'

解决办法：清除缓存，运行 `npm cache clean --force`，新版使用 `npm cache verify`
