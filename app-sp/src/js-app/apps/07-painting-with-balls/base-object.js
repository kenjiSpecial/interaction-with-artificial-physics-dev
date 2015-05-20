
var Vector2 = require('ks-vector').Vector2;

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
        var oldPosition = this.position.copy();
        var velPos = this.position.copy().subtract(this.prevPosition).add(this.gravity)
        this.position.add(velPos);

        this.prevPosition = oldPosition;
    }
}

module.exports = BaseObject;
