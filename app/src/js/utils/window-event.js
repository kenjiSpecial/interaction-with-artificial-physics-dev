var MOUSE_MOVE = "mousemove"
var MOUSE_DOWN = "mousedown";
var MOUSE_UP   = "mouseup";
var MOUSE_OUT  = "mouseout";

var prevMouseX, prevMouseY;

var CONSTANTS = require('../utils/constants');
var AppStore = require('../stores/app-store');
var WorkStore = require('../stores/work-store');
var AppAction = require('../actions/app-action');

var mouse;

function onMouseMoveHandler(ev){
    ev = ev || window.event;
    var curMouseX, curMouseY;
    var dx, dy;

    curMouseX = ev.x ? ev.x : ev.clientX;
    curMouseY = ev.y ? ev.y : ev.clientY;

    dx = curMouseX - prevMouseX;
    dy = curMouseY - prevMouseY;

    AppAction.onMouseMove({ x: dx, y: dy });

    prevMouseX = curMouseX;
    prevMouseY = curMouseY;
}

function onMouseDownHandler(ev){
    document.body.classList.add("dragging");
    ev = ev || window.event;

    prevMouseX = ev.x ? ev.x : ev.clientX;
    prevMouseY = ev.y ? ev.y : ev.clientY;

    window.addEventListener(MOUSE_MOVE, onMouseMoveHandler);
    window.addEventListener(MOUSE_UP, onMouseEventEndHandler);

    AppAction.onMouseDownOnWindow();
}

function onMouseEventEndHandler(ev){
    document.body.classList.remove("dragging");

    window.removeEventListener(MOUSE_MOVE, onMouseMoveHandler);
    window.removeEventListener(MOUSE_UP, onMouseEventEndHandler);

    AppAction.onMouseUpOnWindown();
}

// ======================================
// add mouse event on window
function onMouseMoveEventOnHandler(ev){
    if(WorkStore.isSelected()) return;

    window.addEventListener(MOUSE_DOWN, onMouseDownHandler);
    document.body.classList.add("drag");
}

// remove mouse event on window
function onMouseMoveEventOffHandler(ev){
    if(WorkStore.isSelected()) return;


    window.removeEventListener(MOUSE_DOWN, onMouseDownHandler);
    document.body.classList.remove("drag");
    document.body.classList.remove("dragging");
}

window.addEventListener("resize", function(){
    AppAction.onWindowResize();
});

var mainWrapperDom = document.getElementById('main-wrapper');

mainWrapperDom.addEventListener("mouseenter", function(){
    AppAction.onMouseEnter();
});

mainWrapperDom.addEventListener("mouseleave", function(){
    AppAction.onMouseLeave();
});

// ======================================

AppStore.on(CONSTANTS.ON_MOUSE_MOVE_EVENT, onMouseMoveEventOnHandler);
AppStore.on(CONSTANTS.ON_COMPLETE_CAMERA_ANIMATION_FROM_WORK, onMouseMoveEventOnHandler);
AppStore.on(CONSTANTS.CLOSE_ABOUT_CONTENT_DONE, onMouseMoveEventOnHandler);

AppStore.on(CONSTANTS.OFF_MOUSE_MOVE_EVENT, onMouseMoveEventOffHandler)
AppStore.on(CONSTANTS.ON_CLICK_WORK, onMouseMoveEventOffHandler);
AppStore.on(CONSTANTS.OPEN_ABOUT_CONTENT, onMouseMoveEventOffHandler);

