import AppStore from "../../stores/app-store.js"
var AppConstants = require('../../utils/constants');
import AboutContent from"./about-content.jsx"

// components
var AppContent = require('./app-content.jsx');

class App extends React.Component {
    constructor(props) {

        super(props);
        this.state = {display: "none"};

        AppStore.on(AppConstants.APP_LOAD_DONE, this.onLoadDoneHandler.bind(this))
    }

    onLoadDoneHandler(){
        this.setState({display: "block"});
    }

    render() {
        var display = {
            display: this.state.display,
        }

        return(
            <div id="app-wrapper" style={display}>
                <canvas id="app-canvas"></canvas>
                <AboutContent/>
                <AppContent></AppContent>
            </div>);
    }
}


module.exports = App;
