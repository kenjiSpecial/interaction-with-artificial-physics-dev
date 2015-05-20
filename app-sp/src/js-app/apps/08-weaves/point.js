
var Point = function(xx, yy) {
    this.x = xx || 0;
    this.y = yy || 0;
    this.baseY = this.y;
    this.vel = 0;
    this.acl = 0;
}

Point.prototype.sePosY = function(value) {
    this.y = this.baseY = value;
}

module.exports = Point;

