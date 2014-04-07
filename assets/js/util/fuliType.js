/**
 * Created by XadillaX on 2014/4/7.
 */
var events = require("events");
var util = require("util");
var typesUrl = {
    "全部"    : "http://zhaofuli.net/",
    "福利"    : "http://zhaofuli.net/category/songfuli",
    "软件"    : "http://zhaofuli.net/category/ruanjiansenlin",
    "内涵"    : "http://zhaofuli.net/category/neihannidongde",
    "发源"    : "http://zhaofuli.net/category/tupianfayuandi",
    "极客"    : "http://zhaofuli.net/category/jike",
    "游戏"    : "http://zhaofuli.net/category/game",
    "推荐"    : "http://zhaofuli.net/category/tuijian"
};

/**
 * 福利类型
 * @constructor
 */
var FuliType = function() {
    events.EventEmitter.call(this);
    this.current = "";
};
util.inherits(FuliType, events.EventEmitter);

/**
 * 设置当前分类
 * @param name
 */
FuliType.prototype.setCurrent = function(name) {
    this.current = name;
    this.emit("changeType", name);
};

/**
 * 获取当前分类
 * @returns {string}
 */
FuliType.prototype.getCurrent = function() {
    return this.current;
};

/**
 * 根据页码获取相应的类型URL
 * @param type
 * @param [page]
 * @returns {*}
 */
FuliType.prototype.getUrlByPage = function(type, page) {
    var baseUrl = typesUrl[type];
    if(undefined === baseUrl) return "";

    if(page === 1 || page === undefined) {
        return baseUrl;
    } else {
        if(type === "全部") baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        baseUrl += "/page/" + page;
        return baseUrl;
    }
};

module.exports = FuliType;
