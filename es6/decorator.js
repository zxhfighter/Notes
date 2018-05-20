var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function tag(tagId) {
    console.log("outer: " + tagId);
    return function (target) {
        console.log("inner: " + tagId);
        target.tagId = tagId;
    };
}
var X = (function () {
    function X() {
    }
    return X;
}());
X = __decorate([
    tag(3),
    tag(2),
    tag(1)
], X);
function log() {
    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = function () {
            console.log("Calling " + name + " with", arguments);
            return oldValue.apply(null, arguments);
        };
        return descriptor;
    };
}
var BaseMath = (function () {
    function BaseMath() {
    }
    BaseMath.prototype.add = function (a, b) {
        return a + b;
    };
    return BaseMath;
}());
__decorate([
    log()
], BaseMath.prototype, "add", null);
var math = new BaseMath();
math.add(2, 4);
