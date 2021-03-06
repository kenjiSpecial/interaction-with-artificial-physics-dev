var Vec2 = require('ks-vector').Vector2;

class Particle {
    constructor(xx, yy) {
        this.originPos = new Vec2(xx, yy);
        this.pos = new Vec2(xx, yy);
        this.lastPos = new Vec2(xx, yy);
    }

    reset(){
        this.lastPos.x = this.originPos.x;
        this.lastPos.y = this.originPos.y;

        this.pos.x = this.originPos.x;
        this.pos.y = this.originPos.y;
    }

    onWindowResize(xx, yy){
        this.originPos.set( xx, yy );
        this.pos.set( xx, yy );
        this.lastPos.set( xx, yy );
    }
}

module.exports = Particle;
