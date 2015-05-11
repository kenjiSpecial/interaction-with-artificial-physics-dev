import ParentApp from "../boiler-plate/app.js"
import canvasApp from "../../../js/components/js/canvas-app.js"


class App extends ParentApp {
    constructor() {
        super();

        this.x = 0;

    }


    update(ctx) {
        ctx.fillStyle = "#0000ff";
        ctx.fillRect(0, 0, canvasApp.windowWid, canvasApp.windowHig);

        ctx.fillStyle = "#ff0000";
        this.x += 10;
        if(this.x > canvasApp.windowWid) this.x = 0;

        ctx.beginPath();
        ctx.arc(this.x, canvasApp.windowHig/2, 10, 0, 2 * Math.PI, false);
        ctx.fill();
    }

}

module.exports = App;
