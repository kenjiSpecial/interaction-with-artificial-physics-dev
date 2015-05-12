var AppDispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CONSTANTS = require('../utils/constants');
var appData = require('../data/app-data');
var _apps = {
    isLoad: false,
    isTransition: false,
    isMenuOpen : false,
    isMenuAnimation : false,

    selectedClassName : "app",
    works : [],
    images : {}

}

var AppStore = assign({}, EventEmitter.prototype, {
    get: function (id) {
        return _apps[id];
    },

    getAll: function () {
        return _apps;
    },

    isMenuOpen : function() {
        return _apps.isMenuOpen;
    },

    selectedClassName : function(){
        return _apps.selectedClassName;
    },

    // ================================

    loadStart : function() {
        _apps.isTransition = true;
        this.emit(CONSTANTS.LOAD_START);
    },

    loadDone : function(images) {
        // set Work Data to _apps
        for(var ii in appData.works){
            var workName = appData.works[ii];
            var workID = workName.replace(/ /g,"-").toLowerCase();

            var workObj = { id: workID, workNum: ii, name : workName }

            _apps.works.push(workObj);

            //_apps.workTotalSize += constants.workGap;
        }

        // ------------------------
        // set image data to _apps

        console.log(images);
        for(var prop in images){
            var image = images[prop];
            _apps.images[prop] = image;
        }


        _apps.isLoad = true;

        this.emit(CONSTANTS.LOAD_DONE);
    },

    openMenu : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = true;

        this.emit(CONSTANTS.OPEN_MENU);
    },

    closeMenu : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.CLOSE_MENU);
    },

    menuAnimationDone : function(){
        _apps.isMenuAnimation = false;

        this.emit(CONSTANTS.MENU_ANIMATION_DONE);
    },

    onCLoseMenuAnimationDone : function(){
        _apps.isMenuAnimation = false;

        this.emit(CONSTANTS.CLOSE_MENU_ANIMATION_DONE);
    },

    onTapMenu : function(menuName) {
        _apps.selectedClassName = menuName;
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.TAP_MENU);
    },

    onTapBottomContent : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.TAP_BOTTOM_CONTENT)
    }

});

AppStore.dispatchToken = AppDispatcher.register(function (action) {
    switch(action.actionType){
        case CONSTANTS.LOAD_START:
            AppStore.loadStart();
            break;
        case CONSTANTS.LOAD_DONE:
            AppStore.loadDone(action.images);
            break;
        case CONSTANTS.OPEN_MENU:
            AppStore.openMenu();
            break;
        case CONSTANTS.CLOSE_MENU:
            AppStore.closeMenu();
            break;
        case CONSTANTS.MENU_ANIMATION_DONE:
            AppStore.menuAnimationDone();
            break;
        case CONSTANTS.CLOSE_MENU_ANIMATION_DONE:
            AppStore.onCLoseMenuAnimationDone()
            break;
        case CONSTANTS.TAP_MENU:
            AppStore.onTapMenu(action.menuName);
            break;
        case CONSTANTS.TAP_BOTTOM_CONTENT:
            AppStore.onTapBottomContent()
            break;
    }

});

module.exports = AppStore;
