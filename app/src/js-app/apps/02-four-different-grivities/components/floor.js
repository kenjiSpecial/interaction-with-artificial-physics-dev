var Vector2 = require('ks-vector').Vector2;
var Rectangle = require('./rectangle.js');

var Floor = function( x, y, wid, hig){
    Rectangle.call(this, 0, x, y, wid, hig);
};

Floor.prototype = Object.create(Rectangle.prototype);
Floor.prototype.constructor = Floor;




module.exports = Floor;
