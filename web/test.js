const buffer = Buffer.from('http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding');

// encode
const base64Str = buffer.toString('base64');

// decode
const originBuffer = Buffer.from(base64Str, 'base64');

// aHR0cDovL2RldmRvY3MuaW8vZG9tL3dpbmRvd2Jhc2U2NC9iYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5n
console.log(base64Str);

// http://devdocs.io/dom/windowbase64/base64_encoding_and_decoding
console.log(originBuffer.toString('utf8'));
