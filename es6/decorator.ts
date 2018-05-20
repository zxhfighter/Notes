function tag(tagId) {
    console.log(`outer: ${tagId}`);
    return function(target) {
        console.log(`inner: ${tagId}`);
        target.tagId = tagId;
    };
}

@tag(3)
@tag(2)
@tag(1)
class X {}


function log() {
    return function(target: any, name: any, descriptor: any) {
        const oldValue = descriptor.value;
        descriptor.value = function () {
            console.log(`Calling ${name} with`, arguments);
            return oldValue.apply(null, arguments);
        };
        return descriptor;
    }
}

class BaseMath {
    @log()
    add(a, b) {
        return a + b;
    }
}

const math = new BaseMath();
math.add(2, 4);
