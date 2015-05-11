
import AppStore from "../../stores/app-store.js"

var AppContent = require('./app-content.jsx');
var AppConstants = require('../../utils/constants');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {display: "none"};

        AppStore.on(AppConstants.LOAD_DONE, this.onLoadDoneHandler.bind(this))
    }

    onLoadDoneHandler(){
        this.setState({display: "block"});
    }

    render() {
        var display = {
            display: this.state.display,
        }

        return (
            <div id="app-wrapper" style={display}>
                <canvas id="app-canvas"></canvas>
                <AppContent></AppContent>
            </div>);
    }
}

module.exports = App;
