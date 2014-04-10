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

/**
 * 解析列表
 * @param html
 * @returns {Array}
 * @private
 */
FuliList.prototype._parseList = function(html) {
    var list = [];
    var regex1 = /<article class="excerpt">\s+<div class="focus"><a href="(.+)" class="thumbnail"><img src="(.+)" alt=".+" \/><\/a><\/div>\s+<header>\s+.+<h2><a href=".+" title=".+">(.+)<\/a><\/h2>\s*<\/header>\s*<p>\s*.+<a href=".+">(.+)<\/a><\/span>\s+.+<\/i>(.+)<\/span>\s+.+<\/span>\s+.+<\/p>\s+.+<p class="note">([\s\S]+?)<\/p>\s*<\/article>/g;
    var regex2 = /<article class="excerpt">\s+<div class="focus"><a href="(.+)" class="thumbnail"><img src="(.+)" alt=".+" \/><\/a><\/div>\s+<header>\s+.+<h2><a href=".+" title=".+">(.+)<\/a><\/h2>\s*<\/header>\s*<p>\s*.+<a href=".+">(.+)<\/a><\/span>\s+.+<\/i>(.+)<\/span>\s+.+<\/span>\s+.+<\/p>\s+.+<p class="note">([\s\S]+?)<\/p>\s*<\/article>/;

    var regArray = html.match(regex1);
    //console.log(regArray);

    if(!regArray || regArray.length < 1) {
        throw Error("可能是由于【找福利】服务器挂了，阅读器不能解析其返回结果。");
    }

    for(var i = 0; i < regArray.length; i++) {
        var str = regArray[i];
        var tmpArray = regex2.exec(str);
        //console.log(tmpArray);

        if(tmpArray.length !== 7) continue;

        var tmp = {
            title   : tmpArray[3].trim(),
            image   : tmpArray[2].trim(),
            url     : tmpArray[1].trim(),
            author  : tmpArray[4].trim(),
            date    : tmpArray[5].trim(),
            summary : tmpArray[6].trim()
        };
        list.push(tmp);
    }

    console.log(list);
    return list;
};

/**
 * 添加日期
 * @param cache
 * @param item
 */
FuliList.prototype.insertDate = function(cache, item) {
    var html = "<div class='row fuli-date' id='date-" + item.date + "'></div>";
    cache.addItem(html);

    cache.object.find("#date-" + item.date).html('<div class="col-xs-12"><span class="badge">' + item.date + '</span></div>')
};

/**
 * 添加元素
 * @param cache
 * @param item
 */
FuliList.prototype.addItem = function(cache, item) {
    var html = "<div class='row fuli-item-object'></div>";
    cache.addItem(html);
    item.object = cache.object.find(".fuli-item-object:last");

    var summary = item.summary;
    if(summary.length > 40) {
        summary = summary.substr(0, 37) + "...";
    }

    html = '<div class="col-xs-4">' +
        '       <a class="to-fancy" href="' + item.image + '" title="' + item.title + '">' +
        '           <img src="' + item.image + '" alt="' + item.title + '" class="img-thumbnail" /><div class="width-flag" style="width: 100%;"></div>' +
        '       </a>' +
        '   </div>' +
        '   <div class="col-xs-8">' +
        '       <h3>' + item.title + '</h3>' +
        '       <p>' + summary + '</p>' +
        '   </div>';
    item.object.html(html);

    var w = item.object.find(".width-flag").width();
    item.object.find("img").css("width", w + "px");
    item.object.find("img").css("height", (w * 0.75) + "px");
    item.object.css("height", (w * 0.75) + "px");

    $(".to-fancy").fancybox({
        helpers: {
            title : {
                type : 'float'
            }
        },

        margin: [ 65, 20, 20, 20 ]
    });
};

/**
 * 载入更多
 * @param name
 */
FuliList.prototype.loadMore = function(name) {
    var cache = this.fuliCache[name];

    // 是否正在载入
    if(cache.loading) return;
    cache.loading = true;

    var url = this.type.getUrlByPage(name, cache.currentPage + 1);

    cache.setProgressPercent(0);
    var self = this;
    async.waterfall([
        function(callback) {
            cache.setProgressPercent(10);
            console.log("正在爬：" + url);
            spidex.get(url, function(html, status, respHeader) {
                cache.setProgressPercent(80);
                if(status !== 200) {
                    callback(new Error("【找福利】服务器返回了错误的状态码。"));
                    return;
                }

                try {
                    var list = self._parseList(html);
                } catch(e) {
                    callback(e);
                    return;
                }

                callback(null, list);
            }, "utf8").on("error", function(err) {
                callback(err);
            });
        }
    ], function(err, list) {
        // 有错误
        if(err) {
            cache.loading = false;
            if(err.message === "read ECONNRESET") {
                err.message = "无法连接【找福利】！请确保你的网络畅通并且找福利并未被墙或者你在墙外。";
            }

            var error = "<span style='color: red;'>✗</span> 错误发生：" + err.message;
            self.type.emit("alert", error, error.stripTags());
        } else {
            cache.setProgressPercent(100);
            cache.progressBar.css("display", "none");

            // 载入到页面，并且加入到缓存
            // cache.addItem("<div class='row'><div class='col-md-12'><pre>" + JSON.stringify(list, null, 2) + "</pre></div></div>");
            for(var i = 0; i < list.length; i++) {
                if(i === 0 && cache.list.length === 0) {
                    // 第一个
                    self.insertDate(cache, list[i]);
                } else if(i === 0 && list[i].date !== cache.list[cache.list.length - 1]) {
                    // 第一个与上一次不一样
                    self.insertDate(cache, list[i]);
                } else if(list[i].date !== list[i - 1].date) {
                    // 与上一次不一样
                    self.insertDate(cache, list[i]);
                }

                // 添加卡牌
                self.addItem(cache, list[i]);
            }

            for(var i = 0; i < list.length; i++) {
                cache.list.push(list[i]);
            }

            $(".nano").nanoScroller({ tabIndex: -1 });
            cache.currentPage++;
            cache.loading = false;
        }
    });
};

FuliList.prototype._createFuliCache = function(name) {
    this.fuliCache[name] = { currentPage: 0, id: Date.create() / 1, list: [], loading: false };
    this.object.append("<div class='each-type-list' id='type-" + this.fuliCache[name].id + "' style='display: block;'></div>");
    this.fuliCache[name].object = $("#type-" + this.fuliCache[name].id);

    // 福利列表div
    this.fuliCache[name].object.append("<div class='items-wrapper'></div>");

    // progressbar div
    this.fuliCache[name].object.append('<div class="row"><div class="col-md-12"><div class="progress progress-striped active">\
        <div class="progress-bar"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">\
            <span>载入中 0% ...</span>\
            </div>\
        </div></div></div>');

    this.fuliCache[name].progressBar = this.fuliCache[name].object.find(".progress");
    this.fuliCache[name].itemsWrapper = this.fuliCache[name].object.find(".items-wrapper");

    this.fuliCache[name].setProgressPercent = function(percent) {
        this.progressBar.find(".progress-bar").css("width", percent + "%");
        this.progressBar.find(".progress-bar span").html("载入中 " + percent + " %...");
    };

    this.fuliCache[name].addItem = function(html) {
        //console.log(html);
        this.itemsWrapper.append(html);
    };

    this.fuliCache[name].setProgressPercent(100);
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
        this._createFuliCache(name);
        this.loadMore(name);
    } else {
        $("#type-" + this.fuliCache[name].id).css("display", "block");

        if(!this.fuliCache[name].list.length) {
            this.loadMore(name);
        }
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
