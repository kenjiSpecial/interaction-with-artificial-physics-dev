import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"

import WorkText from "./app-contents/work-text.jsx"
import WorkBall from "./app-contents/work-ball.jsx"
//import AboutContent from"./about-content.jsx"

var AppConstants = require('../../utils/constants');

// components
//var Footer = require('./footer.jsx');

class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            works: AppData.works
        };
    }

    onLoadDoneHandler() {

    }

    componentWillMount() {

    }

    onBackgroundAnimationDoneHandler() {

    }

    render() {
        var count = -1;
        var count2 = -1;


        return (

            <div id="app-main-dom-wrapper">
                <div className="work-text-wrapper">
                    {
                        this.state.works.map(function (result) {
                            count++;
                            var keyID = "work-text" + count;
                            return (
                                <WorkText key={keyID} name={result} number={count}></WorkText>
                            );
                        })
                    }
                </div>
            </div>);
    }
}


module.exports = AppContent;
