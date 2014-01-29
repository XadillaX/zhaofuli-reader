/**
 * Created by XadillaX on 14-1-29.
 */
var spidex = require("spidex");
var url = window.location.hash.substr(1).split("￥")[0];
var title = window.location.hash.substr(1).split("￥")[1];

var regExp = /<article class="article-content">([\s\S]*)<!-- Begin Digg http:\/\/pei.gd-->/;
var gui = require('nw.gui');

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

function adjust() {
    $("title").text(title + " ❤ 找福利阅读器");

    $("#container img").addClass("img-thumbnail");
    $("#container a").each(function() {
        if($(this).find("img").length) {

        } else {
            $(this).addClass("label label-danger");
            $(this).html('<i class="glyphicon glyphicon-paperclip"></i> ' + $(this).html());
        }
    });
    $("p").each(function() {
        if($(this).html().indexOf("密码：") === 0 || $(this).html().indexOf("密码:") === 0) {
            $(this).wrap('<div class="alert alert-danger"></div>');
        } else if($(this).html().indexOf("番号：") === 0 || $(this).html().indexOf("番号:") === 0) {
            $(this).wrap('<div class="alert alert-warning"></div>');
        } else if($(this).html().trim().replaceAll("&nbsp;", "") === "") {
            $(this).remove();
        } else {
            if($(this).parent("blockquote").length === 0)
            $(this).wrap('<div class="alert alert-success"></div>');
        }
    });

    $("#container a").click(function() {
        gui.Window.open($(this).attr("href"), {
            position: "center",
            width: 800,
            height: 600,

            title: "找福利浏览器",
            toolbar: false,
            resizable: false,
            focus: true,

            "icon": "icon.png"
        });

        return false;
    });
}

$(function() {
    // 爬内容
    spidex.get(url, function(html, status, respHeader) {
        if(status == 200) {
            var result = html.match(regExp);
            if(result.length !== 2) {
                alert("文章读取出错。");
                return;
            }

            html = result[1];
            $("#container").html(html);

            adjust();
        } else {
            alert("文章读取出错。");
        }
    }, "utf8");

    // 多说
    $(".ds-thread").attr("data-title", title);
    $(".ds-thread").attr("data-url", url);
    var pathname = require("url").parse(url).pathname;
    var basename = require("path").basename(pathname, ".html");
    $(".ds-thread").attr("data-thread-key", basename);
});