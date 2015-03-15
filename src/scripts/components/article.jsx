$(function() {
    var reactLib = require("./lib/react");
    var ArticleWrapper;
    var MaskWrapper;
    var gui = require("nw.gui");
    var win = gui.Window.get();
    // var articleGetter = require("./lib/post/getter");

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
                    $("#article-content-wrapper").css("display", "none");
                    $("#item-list-wrapper").fadeIn("normal");
                    break;
                }

                case "article":
                default: {
                    $("#item-list-wrapper").css("display", "none");
                    $("#article-content-wrapper").fadeIn("normal");
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
            }, 500);
        },

        dfsNodes: function(node) {
            if($(node).text().indexOf("转载请注明：") >= 0) {
                $(node).css("display", "none");
            }

            if($(node)[0].nodeName.toLowerCase() === "img") {
                $(node).addClass("img-thumbnail");
            }

            if($(node)[0].nodeName.toLowerCase() === "a") {
                var href = $(node).attr("href");
                $(node).attr("href", "javascript:void(0);");
                $(node).click(function() {
                    gui.Shell.openExternal(href);
                });
            }

            var self = this;
            $(node).children().each(function() {
                self.dfsNodes(this);
            });
        },

        componentDidUpdate: function() {
            var body = React.findDOMNode(this.refs.body);
            var self = this;
            $(body).children().each(function() {
                self.dfsNodes(this);
            });

            pangu.element_spacing("#article-content");

            delete window.DUOSHUO;
            var head = $("head").remove("script[role='reload']");
            $("<scri" + "pt>" + "</scr" + "ipt>").attr({
                role: "reload",
                src: "http://static.duoshuo.com/embed.js",
                type: "text/javascript"
            }).appendTo(head);
        },

        render: function() {
            if(!Object.keys(this.state).length) {
                return (<div style={{ marginTop: "200px" }}>...</div>);
            } else {
                return (
                    <article id="article-body" className="well" style={{ marginTop: "200px" }}>
                        <h2 title={this.state.title} className="article-title">{this.state.title}</h2>
                        <div className="article-meta row">
                            <div className="col-xs-3">
                                <a className="no-underline" style={{ cursor: "pointer" }}
                                    onClick={this.switchPanel.bind(this, "list")}
                                    href="javascript:void(0);">
                                    <span className="glyphicon glyphicon-chevron-left"></span> 返回
                                </a>
                            </div>
                            <div className="col-xs-3">
                                <span className="glyphicon glyphicon-list-alt"></span> {this.state.terms.category[0].name}
                            </div>

                            <div className="col-xs-3">
                                <span className="glyphicon glyphicon-user"></span> {this.state.author.name}
                            </div>

                            <div className="col-xs-3">
                                <span className="glyphicon glyphicon-time"></span> {Date.create(this.state.date).format("{MM}-{dd}")}
                            </div>
                        </div>

                        <div ref="body" className="true-article" dangerouslySetInnerHTML={{ __html: this.state.content }}></div>

                        <div key={new Date()} id="ds-comment" className="well" ref="comment">
                            <div className="ds-thread"
                                data-thread-key={this.state.ID}
                                data-author-key={this.state.author.ID}
                                data-title={this.state.title}
                                data-url={this.state.link}></div>
                        </div>
                    </article>
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
