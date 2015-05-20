var Vector2 = require('ks-vector').Vector2;
var TweenLite = require('gsap');;
var cw, ch;

var ParticleManager = require('./particle-manager');
var dt = 1 / 30;
var particleNum = 150;
var interactive = "interactive";

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');



function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}

var App = function () {
    this.onMouseDownInCanvasApp = this.onMouseDownInCanvasApp.bind(this);

    this.isBackgroundAnimation = true;

    this.particles = new ParticleManager();
};

App.prototype.start = function() {
    this.canvas = document.getElementById('app-canvas');
    addClass(this.canvas, interactive);

    this.particles.start();

    AppStore.addListener(CONSTANTS.TAP_CANVAS_APP, this.onMouseDownInCanvasApp);
}

App.prototype.stop = function() {
    removeClass(this.canvas, interactive);
    this.particles.stop();

    AppStore.removeListener(CONSTANTS.TAP_CANVAS_APP, this.onMouseDownInCanvasApp);
}

App.prototype.update = function (ctx) {
    var winWidth  = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();

    ctx.fillStyle = "#FFE0B2";
    ctx.fillRect( 0, 0, winWidth, winHeight );

    this.particles.update(dt);
    this.particles.draw(ctx);


};


App.prototype.onMouseDownInCanvasApp = function() {
    this.particles.changePainting()
};

App.prototype.onWindowResize = function() {
    this.particles.onWindowResize();
};

module.exports = App;
