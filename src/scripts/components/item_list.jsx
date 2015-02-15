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

    ListItem = React.createClass({
        render: function() {
            var title = this.props.item.title;
            if(this.props.item.cat) {
                title = "[" + this.props.item.cat.name + "] " + title;
            }

            var tags = this.props.item.tags.map(function(tag, idx) {
                return <span key={"tag-" + idx} style={{ marginRight: "5px" }} className="label label-warning">{tag}</span>;
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
                            <p className="list-per-item-summary">
                                {this.props.item.summary}
                            </p>

                            <div className="row list-per-item-za">
                                <div className="col-md-12">
                                    点击 <span className="label label-default">{this.props.item.read}</span>
                                </div>
                                <div className="col-md-12">
                                    标签 {tags}
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
            listGetter.get(this.props.url, this.props.page, function(err, items) {
                if(err) {
                    console.warn(err);
                    sweetAlert("啊吖吖", err.message, "error");
                    self.setState({ inited: true, items: [] });

                    return;
                }

                console.log("fetched.");
                self.setState({ inited: true, items: items });
            });
        },

        componentDidMount: function() {
            this.refetch();
        },

        componentWillReceiveProps: function() {
            this.refetch();
        },

        render: function() {
            console.log("bilibili...");
            if(!this.state.inited) {
                return (
                    <ProgressBar percent="100" style="warning" />
                );
            } else {
                return (
                    <div className="item-list-inner" id="item-list-inner">
                        {this.state.items.map(function(item, idx) {
                            return <ListItem item={item} key={"list-item-" + idx} />
                        })}
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
            return { page: 1, url: config.baseUri };
        },

        /**
         * select category
         * @param url
         * @param page
         */
        selectCat: function(url, page) {
            this.setState({ page: page, url: url });
        },

        /**
         * render function
         * @returns {XML}
         */
        render: function() {
            return (
                <ItemList key={+new Date()} page={this.state.page} url={this.state.url} />
            );
        }
    });

    React.render(
        <ItemListWrapper />,
        document.getElementById("item-list")
    );
});
