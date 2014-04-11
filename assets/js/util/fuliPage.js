/**
 * Created by XadillaX on 2014/4/7.
 */
var $ = null;
var spidex = require("spidex");
var async = require("async");
var LRU = require("lru-cache");

/**
 * 福利页
 * @param win
 * @param jquery
 * @param type
 * @constructor
 */
var FuliPage = function(win, jquery, type) {
    this.win = win;
    $ = jquery;
    this.type = type;
    this.object = $("#information-page-wrapper");
    this.inner = $("#information-page-inner");
    this.progressBar = $("#information-progress").parent().parent();

    this.currentUrl = "";
};

FuliPage.prototype._hidePage = function() {
    this.object.css("display", "none");
};

FuliPage.prototype._fillPage = function(info) {
    //console.log(info.content);

    //this.inner.html("<div class='well'></div>");
    this.inner.html(info.content);

    // 适应
    this.inner.find("*").removeAttr("style");
    this.inner.find("img").addClass("img-responsive img-thumbnail");

    // 去除首多余空格
    this.inner.find("p").each(function() {
        var html = $(this).html();
        while(html.indexOf("&nbsp;") === 0) {
            html = html.substr(6);
        }

        if(html.indexOf("密码：") !== -1) {
            $(this).wrap('<div class="alert alert-info"></div>');
        }

        if(html === "") {
            $(this).remove();
            return;
        } else {
            $(this).html(html);
        }
    });
    this.inner.find("span").each(function() {
        var html = $(this).html();
        while(html.indexOf("&nbsp;") === 0) {
            html = html.substr(6);
        }

        if(html === "") {
            $(this).remove();
        } else {
            $(this).html(html);
        }
    });

    // 超链接变按钮
    this.inner.find("a").each(function() {
        if($(this).html().indexOf("<img") !== -1) {
            // 图片...
        } else {
            var inner = $(this).html();
            var src = $(this).attr("href");

            $(this).wrap('<span class="button-wrap"></span>');
            $(this).replaceWith('<button href="' + src + '" class="button button-3d-primary button-pill">' + inner + '</button>');
        }
    });

    console.log(this.inner.html());
};

FuliPage.prototype._loadPage = function(url, callback) {
    if(undefined !== this.cache.get(url)) {
        callback(null, this.cache.get(url));
        return;
    }

    var self = this;
    spidex.get(url, function(html, status, respHeader) {
        // 标题
        var info = {};
        var titleReg = /<h1 class="article-title"><a href=".*?">(.*?)<\/a><\/h1>/;
        var titleResult = titleReg.exec(html);
        if(titleResult.length < 2) {
            callback(new Error("标题解析错误。"));
            return;
        }
        info.title = titleResult[1];

        // 作者
        var authorReg = /<a href="http:\/\/zhaofuli.net\/author\/.*?">(.*?)<\/a><\/span>/;
        var authorResult = authorReg.exec(html);
        if(authorResult.length < 2) {
            callback(new Error("作者解析错误。"));
            return;
        }
        info.author = authorResult[1];

        // 日期
        var timeReg = /<time class="muted"><i class="ico icon-time icon12"><\/i>(.*?)<\/time>/;
        var timeResult = timeReg.exec(html);
        if(timeResult.length < 2) {
            callback(new Error("日期解析错误。"));
            return;
        }
        info.time = timeResult[1].trim();

        // 内容
        var contentReg = /<article class="article-content">([\s\S]*?)<!-- Begin Digg http:\/\/pei.gd-->/;
        var contentResult = contentReg.exec(html);
        if(contentResult.length < 2) {
            callback(new Error("日期解析错误。"));
            return;
        }
        info.content = contentResult[1].trim();

        // 加入缓存
        self.cache.set(url, info);
        callback(null, info);
    }, "utf8").on("error", function(error) {
        callback(error);
    });
};

FuliPage.prototype._openPage = function(url, title) {
    if(url === this.currentUrl) {
        this.object.css("display", "block");
        this.inner.css("display", "block");

        return;
    }

    this.inner.css("display", "none");
    this.inner.html("");

    console.log(title);
    this.object.css("display", "block");
    this.progressBar.find("span").text(title);
    this.progressBar.css("display", "block");

    var self = this;
    this._loadPage(url, function(err, info) {
        if(err) {
            self.type.emit("alert", "<span style='color: red;'>✗</span> 错误发生：" + err.message);
            return;
        }

        self._fillPage(info);
        self.inner.css("display", "block");
        self.currentUrl = url;
        self.progressBar.css("display", "none");
    });
};

/**
 * 初始化
 */
FuliPage.prototype.init = function() {
    this.cache = LRU(10);

    var self = this;
    this.type.on("openPage", function(url, title) {
        self._openPage(url, title);
    });

    this.type.on("hidePage", function() {
        self._hidePage();
    });
};

FuliPage.prototype.loadArticle = function(articleId) {

};

module.exports = FuliPage;
