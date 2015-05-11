import AppStore from "../../stores/app-store.js"
var AppConstants = require('../../utils/constants');

var FooterTitle = require('./footers/footer-title.jsx');
var SnsText = require('./footers/sns-text.jsx');
var FooterName = require('./footers/footer-name.jsx');
var FullScreen = require('./footers/footer-fullscreen.jsx');

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (<div id="footer-wrapper">
            <div id="footer-content">
                <FooterTitle/>
                <div className="sub-content">

                    <SnsText></SnsText>
                    <FullScreen></FullScreen>
                    <FooterName></FooterName>
                </div>

            </div>
        </div>);
    }

}

module.exports = Footer;
