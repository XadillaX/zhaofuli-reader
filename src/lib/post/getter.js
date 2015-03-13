/**
 * Created by XadillaX on 2015/3/14.
 */
var spidex = require("spidex");

// abandoned
// post information can be gotten in the list
exports.get = function(uri, callback) {
    spidex.get(uri, {
        timeout: 60000
    }, function(html, status, respHeader) {
        if(status === 301 || status === 302) {
            return exports.get(respHeader.location, callback);
        }

        if(status !== 200) {
            return callback(new Error("找福利服务器返回了错误的状态码 " + status + "，请稍后再试。"));
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            console.debug("服务器返回错误的数据格式：", html);
            return callback(new Error("服务器返回错误的数据格式。"));
        }

        callback(undefined, json);
    }).on("error", callback);
};
