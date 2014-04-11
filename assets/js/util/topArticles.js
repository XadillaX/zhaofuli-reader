/**
 * Created by XadillaX on 2014/4/10.
 */
var $ = null;
var spidex = require("spidex");

var TopArticles = function(win, jquery, type) {
    $ = jquery;
    this.win = win;
    this.type = type;

    this.object = $("#top-articles");
};

TopArticles.prototype._showTopArticles = function(list) {
    var obj = this.object.find(".panel-body");
    obj.html("<ul class='top-articles-ul'></ul>");
    obj = obj.find("ul");

    for(var i = 0; i < list.length; i++) {
        var html = "<li><a class='top-articles-a' target='_blank' href='" + list[i].url + "' alt='" + list[i].title + "'>" + list[i].title +
            "</a>" + "<p>" + list[i].summary + "</p>" + "</li>";
        obj.append(html);
    }

    this.type.emit("topLoaded");
};

TopArticles.prototype.load = function() {
    var self = this;
    var reg1 = /<li class="item"><a href="(.*?)"><img src="(.*?)" alt="(.*?)" \/><h3>(.*)<\/h3><p class="muted">\s*([\s\S]*?)<\/p><\/a><\/li>/g;
    var reg2 = /<li class="item"><a href="(.*?)"><img src="(.*?)" alt="(.*?)" \/><h3>(.*)<\/h3><p class="muted">\s*([\s\S]*?)<\/p><\/a><\/li>/;

    var url = "http://zhaofuli.net/";
    spidex.get(url, function(html, status, respHeader) {
        var regArray = html.match(reg1);

        // 正则解析错误
        if(!regArray) {
            var msg = "可能是由于【找福利】服务器挂了，阅读器不能解析其返回结果。";
            self.type.emit("alert", "<span style='color: red;'>✗</span> 错误发生：" + msg);

            return;
        }

        // 解析每一条
        var list = [];
        for(var i = 0; i < regArray.length; i++) {
            var array = reg2.exec(regArray[i]);
            if(!array || array.length !== 6) {
                var msg = "可能是由于【找福利】服务器挂了，阅读器不能解析其返回结果。";
                self.type.emit("alert", "<span style='color: red;'>✗</span> 错误发生：" + msg);

                return;
            }

            list.push({
                title   : array[4],
                url     : array[1],
                image   : array[2],
                summary : array[5]
            });
        }

        self._showTopArticles(list);
    }, "utf8").on("error", function(e) {
        var msg = "无法连接【找福利】！请确保你的网络畅通并且找福利并未被墙或者你在墙外。";
        self.type.emit("alert", "<span style='color: red;'>✗</span> 错误发生：" + msg);
    });
};

module.exports = TopArticles;
