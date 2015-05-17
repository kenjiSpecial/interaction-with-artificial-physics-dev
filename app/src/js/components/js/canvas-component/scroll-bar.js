var AppStore = require('../../../stores/app-store');
var CONSTANTS_DATA = require('../../../utils/constants_app');
var _ = require('lodash');
var Top = 60;

var ScrollBar = function(){
    this.x = 0;
};

ScrollBar.prototype = {
    update : function(ctx) {
        var cameraPosY = AppStore.get("cameraPosY");
        var top = Top - cameraPosY;

        var cameraPosX = AppStore.get("cameraPosX");
        var scrollX = AppStore.get("scrollX") - cameraPosX;

        var rate = (scrollX - AppStore.get("minScrollX")) / (AppStore.get("maxScrollX") - AppStore.get("minScrollX"));

        var windowWid = window.innerWidth;
        if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(windowWid, top);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.stroke();

        var wid = 50;
        var hig = 3;
        var xPos = (windowWid - wid) * rate;
        if(xPos < 0) xPos = 0;
        if( xPos > windowWid -wid ) xPos = windowWid -wid;

        ctx.fillStyle = "#000";
        ctx.fillRect(xPos, top-hig, wid, hig);
    }
};

module.exports = ScrollBar;
