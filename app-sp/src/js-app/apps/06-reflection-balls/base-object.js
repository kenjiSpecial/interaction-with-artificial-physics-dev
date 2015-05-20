
var Vector2 = require('ks-vector').Vector2;
var AppStore = require('../../../js/stores/app-store');

class BaseObject {
    constructor( x, y ){
        this.position = new Vector2( x, y );
        this.prevPosition = new Vector2(x, y);
        this.gravity = new Vector2(0, .3);
    }

    update(dt, grav){
        this.verlet(grav);
    }


    verlet(grav){
        var oldPosition = this.position.copy();
        var velPos = this.position.copy().subtract(this.prevPosition).add(grav)
        velPos.x += AppStore.getAclX() /2;
        velPos.y += AppStore.getAclY() /2;

        this.position.add(velPos);

        this.prevPosition = oldPosition;
    }
}

module.exports = BaseObject;
