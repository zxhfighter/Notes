console.log(1)

setTimeout(() => {
    console.log(2)
})

new Promise(resolve => {
    console.log(3);

    for (let i = 0; i < 99; i++) {
        if (i === 55) resolve(i);
    }

    console.log(4);
})
.then(i => {
    console.log(i)
})
.then(() => {
    console.log(6)
})

console.log(7)