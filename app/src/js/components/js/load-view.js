var TweenLite = require('gsap');
var Promise = require('bluebird');
var _ = require('lodash');
var AppStore = require('../../stores/app-store');

var LoadView = function(){
    _.bindAll(this, 'removeLoadView');

    this.loader = document.getElementById("loader");
    this.ballArr = this.loader.querySelectorAll(".ball");
    this.loadText = this.loader.querySelectorAll(".letter");
    this.loadCover = this.loader.querySelector(".loader-cover");
};

LoadView.prototype.fadeOut = function() {
    //return new Promise( )
    Array.prototype.forEach.call(this.ballArr, function(el, i){
        TweenLite.to(el, .5, {opacity: 0});
    });

    var loadTextLength = this.loadText.length - 2;
    Array.prototype.forEach.call(this.loadText, function(el, i){
        TweenLite.to(el, .4, {opacity: 0, delay: (loadTextLength - i) * .03, x: +15, ease: Power3.easeOut});
    });

    var winWidth = AppStore.getWindowWidth();
    TweenLite.to(this.loadCover, .8, {x: -winWidth, delay: .6, ease: Expo.easeInOut, onComplete: this.removeLoadView.bind(this)});

    return Promise.delay(600);
};

LoadView.prototype.removeLoadView = function() {
    this.loader.style.display = "none";
};


var loadView = new LoadView();
module.exports = loadView;
