var AppDispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CONSTANTS = require('../utils/constants');
var appData = require('../data/app-data');
var _apps = {
    isLoad: false,
    isTransition: false,
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
    }

});

module.exports = AppStore;
