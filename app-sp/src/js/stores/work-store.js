var AppDispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var _works = {

}

var WorkStore = assign({}, EventEmitter.prototype, {

});

WorkStore.dispatchToken = AppDispatcher.register(function(action){

});

module.exports = WorkStore;
