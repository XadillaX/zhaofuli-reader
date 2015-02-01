/**
 * Created by XadillaX on 2015/2/1.
 */
var spidex = require("spidex");
var cheerio = require("cheerio");
var config = require("../config");

exports.get = function(baseUri, page, callback) {
    var url = baseUri;
    if(url.last() !== "/" && page !== 1) {
        url += "/";
    }

    if(page !== 1) {
        url += "page/";
        url += page;
    }

    console.debug("fetching " + url);

    spidex.get(url, {
        timeout: 60000
    }, function(html, status, respHeader) {
        if(status !== 200 && status !== 304) {
            console.log(respHeader);
            return callback(new Error("找福利服务器返回了错误的状态码，请稍后再试。" + status));
        }

        var $ = cheerio.load(html);

        var cards = [];
        $("article.excerpt").each(function() {
            var object = {};

            // 分类信息
            if(baseUri === config.baseUri) {
                var cat = $(this).find("a.cat");
                object.cat = {
                    name: cat.text(),
                    url: cat.attr("href")
                };
            }

            // 标题
            var titleObj = $(this).find("header h2 a");
            object.title = titleObj.text();
            object.url = titleObj.attr("href");

            // 作者 & 时间
            object.author = $(this).find("p.time").text();

            // 图片...
            var focus = $(this).find("p.focus");
            if(focus.length) {
                var items = [];
                focus.find("a.thumbnail img").each(function() {
                    items.push($(this).attr("data-original"));
                });
                object.images = items;
            } else {
                object.images = [];
            }

            // summar
            object.summary = $(this).find("p.note").text();

            // 阅读
            object.read = /阅读\((\d*)\)/.exec($(this).find("span.post-views").text())[1];

            // 标签
            var tags = [];
            $(this).find("span.post-tags a").each(function() {
                tags.push($(this).text())
            });
            object.tags = tags;

            cards.push(object);
        });

        callback(undefined, cards);
    }).on("error", callback);
};
