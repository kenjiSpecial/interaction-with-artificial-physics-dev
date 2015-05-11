var screenfull = require('screenfull');

class FooterFullscreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {className: "sub fullscreen"};
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

    render(){
        return (
            <div
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onClick={this.onClick.bind(this)}
                className={this.state.className}>
                FullScreen
            </div>
        )
    }
}

module.exports = FooterFullscreen;

