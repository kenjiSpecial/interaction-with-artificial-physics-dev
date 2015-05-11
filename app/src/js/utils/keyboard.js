var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
const raf = require('raf');
var assign = require('object-assign');
var CONSTANTS = require('./constants');

var keybord = assign({}, EventEmitter.prototype, {
    start : function(){
        _.bindAll(this, "onKeydownHandler");
        document.addEventListener('keydown', this.onKeydownHandler);
    },

    onKeydownHandler : function(ev){
        this.emit(CONSTANTS.KEYBOARD_DOWN, ev.keyCode);
    }
});


module.exports = keybord;
