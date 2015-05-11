var TweenLite = require('gsap');
var _ = require('lodash');
var AppAction = require('../../../actions/app-action');
var CONSTANT_DATA = require('../../../utils/constants_app');

var Background = function () {
    _.bindAll(this, 'onCompleteHandler');
}

Background.prototype = {
    start: function () {
        this.isAnimation = true;

        var windowWid = window.innerWidth;
        if (windowWid < CONSTANT_DATA.MIN_WIDTH) windowWid = CONSTANT_DATA.MIN_WIDTH;
        this.width = windowWid;

        var windowHig = window.innerHeight;
        if (windowHig < CONSTANT_DATA.MIN_HEIGHT) windowHig = CONSTANT_DATA.MIN_HEIGHT;
        this.height = windowHig;

        console.log(this.height);

        TweenLite.to(this, .8, {width: 0, ease: Expo.easeInOut, onComplete: this.onCompleteHandler})
    },

    update: function (ctx) {
        if (!this.isAnimation) return;

        ctx.fillStyle = "#000";
        //ctx.fillRect(window.innerWidth - this.width, 0, this.width, this.height);
        ctx.fillRect(0, 0, this.width, this.height);
    },

    onCompleteHandler: function () {
        this.isAnimation = false;

        AppAction.onBackgroundAnimationDone();
    }
}

module.exports = Background;

