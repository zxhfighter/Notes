console.log(process.pid)
console.log(require.main)

process.stdin.resume();

process.on('SIGINT', () => {
    console.log('Got a SIGINT, Exiting');
    process.exit(0);
});
