/**
 * Created by XadillaX on 2015/2/1.
 */
require("../extend");
var spidex = require("spidex");
var cheerio = require("cheerio");
var config = require("../config");
var qs = require("querystring");
var escaper = require("true-html-escape");

var getFromUri = exports.getFromUri = function(uri, callback) {
    console.debug("Fetching list from", uri);
    spidex.get(uri, {
        timeout: 60000
    }, function(html, status, respHeader) {
        if(status === 301 || status === 302) {
            return getFromUri(respHeader.location, callback);
        }

        if(status !== 200 && status !== 304) {
            return callback(new Error("找福利服务器返回了错误的状态码 " + status + "，请稍后再试。"));
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            return callback(new Error("找福利服务器返回了错误的分类内容，请稍后重试。"));
        }

        console.debug("Header:", respHeader);
        console.debug("List:", json);

        var cards = json.map(function(object) {
            var $ = cheerio.load(object.content);
            var images = [];
            $("img").each(function(/** i, elem */) {
                images.push(
                    config.safeMode ? 
                        "http://img.hb.aicdn.com/cffcd987f9c4f40f6f5c7082878e43bc66d293ca487cc-HxE4dR_fw658" :
                        $(this).attr("src"));
            });

            object.images = images;
            object.tags = object.getPath("terms.post_tag", []).map(function(v) {
                return v.name;
            });
            object.url = object.link;
            object.summary = object.excerpt.stripTags().replace(/ ?\[&hellip;\]/g, "…");
            object.dateString = Date.create(object.date).format("{yyyy} 年 {MM} 月 {dd} 日 {HH}:{mm}:{ss}");

            // escape
            object.title = escaper.unescape(object.title);

            return object;
        });

        return cards.length ? callback(undefined, cards, respHeader) : callback(new Error("没有更多了..."));
    }).on("error", callback);
};

exports.get = function(id, page, callback) {
    var url = config.baseUri + "wp-json/posts";
    var query = {
        "filter[cat]": id,
        page: page
    };
    var queryString = qs.stringify(query);
    url += "?" + queryString;
    getFromUri(url, callback);
};
