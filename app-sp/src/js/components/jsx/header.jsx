import CloseButton from "./headers/close-button.jsx"
//var CloseButton = require('./headers/close-button.jsx');

class Header extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div id="header-wrapper">
                <CloseButton></CloseButton>
            </div>
        );
    }
}

module.exports = Header;
