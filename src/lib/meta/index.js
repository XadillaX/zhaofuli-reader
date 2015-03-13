/**
 * Created by XadillaX on 2015/2/23.
 */
var spidex = require("spidex");
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var config = require("../config");

var _uris = {
    type: config.baseUri + "wp-json/taxonomies/category/terms",
    meta: config.baseUri + "wp-json/"
};

var MetaGetter = function() {
    EventEmitter.call(this);

    this.getting = false;
    this.meta = undefined;
    this.types = undefined;
};

util.inherits(MetaGetter, EventEmitter);

MetaGetter.prototype.getCategories = function(callback, url) {
    console.debug("Getting types...");

    var typeUri = url || _uris.type;
    var self = this;
    spidex.get(typeUri, {
        timeout: 60000
    }, function(html, status, respHeader) {
        if(301 === status || 302 === status) {
            return self.getCategories(callback, respHeader.location);
        }

        if(200 !== status) {
            var err = new Error("找福利服务器返回了错误的状态码 " + status + "，请稍后再试。");
            callback(err);
            self.getting = false;
            return self.emit("got", err);
        }

        var json;
        try {
            var count = 0;
            json = JSON.parse(html);
            json = json.reduce(function(res, item) {
                if(item.parent) return res;

                res.push({
                    name: item.name,
                    url: item.link,
                    id: item.ID,
                    slug: item.slug,
                    count: item.count
                });

                count += item.count;
                return res;
            }, [ { name: "所有", url: config.baseUri, slug: "", active: true, id: "" } ]).sort(function(a, b) {
                return a.id - b.id;
            });

            json[0].count = count;
        } catch(e) {
            var err = new Error("找福利服务器返回了错误的分类内容，请稍后重试。");
            callback(err);
            self.getting = false;
            return self.emit("got", err);
        }

        return callback(undefined, json);
    }).on("error", callback);
};

MetaGetter.prototype.getMeta = function(callback, url) {
    console.debug("Getting meta information...");

    if(this.getting) {
        return this.once("got", callback);
    }

    var self = this;
    if(this.meta) {
        return process.nextTick(function() {
            callback(undefined, self.meta);
        });
    }

    this.getting = true;

    var metaUri = url || _uris.meta;
    spidex.get(metaUri, {
        timeout: 60000
    }, function(html, status, respHeader) {
        if(301 === status || 302 === status) {
            return self.getMeta(callback, respHeader.location);
        }

        if(200 !== status) {
            var err = new Error("找福利服务器返回了错误的状态码 " + status + "，请稍后再试。");
            callback(err);
            self.getting = false;
            return self.emit("got", err);
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            var err = new Error("找福利服务器返回了错误的内容，请稍后重试。");
            callback(err);
            self.getting = false;
            return self.emit("got", err);
        }

        self.meta = json;
        callback(undefined, json);
        self.getting = false;
        self.emit("got", undefined, json);
    }).on("error", function(err) {
        callback(err);
        self.getting = false;
        self.emit("got", err);
    });
};

module.exports = new MetaGetter();
