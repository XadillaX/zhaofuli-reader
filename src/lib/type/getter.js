var spidex = require("spidex");
var cheerio = require("cheerio");
var config = require("../config");

exports.get = function(callback) {
    spidex.get(config.baseUri, {
        timeout: 60000
    }, function(html, status) {
        if(status !== 200 && status !== 304) {
            return callback(new Error("找福利服务器返回了错误的状态码，请稍后再试。"));
        }
        
        var $ = cheerio.load(html);
        var types = [ { name: "所有", url: config.baseUri, active: true } ];
        $(".nav > li.menu-item > a").each(function() {
            var a = $(this);
            var object = {
                name: a.text(),
                url: a.attr("href"),
                extra: !a.attr("href").startsWith(config.baseUri)
            };
            types.push(object);
        });
        
        console.log(types);
        callback(undefined, types);
    }).on("error", callback);
};
