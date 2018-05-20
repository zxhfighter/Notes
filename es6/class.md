# class

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        console.log(`x = ${this.x}, y = ${this.y}`);
    }
}

class Point3D extends Point {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    toString() {
        console.log(super.toString() + `, z = ${this.z}`);
    }
}
```

==>

```js
var Point = (function() {

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    Point.prototype.toString = function () {
        console.log(`x = ${this.x}, y = ${this.y}`);
    };

    return Point;
}());

var Point3D = (function(_super) {

    _extends(Point3D, _super);

    function Point3D(x, y, z) {
        var _this = _super.call(this, x, y) || this;
        _this.z = z;
        return _this;
    }

    Point3D.prototype.toString = function () {
        console.log(_super.prototype.toString.call(this) + (", z = " + this.z));
    };

    return Point3D;
}(Point));
```

