/**
 * Created by XadillaX on 2014/4/7.
 */
var $ = null;
var spidex = require("spidex");
var async = require("async");
var LRU = require("lru-cache");

/**
 * 福利页
 * @param gui
 * @param win
 * @param jquery
 * @param type
 * @constructor
 */
var FuliPage = function(gui, win, jquery, type) {
    this.gui = gui;
    this.win = win;
    $ = jquery;
    this.type = type;
    this.object = $("#information-page-wrapper");
    this.inner = $("#information-page-inner-body");
    this.progressBar = $("#information-progress").parent().parent();

    this.currentUrl = "";
    //this.naviStack = [  ];
};

//FuliPage.addNaviToQueue = function(url) {
//    this.naviStack.push(url);
//    if(this.naviStack.length > 50) {
//        this.naviStack.shift();
//    }
//};

FuliPage.prototype._hidePage = function() {
    this.object.css("display", "none");
};

FuliPage.prototype._fillPage = function(info) {
    //console.log(info.content);
    var self = this;

    var wrap = this.inner.parent();
    wrap.find("h3").html(info.title);
    wrap.find("#information-page-inner-date").html(info.time);
    wrap.find("#information-page-inner-author").html(info.author);

    // 上一篇下一篇
    if(info.prev) {
        $("#information-page-prev a").html(info.prev.title);
        $("#information-page-prev a").attr("href", info.prev.url);
        $("#information-page-prev").css("display", "block");
    } else {
        $("#information-page-prev").css("display", "none");
    }
    if(info.next) {
        $("#information-page-next a").html(info.next.title);
        $("#information-page-next a").attr("href", info.next.url);
        $("#information-page-next").css("display", "block");
    } else {
        $("#information-page-next").css("display", "none");
    }

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
            $(this).addClass("to-fancy");
        } else {
            var inner = $(this).html();
            var src = $(this).attr("href");

            $(this).wrap('<span class="button-wrap"></span>');
            $(this).replaceWith('<button href="' + src + '" class="button button-3d-primary button-pill">' + inner + '</button>');
        }
    });

    // 评论
    if($("#information-page-inner-comment").attr("current") !== info.comment) {
        $("#information-page-inner-comment").attr("current", info.comment);
        $("#information-page-inner-comment").html(info.comment);
        console.log(info.comment);
    }

    $(".to-fancy").fancybox({
        helpers: {
            title : {
                type : 'float'
            }
        },

        margin: [ 65, 20, 20, 20 ]
    });
    $("#information-page-inner-body .button").click(function() {
        self.gui.Window.open($(this).attr("href"), {
            position: 'center',
            width: 640,
            height: 480,
            frame: true,
            //toolbar: false,
            icon: "link.png",

            title: "找福利阅读器 ❤ 内置浏览器"
        });
    });
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
        if(!titleResult || titleResult.length < 2) {
            callback(new Error("标题解析错误。"));
            return;
        }
        info.title = titleResult[1];

        // 作者
        var authorReg = /<a href="http:\/\/zhaofuli.net\/author\/.*?">(.*?)<\/a><\/span>/;
        var authorResult = authorReg.exec(html);
        if(!authorResult || authorResult.length < 2) {
            callback(new Error("作者解析错误。"));
            return;
        }
        info.author = authorResult[1];

        // 日期
        var timeReg = /<time class="muted"><i class="ico icon-time icon12"><\/i>(.*?)<\/time>/;
        var timeResult = timeReg.exec(html);
        if(!timeResult || timeResult.length < 2) {
            callback(new Error("日期解析错误。"));
            return;
        }
        info.time = timeResult[1].trim();

        // 内容
        var contentReg = /<article class="article-content">([\s\S]*?)<!-- Begin Digg http:\/\/pei.gd-->/;
        var contentResult = contentReg.exec(html);
        if(!contentResult || contentResult.length < 2) {
            callback(new Error("日期解析错误。"));
            return;
        }
        info.content = contentResult[1].trim();

        // 上一篇
        var prevReg = /<span class="article-nav-prev">上一篇 <a href="(.*?)" rel="prev">(.*?)<\/a><\/span>/;
        var prevResult = prevReg.exec(html);
        if(prevResult && prevResult.length >= 3) {
            info.prev = {
                url     : prevResult[1].trim(),
                title   : prevResult[2].trim()
            };
        }

        // 下一篇
        var nextReg = /<span class="article-nav-next"><a href="(.*?)" rel="next">(.*?)<\/a> 下一篇<\/span>/;
        var nextResult = nextReg.exec(html);
        if(nextResult && nextResult.length >= 3) {
            info.next = {
                url     : nextResult[1].trim(),
                title   : nextResult[2].trim()
            };
        }

        // 评论们啊哈哈
        var commentReg = /<div class="relates">[\s\S]*?<\/div>[\s]*<script type="text\/javascript">([\s\S]*)<div id="ds-ssr">/;
        var commentResult = commentReg.exec(html);
        if(!commentResult || commentResult.length < 2) {
            callback(new Error("评论解析错误。"));
            return;
        }
        info.comment = '<script type="text/javascript">' + commentResult[1].trim();

        // 加入缓存
        self.cache.set(url, info);
        callback(null, info);
    }, "utf8").on("error", function(error) {
        callback(error);
    });
};

FuliPage.prototype._openPage = function(url, title) {
    $(".nano").nanoScroller({ scrollTop: 0 });

    if(url === this.currentUrl) {
        this.object.css("display", "block");
        this.inner.parent().css("display", "block");

        return;
    }

    this.inner.parent().css("display", "none");
    this.inner.html("");

    this.object.css("display", "block");
    this.progressBar.find("span").text(title);
    this.progressBar.css("display", "block");

    $("#information-page-prev").css("display", "none");
    $("#information-page-next").css("display", "none");

    var self = this;
    this._loadPage(url, function(err, info) {
        if(err) {
            self.type.emit("alert", "<span style='color: red;'>✗</span> 错误发生：" + err.message);
            return;
        }

        self._fillPage(info);

        self.inner.parent().css("display", "block");
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

    $("#information-page-next a, #information-page-prev a").click(function() {
        self.type.emit("openPage", $(this).attr("href"), $(this).html());
        return false;
    });

    $(".navi-back").click(function() {
        self._hidePage();
        self.type.emit("showList");
    });
};

module.exports = FuliPage;
