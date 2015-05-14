var TweenLite = require('gsap');
var Promise = require('bluebird');
var _ = require('lodash');

var LoadView = function(){
    _.bindAll(this, 'removeLoadView')
    this.loader = document.getElementById("loader");
    this.loaderContent = document.getElementById("loader-content");
    this.ballArr = this.loader.querySelectorAll(".ball");
    this.loadText = this.loader.querySelectorAll(".letter");
    this.appMainWrapper = document.getElementById("main-wrapper")
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


    TweenLite.to(this.loaderContent, .8, {y : -window.innerHeight, delay: .6, ease: Expo.easeInOut, onComplete: this.removeLoadView.bind(this)});

    return Promise.delay(600);
};

LoadView.prototype.removeLoadView = function() {
    this.loader.style.display = "none";

    removeClass(this.appMainWrapper, "full-screen");
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}


var loadView = new LoadView();
module.exports = loadView;
