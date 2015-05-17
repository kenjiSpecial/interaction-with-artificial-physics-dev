var Vector2 = require('ks-vector').Vector2;
var WiperRectangle = require('./wiper-rectangle.js');
var TweenLite = require('gsap');;
var AppStore = require('../../../js/stores/app-store');

var Wiper = function( objects ){
    var winWidth = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();
    var size = Math.min(winHeight, winWidth );

    var bigSize = size  / 2;
    var bigRectangle = new WiperRectangle( winWidth/2, winHeight - 40, bigSize + 40, 40 );
    bigRectangle.isBig = true;
    this.bigRectangle = bigRectangle;

    var smallSize = size / 6;
    var smallRectangle = new WiperRectangle( winWidth/2, winHeight - 40, smallSize +40, 40 );
    smallRectangle.parentRectangle = bigRectangle;
    this.smallRectangle = smallRectangle;

    objects.push(bigRectangle);
    objects.push(smallRectangle);
};

module.exports = Wiper;
