var SNSText = require('./sns-texts/sns.jsx');

class SnsText extends React.Component {
    constructor(props) {
        super(props)

        this.state = {className: "share-buttons"}
    }

    onMouseEnterHandler() {
        this.setState({
            className : "share-buttons open"
        });
    }

    onMouseLeaveHandler(){

        this.setState({
            className : "share-buttons"
        });
    }

    render() {
        return (
            <div className="sub share" onMouseLeave={this.onMouseLeaveHandler.bind(this)}>
                <div className="text" onMouseEnter={this.onMouseEnterHandler.bind(this)}>Share</div>

                <ul className={this.state.className}>
                    <li><SNSText name="Facebook" title="Share on Facebook" onClick="window.open(this.href, 'FBwindow', 'width=650, height=450, menubar=no, toolbar=no, scrollbars=yes'); return false; " href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F2d-phy.kenji-special.info%2F&t=Interaction%20with%20Artificial%20Physics" ></SNSText></li>
                    <li><SNSText name="Twitter" title="Tweet" href="https://twitter.com/intent/tweet?source=http%3A%2F%2F2d-phy.kenji-special.info%2F&text=Interaction%20with%20Artificial%20Physics:%20http%3A%2F%2F2d-phy.kenji-special.info%2F&via=kenji_special" onClick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + ':%20'  + encodeURIComponent(document.URL)); return false;" ></SNSText></li>
                    <li><SNSText name="Google+" title="Share on Google+" href="https://plus.google.com/share?url=http%3A%2F%2F2d-phy.kenji-special.info%2F" onClick="window.open('https://plus.google.com/share?url=' + encodeURIComponent(document.URL)); return false;"></SNSText></li>
                    <li><SNSText name="Tumblr" title="Post to Tumblr" href="http://www.tumblr.com/share?v=3&u=http%3A%2F%2F2d-phy.kenji-special.info%2F&t=Interaction%20with%20Artificial%20Physics&s=" onclick="window.open('http://www.tumblr.com/share?v=3&u=' + encodeURIComponent(document.URL) + '&t=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                    <li><SNSText name="Pinterest" title="Pin it" href="http://pinterest.com/pin/create/button/?url=http%3A%2F%2F2d-phy.kenji-special.info%2F&description=Interaction%20with%20Artificial%20Physics%20is%20a%20collection%20of%20interactive%20experiments%20with%20artificial%20physics." onclick="window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(document.URL) + '&description=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                    <li><SNSText name="Pocket" title="Add to Pocket" href="https://getpocket.com/save?url=http%3A%2F%2F2d-phy.kenji-special.info%2F&title=Interaction%20with%20Artificial%20Physics" onclick="window.open('https://getpocket.com/save?url=' + encodeURIComponent(document.URL) + '&title=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                </ul>
            </div>

        );
    }
}

module.exports = SnsText;
