/**
 * Created by XadillaX on 2014/4/7.
 */
var $ = null;
var spidex = require("spidex");
var async = require("async");

/**
 * 福利列表
 * @param win
 * @param jquery
 * @param fuliType
 * @param functions
 * @constructor
 */
var FuliList = function(win, jquery, fuliType) {
    this.win = win;
    $ = jquery;
    this.type = fuliType;
    this.object = $("#list-container");

    // 福利各分类的cache
    this.fuliCache = {  };
};

FuliList.prototype.loadMore = function(name) {
    var cache = this.fuliCache[name];

    // 是否正在载入
    if(cache.loading) return;
    cache.loading = true;

    cache.currentPage++;
    var url = this.type.getUrlByPage(name, cache.currentPage);

    var self = this;
    async.waterfall([
        function(callback) {
            console.log("正在爬：" + url);
            spidex.get(url, function(html, status, respHeader) {

            }, "utf8").on("error", function(err) {
                callback(err);
            });
        }
    ], function(err, list) {
        cache.loading = false;

        if(err) {
            if(err.message === "read ECONNRESET") {
                err.message = "无法连接【找福利】！请确保你的网络畅通并且找福利并未被墙或者你在墙外。";
            }

            var error = "<span style='color: red;'>✗</span> 错误发生：" + err.message;
            self.type.emit("alert", error, error.stripTags());
        }
    });
};

/**
 * 切换类型
 * @param name
 * @private
 */
FuliList.prototype._switchType = function(name) {
    console.log("选择了 [" + name + "]...");

    $(".each-type-list").css("display", "none");

    if(undefined === this.fuliCache[name]) {
        this.fuliCache[name] = { currentPage: 0, id: Date.create() / 1, list: [], loading: false };
        this.object.append("<div class='each-type-list' id='type-" + this.fuliCache[name].id + "' style='display: block;'></div>");
        this.loadMore(name);
    } else {
        $("#type-" + this.fuliCache[name].id).css("display", "block");
    }
};

/**
 * 初始化
 */
FuliList.prototype.init = function() {
    var self = this;
    this.type.on("changeType", function(type) {
        self._switchType(type);
    });
};

module.exports = FuliList;
