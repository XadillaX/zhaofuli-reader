$(function() {
    var reactLib = require("./lib/react");
    var ArticleWrapper;
    var MaskWrapper;
    var articleGetter = require("./lib/post/getter");

    MaskWrapper = React.createClass({
        getInitialState: function() {
            reactLib.addComponent("MaskWrapper", this);
            return {
                inner: (
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3 no-select cursor-arrow">
                            <ProgressBar percent="100" style="success" text="载入中..." />
                        </div>
                    </div>
                )
            };
        },

        show: function() {
            var mask = this.refs.mask;
            mask.show();
        },

        hide: function() {
            var mask = this.refs.mask;
            mask.hide();
        },

        toggle: function() {
            var mask = this.refs.mask;
            mask.toggle();
        },

        render: function() {
            return (<div><LoadingMask inner={this.state.inner} ref="mask" key={+new Date()} /></div>);
        }
    });

    ArticleWrapper = React.createClass({
        getInitialState: function() {
            reactLib.addComponent("ArticleWrapper", this);
            return {};
        },

        switchPanel: function(type) {
            switch(type) {
                case "list": {
                    $("#article-content").css("display", "none");
                    $("#item-list").fadeIn("normal");
                    break;
                }

                case "article":
                default: {
                    $("#item-list").css("display", "none");
                    $("#article-content").fadeIn("normal");
                    break;
                }
            }
        },

        setArticle: function(data) {
            var mask = reactLib.getComponent("MaskWrapper");
            mask.show();
            this.setState(data);
            this.switchPanel("article");
            setTimeout(function() {
                mask.hide();
            }, 200);
        },

        render: function() {
            if(!Object.keys(this.state).length) {
                return (<div style={{ marginTop: "200px" }}>...</div>);
            } else {
                return (
                    <pre style={{ marginTop: "200px" }}>{ JSON.stringify(this.state, true, 2) }</pre>
                );
            }
        }
    });

    React.render(
        <ArticleWrapper />,
        document.getElementById("article-content")
    );

    React.render(
        <MaskWrapper />,
        document.getElementById("_mask")
    );
});
