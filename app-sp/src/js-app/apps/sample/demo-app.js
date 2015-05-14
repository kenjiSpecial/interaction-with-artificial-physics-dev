import ParentApp from "../boiler-plate/app.js"


class App extends ParentApp {
    constructor() {
        super();

        this.x = 0;

    }


    update(ctx) {
        ctx.fillStyle = "#0000ff";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle = "#ff0000";
        this.x += 10;
        if(this.x > window.innerWidth) this.x = 0;

        ctx.beginPath();
        ctx.arc(this.x, window.innerHeight/2, 10, 0, 2 * Math.PI, false);
        ctx.fill();
    }

}

module.exports = App;
