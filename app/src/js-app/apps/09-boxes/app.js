var Floor = require('./components/floor');


var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');

class App{
    constructor(){
        this.mObjects = [];

        var winWid = AppStore.getWindowWidth();
        var winHig = AppStore.getWindowHeight();

        this.rotatingFloor = new Floor( winWid/2 - 60, 100, 120, 40 );
        this.mObjects.push(this.rotatingFloor);

        //this.floor = new Floor( win)
    }

    start(){

    }

    stop(){

    }

    update(ctx){

    }
}


module.exports = App;
