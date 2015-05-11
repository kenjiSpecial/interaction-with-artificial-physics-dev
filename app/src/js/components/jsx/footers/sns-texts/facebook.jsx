
class FacebookText extends React.Component {
    constructor(props){
        super(props)
        this.state = {className : ""}
    }

    onMouseEnter(){
        this.setState({
            className: "hover"
        });
    }

    onMouseLeave(){

        this.setState({
            className: ""
        });
    }

    render(){
        return (
            <a
                className = {this.state.className}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F2d-phy.kenji-special.info%2F&t=Interaction%20with%20Artificial%20Physics"
                target="_blank" title="Share on Facebook"
                onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL) + '&t=' + encodeURIComponent(document.URL)); return false;">

                <div className="bot">Facebook</div>
                <div className="top">Facebook</div>
            </a>
        );
    }
}

module.exports = FacebookText;
