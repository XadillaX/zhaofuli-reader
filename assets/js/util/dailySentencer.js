var daily = require("daily-sentence");
var $ = null;

var DailySentencer = function(win, jquery) {
    this.win = win;
    $ = jquery;

    this.object = $("#daily-sentence");

    this.sen = $("#daily-sentence").find("#en-sentence span").html();
    this.trans = $("#daily-sentence").find("#zh-sentence span").html();

    var self = this;
    $("#say-english").click(function() { self.speakEnglish(); });
    $("#say-chinese").click(function() { self.speakChinese(); });
};

DailySentencer.prototype.speakEnglish = function() {
    $.say(this.sen);
};

DailySentencer.prototype.speakChinese = function() {
    $.say(this.trans, "zh-CN");
};

DailySentencer.prototype.fetch = function() {
    var self = this;
    daily.today(function(err, sen) {
        if(err) return;
        if(!sen.sen || !sen.trans) return;

        self.sen = sen.sen;
        self.trans = sen.trans;

        self.object.find("#en-sentence span").html(self.sen);
        self.object.find("#zh-sentence span").html(self.trans);

        self.object.find("#en-sentence span").attr("title", self.sen);
        self.object.find("#zh-sentence span").attr("title", self.trans);

        // self.object.find("#en-sentence span").tooltip();
        // self.object.find("#zh-sentence span").tooltip();
    });
};

module.exports = DailySentencer;
