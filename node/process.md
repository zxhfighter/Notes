# Process

- process.pid

```
$ ps aux
```

```js
console.log(process.pid)
```

- process.stdin

```js
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    var input = process.stdin.read();
    // ...
});
```

- process.stdout
- process.stderr
- process.env
- process.argv
- process.exit()

```
$ kill pid # SIGTERM
$ kill -s SIGINT pid # SIGINT
```

```js
process.exit(0)
process.exit(1)

process.on('exit', () => {
    // do something when the script exits
})

// do something when uncaught exception happens
process.on('uncaughtException', err => {
    console.log(err.stack);
})

// don't exit, wait for input
process.stdin.resume();

// got an CTRL+C interrupt signal
process.on('SIGINT', () => {
    console.log('Got a SIGINT, Exiting');
    process.exit(0);
});

// got an terminate signal, e.g. kill pid
process.on('SIGTERM', () => {
    console.log('Got a SIGTERM, Exiting');
    process.exit(0);
})
```

- shebang

```
#!/usr/bin/env node
console.log('hello, node script')
```

