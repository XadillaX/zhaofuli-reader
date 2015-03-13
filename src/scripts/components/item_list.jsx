/**
 * Created by XadillaX on 2015/2/1.
 */
$(function() {
    var reactLib = require("./lib/react");
    var listGetter = require("./lib/list/getter");
    var config = require("./lib/config");
    var ItemListWrapper;
    var ItemList;
    var ListItem;
    var Paginator;

    function parseLinkHeader(link) {
        link = link.split(",");
        return link.map(function(str) {
            var temp = str.split(";");
            var url = temp[0].trim();
            url = url.substr(1, url.length - 2);
            temp.shift();

            return temp.reduce(function(res, n) {
                var x = n.split("=");
                res[x[0].trim()] = JSON.parse(x[1].trim());
                return res;
            }, { url: url });
        });
    }

    ListItem = React.createClass({
        componentDidMount: function() {
            var dom = React.findDOMNode(this.refs.summary);

            // 太矮了浮动会出问题
            if($(dom).height() < 60) $(dom).height(60);
        },

        render: function() {
            var title = this.props.item.title;
            if(this.props.item.cat) {
                title = "[" + this.props.item.cat.name + "] " + title;
            }

            var tags = this.props.item.tags.map(function(tag, idx) {
                return <span key={"tag-" + idx} style={{ marginRight: "5px" }} 
                    className="label label-warning">{tag}</span>;
            });

            if(!tags.length) {
                tags = "-";
            }

            return (
                <div className="well">
                    <div className="row">
                        <div className="col-md-12" style={{ marginBottom: "5px" }}>
                            <button className="btn btn-lg btn-block btn-info list-per-item-title">{title}</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <ReactFlickity images={this.props.item.images} />
                        </div>

                        <div className="col-md-8">
                            <p className="list-per-item-summary" ref="summary">
                                {this.props.item.summary}
                            </p>

                            <div className="row list-per-item-za">
                                <div className="col-md-12">
                                    <span className="no-select">时间</span> <span className="label label-success">{this.props.item.dateString}</span>
                                </div>
                                <div className="col-md-12">
                                    <span className="no-select">作者</span> <span className="label label-default">{this.props.item.author.name}</span>
                                </div>
                                <div className="col-md-12">
                                    <span className="no-select">标签</span> {tags}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    ItemList = React.createClass({
        getInitialState: function() {
            reactLib.addComponent("ItemList", this);
            return { inited: false };
        },

        refetch: function() {
            var self = this;
            listGetter.get(this.props.id, this.props.page, function(err, items, header) {
                if(err) {
                    console.warn(err);

                    if(err.message.indexOf("ECONNRESET") >= 0) {
                        err.message = "无法连接到找福利，请确保你的网络正常，或者已翻墙。";
                    }

                    sweetAlert("啊吖吖", err.message, "error");
                    self.setState({ inited: true, items: [], links: [] });

                    return;
                }

                var links = parseLinkHeader(header.link);
                self.setState({ inited: true, items: items, links: links });
            });
        },

        componentDidMount: function() {
            this.refetch();
        },

        componentWillReceiveProps: function() {
            this.refetch();
        },

        componentDidUpdate: function() {
            pangu.element_spacing("#true-body");
            console.debug("update spaced.");
        },

        render: function() {
            if(!this.state.inited) {
                return (
                    <ProgressBar percent="100" style="warning" />
                );
            } else {
                if(this.state.items.length) {
                    return (
                        <div className="item-list-inner" id="item-list-inner">
                            {this.state.items.map(function(item, idx) {
                                return <ListItem item={item} key={"list-item-" + idx} />
                            })}
                        </div>
                    );
                } else {
                    return (
                        <ProgressBar percent="100" style="danger" noActive="true" />
                    );
                }
            }
        }
    });

    Paginator = React.createClass({
        componentDidMount: function() {
            var pageCode = React.findDOMNode(this.refs.pageCode);
            $(pageCode).val(this.props.current);

            var prev = React.findDOMNode(this.refs.prevBtn);
            var next = React.findDOMNode(this.refs.nextBtn);
            var go = React.findDOMNode(this.refs.goPageBtn);
            if(this.props.current <= 1) {
                $(prev).addClass("disabled");
                $(prev).attr("disabled", "disabled");
            }

            var self = this;
            $(prev).click(function() {
                self.goPage(self.props.current - 1);
            });
            $(next).click(function() {
                self.goPage(self.props.current + 1);
            });
            $(go).click(function() {
                self.goPage();
            });
            $(pageCode).keydown(function(e) {
                if(e.keyCode === 13) self.goPage();
            });
        },

        goPage: function(page) {
            if(page === undefined) {
                var pageCode = React.findDOMNode(this.refs.pageCode);
                page = parseInt($(pageCode).val());
                if(isNaN(page) || page < 1) {
                    return sweetAlert("错误", "请输入正确的页码。", "error");
                }
            }

            this.props.parent.selectCat(this.props.type, page);
        },

        render: function() {
            if(this.props.loading) return <div></div>;
            else {
                return (
                    <div className="row" style={{ marginBottom: "10px" }}>
                        <div className="col-xs-offset-2 col-xs-8 input-group">
                            <span className="input-group-btn">
                                <button ref="prevBtn" className="btn btn-default" type="button">&#171;</button>
                            </span>
                            <span className="input-group-addon no-select">跳到第</span>
                            <input ref="pageCode" type="number" min="1"
                                className="form-control" style={{ textAlign: "center" }} placeholder="请输入页码..." />
                            <span className="input-group-addon no-select">页</span>
                            <span className="input-group-btn">
                                <button ref="goPageBtn" className="btn btn-danger" type="button">走你</button>
                                <button ref="nextBtn" className="btn btn-default" type="button">&#187;</button>
                            </span>
                        </div>
                    </div>
                );
            }
        }
    });

    ItemListWrapper = React.createClass({
        /**
         * get initial state
         * @returns {{page: number, url: (exports.baseUri|*)}}
         */
        getInitialState: function() {
            reactLib.addComponent("ItemListWrapper", this);
            return {};
        },

        /**
         * select category
         * @param type
         * @param page
         */
        selectCat: function(type, page) {
            console.debug("Select cat:", type, page);
            this.setState({ page: page, type: type });
        },

        /**
         * render function
         * @returns {XML}
         */
        render: function() {
            if(this.state.page === undefined) {
                return <div id="true-body"><ProgressBar percent="100" style="warning" /></div>;
            } else {
                return (
                    <div id="true-body">
                        <ItemList key={+new Date()}
                            page={this.state.page} id={this.state.type.id} />
                        <Paginator current={this.state.page} 
                            key={"pageinator-" + new Date()}
                            type={this.state.type}
                            parent={this}/>
                    </div>
                );
            }
        }
    });

    React.render(
        <ItemListWrapper />,
        document.getElementById("item-list")
    );
});

