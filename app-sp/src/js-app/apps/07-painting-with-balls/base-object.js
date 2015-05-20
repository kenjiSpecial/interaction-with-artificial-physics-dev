
var Vector2 = require('ks-vector').Vector2;
var AppStore = require('../../../js/stores/app-store');

class BaseObject {
    constructor( x, y ){
        this.position = new Vector2( x, y );
        this.prevPosition = new Vector2(x, y);
        this.gravity = new Vector2(0, .3);
    }

    update(dt){
        this.verlet();
    }


    verlet(){
        var theta = AppStore.get("gravTheta");
        var gravX = Math.cos(theta) * .3;
        var gravY = Math.sin(theta) * .3;
        this.gravity.set( gravX, gravY );

        var oldPosition = this.position.copy();
        var velPos = this.position.copy().subtract(this.prevPosition).add(this.gravity);
        velPos.x += AppStore.getAclX() /2;
        velPos.y += AppStore.getAclY() /2;

        this.position.add(velPos);

        this.prevPosition = oldPosition;
    }
}

module.exports = BaseObject;
