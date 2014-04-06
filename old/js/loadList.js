/**
 * Created by XadillaX on 14-1-28.
 */
var baseUrl = "http://zhaofuli.net/"
var spidex = require("spidex");
var async = require("async");

spidex.setDefaultUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36");

var listRegExp = /<header>\s*.*\s*<h2><a href="(.*)" .*>(.*)<\/a><\/h2>\s*<\/header>/g;
var listRegExpEach = /<header>\s*.*\s*<h2><a href="(.*)" .*>(.*)<\/a><\/h2>\s*<\/header>/;

/**
 * 解析html到list数组
 * @param html
 * @returns {Array}
 * @private
 */
function _parseList(html) {
    var result = html.match(listRegExp);

    var list = [];

    for(var i = 0; i < result.length; i++) {
        var newResult = result[i].match(listRegExpEach);

        if(newResult.length !== 3) continue;

        list.push({ title: newResult[2], url: newResult[1] });
    }

    return list;
}

var gui = require('nw.gui');

function _addArticles(list) {
    var obj = $("#article-wrapper")
    for(var i = 0; i < list.length; i++) {
        var html = "<article style='display: none;'>";
        html += "<h2>";
        html += "<a class='list-a' href=\"javascript:void(0)\" value=\"" + list[i].url + "\">" + list[i].title + "</a>";
        html += "</h2>";
        html += "</article>";

        obj.append(html);
        obj.children().last().fadeIn("normal");
    }

    $(".list-a").click(function() {
        gui.Window.open("showHTML.html#" + $(this).attr("value") + "￥" + $(this).text(), {
            position: "center",
            width: 800,
            height: 600,

            title: "找福利浏览器",
            toolbar: false,
            resizable: false,
            focus: true,

            "icon": "icon.png"
        });
    });
}

var lastPage = 1;
var type = "";

function loadList(page, type) {
    $("#load-more-div").css("display", "none");
    $(".screen").css("display", "block");

    var url = baseUrl;
    if(type !== "") {
        url += "category/" + type;
    }
    if(page !== 1) {
        if(type !== "") url += "/";
        url += "page/" + page;
    }

    //alert(url);
    spidex.get(url, function(html, status, respHeader) {
        console.log("Response from " + url);
        console.log("Status: " + status);
        console.log("Response header: ");
        console.log(respHeader);

        if(status === 200) {
            var list = _parseList(html);

            _addArticles(list);
        } else {
            if(status == 404) {
                alert("已经是最后一页了。");
            } else if(status == 301) {
                alert("找福利君打喷嚏了，请稍后再试。");
            }
        }

        $(".screen").css("display", "none");
        $("#load-more-div").css("display", "block");
    }, "utf8");
}

$(function() {
    loadList(1, "");

    $("#load-more-div a").click(function() {
        lastPage++;
        loadList(lastPage, type);
    });

    $(".choose-type").click(function() {
        $("#article-wrapper").html("");
        lastPage = 1;
        type = $(this).attr("value");

        $(".choose-type").each(function() {
            $(this).parent().removeClass("active");
        });
        $(this).parent().addClass("active");

        $(".navbar-collapse").removeClass("in");
        $(".navbar-collapse").addClass("collapse");

        loadList(lastPage, type);
    });
});