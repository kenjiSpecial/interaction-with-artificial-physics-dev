var screenfull = require('screenfull');

var AppStore = require('../../../stores/app-store');
var CONSTANTS = require('../../../utils/constants');

class FooterFullscreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {className: "sub fullscreen", title: "FullScreen"};

        AppStore.on(CONSTANTS.ON_WINDOW_RESIZE, this.onWindowResizeHandler.bind(this));
    }

    componentWillMount(){

        this.isPrevFullscreen = screenfull.isFullscreen;

        var title;
        if(!this.isPrevFullscreen) title = "FullScreen";
        else                      title = "EXIT FullScreen";

        this.setState({
            title : title
        });

    }

    onMouseEnter() {
        this.setState({
            className: "sub fullscreen hover"
        });
    }

    onMouseLeave() {

        this.setState({
            className: "sub fullscreen "
        })
    }

    onClick(){
        if (screenfull.enabled) {
            // We can use `this` since we want the clicked element
            screenfull.toggle();
        }
    }

    onWindowResizeHandler(){

        if(screenfull.isFullscreen && !this.isPrevFullscreen){
            this.setState({
                title : "EXIT FullScreen"
            });
        }

        if(!screenfull.isFullscreen && this.isPrevFullscreen){
            this.setState({
                title : "FullScreen"
            })
        }

        this.isPrevFullscreen = screenfull.isFullscreen
    }

    render(){
        return (
            <div
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onClick={this.onClick.bind(this)}
                className={this.state.className}>
                {this.state.title}
            </div>
        )
    }
}

module.exports = FooterFullscreen;

