class TwitterText extends React.Component {
    constructor(props) {
        super(props)
        this.state = {className: ""}
    }

    onMouseEnter() {
        this.setState({
            className: "hover"
        });
    }

    onMouseLeave() {

        this.setState({
            className: ""
        });
    }

    render() {
        return (
            <a
                className = {this.state.className}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                href="https://twitter.com/intent/tweet?source=http%3A%2F%2F2d-phy.kenji-special.info%2F&text=Interaction%20with%20Artificial%20Physics:%20http%3A%2F%2F2d-phy.kenji-special.info%2F&via=kenji_special"
                target="_blank" title="Tweet"
                onclick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + ':%20'  + encodeURIComponent(document.URL)); return false;">
                <div className="bot">Twitter</div>
                <div className="top">Twitter</div>
            </a>
        );
    }
}

module.exports = TwitterText;
