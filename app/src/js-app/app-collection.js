var CONSTANTS = require('../js/utils/constants');
var CONSTANTS_DATA = require('../js/utils/constants_app');

var WorkStore = require('../js/stores/work-store');
var AppStore = require('../js/stores/app-store');
var AppAction = require('../js/actions/app-action');

var appCollection = [];

var canvasApp = require('../js/components/js/canvas-app');
var ticker = require('../js/utils/ticker');

var backgroundWhite = require('./component/background-white');

// =============
//   component
// =============

var BoilerApp = require('./apps/boiler-plate/app');
var DemoApp   = require('./apps/sample/demo-app');

// ==========

var selectedNumber;
var app;
var windowWid, windowHig;


function initialize(){
    windowWid = window.innerWidth;
    if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

    windowHig = window.innerHeight;
    if(windowHig < CONSTANTS_DATA.MIN_HEIGHT) windowHig = CONSTANTS_DATA.MIN_HEIGHT;

    appCollection.push(new DemoApp());

    WorkStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);
    AppStore.on(CONSTANTS.ON_WINDOW_RESIZE, onWindowResize);
    backgroundWhite.on("ON_COMPLETE_STOP_ANIMATION", onCompleteStopAnimationHandler)
}

function start(){
    var data = WorkStore.getWorkData();
    selectedNumber = data.workNum
    app = appCollection[selectedNumber];
    backgroundWhite.start();

    ticker.addListener(CONSTANTS.TICK, update);
}

function stop(){
    //ticker.removeListener(CONSTANTS.TICK, update);
    backgroundWhite.stop();
}

function update(){
    canvasApp.ctx.clearRect(0, 0, windowWid, windowHig);

    app.update(canvasApp.ctx);

    backgroundWhite.update(canvasApp.ctx);
}

function onCompleteStopAnimationHandler(){
    ticker.removeListener(CONSTANTS.TICK, update);
    AppAction.backToIndex();
}

function onWindowResize(){
    windowWid = window.innerWidth;
    if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

    windowHig = window.innerHeight;
    if(windowHig < CONSTANTS_DATA.MIN_HEIGHT) windowHig = CONSTANTS_DATA.MIN_HEIGHT;
}


initialize();

module.exports = appCollection;
