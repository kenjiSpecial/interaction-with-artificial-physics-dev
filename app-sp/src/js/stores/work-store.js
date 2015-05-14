
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var appData = require('../data/app-data');
var AppStore = require('./app-store');
var AppDispatcher = require('../dispatcher/dispatcher');
var APP_CONSTANTS = require('../utils/constants');


var _work = {
    workData: null,
    isSelected: false,
    isWorkStart : false,
};

var WorkStore = assign({}, EventEmitter.prototype, {
    get : function(id) {
        return _works[id];
    },

    getAllWorks : function() {
        return _works;
    },

    getWorkData : function(){
        return _work.workData;
    },

    isSelected : function(){
        return _work.isSelected
    },

    // -----------------------------

    setWork(){
        _work.isSelected = true;
        _work["workData"] = AppStore.getSelectedWorkData();


        this.emit(APP_CONSTANTS.CHANGE_DIRECTORY_TO_WORK);
    },

    startWorkAnimation(){
        _work.isWorkStart = true;

        this.emit(APP_CONSTANTS.START_WORK_ANIMATION);
    },

    stopWorkAnimation(){
        _work.isSelected = false;
        _work.isWorkStart = false;
        _work["workData"] = null;

        this.emit(APP_CONSTANTS.STOP_WORK_ANIMATION);
    },

    onForceSetWorkHandler(){
        _work.isSelected = true;
        _work["workData"] = AppStore.getSelectedWorkData();
        console.log(_work["workData"]);

        this.emit(APP_CONSTANTS.FORCE_SET_WORK);
    }

});

WorkStore.dispatchToken = AppDispatcher.register(function(action){

    switch(action.actionType){
        case APP_CONSTANTS.CHANGE_DIRECTORY_TO_WORK:

            WorkStore.setWork()
            break;
        case APP_CONSTANTS.START_WORK_ANIMATION:
            WorkStore.startWorkAnimation();
            break;
        case APP_CONSTANTS.START_RENDERING_INDEX:
            WorkStore.stopWorkAnimation();
            break;
        case APP_CONSTANTS.FORCE_SET_WORK:
            AppDispatcher.waitFor([AppStore.dispatchToken]);
            WorkStore.onForceSetWorkHandler();
            break;
    }

});

WorkStore.setMaxListeners(20);

module.exports = WorkStore;
