class FooterName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {className: "sub"};
    }

    onMouseEnter() {
        this.setState({
            className: "sub hover"
        });
    }

    onMouseLeave() {

        this.setState({
            className: "sub"
        });
    }

    render() {
        return (
            <div
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                className={this.state.className}>
                <a href="http://kenji-special.info" target="_blank">By Kenji SAITO</a>
            </div>
        );
    }
}

module.exports = FooterName;
