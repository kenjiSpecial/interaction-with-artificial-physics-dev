var TweenLite = require('gsap');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CONSTANT_DATA = require('../../js/utils/constants_app');
var AppStore = require('../../js/stores/app-store');

var Background = function () {
    EventEmitter.call(this);
    _.bindAll(this, 'onCompleteHandler', 'onCompleteStopAnimationHandler');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
}

Background.prototype = Object.create(EventEmitter.prototype); // See note below

// Set the "constructor" property to refer to Student
Background.prototype.constructor = Background;

Background.prototype.start = function () {
    this.isAnimation = true;

    this.width = AppStore.getWindowWidth();
    this.height = AppStore.getWindowHeight();

    TweenLite.to(this, .8, {width: -3, ease: Power3.easeInOut, onComplete: this.onCompleteHandler})
};

Background.prototype.reset = function () {
    this.isAnimation = false;
    this.width = -3;
}

Background.prototype.update = function (ctx) {
    if (!this.isAnimation) return;

    var left = AppStore.getWindowWidth() - this.width;
    var height = AppStore.getWindowHeight();

    //ctx.clearRect(0, 0, left, height);

    if (this.width > 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(left, 0, this.width, height);
    }

}

Background.prototype.onCompleteHandler = function () {
    this.isAnimation = false;
}

Background.prototype.stop = function () {
    this.isAnimation = true;
    this.width = -3;

    TweenLite.to(this, .8, {
        width: window.innerWidth + 3,
        ease: Power3.easeInOut,
        onComplete: this.onCompleteStopAnimationHandler
    })
}

Background.prototype.onCompleteStopAnimationHandler = function () {


    setTimeout(function () {
        this.emit("ON_COMPLETE_STOP_ANIMATION");

        this.isAnimation = false;
    }.bind(this), 500);
}


module.exports = new Background();
