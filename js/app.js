(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
class AppVersion {
}
AppVersion.version = "1.0.14";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppVersion;

},{}],2:[function(require,module,exports){
"use strict";
class TwitterLinkMaker {
    makeUrl(record) {
        const NAME = "ズンドコボタン";
        const MAX = TwitterLinkMaker.MAX;
        const OMIT_SUFFIX = "…]";
        let word = "";
        if (record.line.length > 0) {
            word = "kiyoshi()関数で " + record.count.toString(10) + " ズンドコが出ました。("
                + record.no + "回目結果) [" + record.line + "]";
            if (word.length > MAX) {
                word = word.substring(0, MAX - OMIT_SUFFIX.length) + OMIT_SUFFIX;
            }
        }
        else {
            word = NAME + "は、kiyoshi()関数をいつでも何度でも好きなだけ叩けます！";
        }
        let url = "http://twitter.com/share?text="
            + encodeURIComponent(word)
            + "&url=http://bit.ly/259xEoF&hashtags="
            + encodeURIComponent(NAME);
        return url;
    }
}
TwitterLinkMaker.MAX = 107;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TwitterLinkMaker;

},{}],3:[function(require,module,exports){
"use strict";
const ZundokoRecord_1 = require('./ZundokoRecord');
const ZundokoStore_1 = require('./ZundokoStore');
const AppVersion_1 = require('./AppVersion');
const TwitterLinkMaker_1 = require('./TwitterLinkMaker');
class ZundokoButtonViewModel {
    constructor() {
        this.store = new ZundokoStore_1.default();
        let loaded = this.store.load();
        let latest = (loaded.length > 0) ? loaded.shift() : ZundokoRecord_1.default.create(0, false);
        this.latestZundoko = ko.observable(latest);
        this.zundokoHistory = ko.observableArray(loaded);
        this.appVersion = ko.observable(AppVersion_1.default.version);
        this.getTwitterHref = ko.computed(() => {
            return (new TwitterLinkMaker_1.default()).makeUrl(this.latestZundoko());
        }, this);
    }
    get latestLine() {
        return this.latestZundoko().line;
    }
    get latestCount() {
        return this.latestZundoko().count;
    }
    get latestNo() {
        return this.latestZundoko().no;
    }
    execKiyoshi() {
        if (this.latestZundoko().line.length > 0) {
            this.zundokoHistory.unshift(this.latestZundoko());
        }
        let nowNo = this.zundokoHistory().length + 1;
        this.latestZundoko(ZundokoRecord_1.default.create(nowNo, true));
        this.saveLocal();
    }
    clearZundokoHistory() {
        this.latestZundoko(ZundokoRecord_1.default.create(1, false));
        this.zundokoHistory.splice(0, this.zundokoHistory().length);
        this.saveLocal();
    }
    saveLocal() {
        this.store.save(this.latestZundoko(), this.zundokoHistory());
    }
}
ko.applyBindings(new ZundokoButtonViewModel());

},{"./AppVersion":1,"./TwitterLinkMaker":2,"./ZundokoRecord":5,"./ZundokoStore":6}],4:[function(require,module,exports){
"use strict";
class ZundokoKiyoshi {
    getZundokoPeriod() {
        let zndkLog = [];
        let zunCount = 0;
        let zunOrDoko = ZundokoKiyoshi.DOKO;
        while (!(zunCount >= 4 && zunOrDoko == ZundokoKiyoshi.DOKO)) {
            zunCount++;
            if (zunOrDoko == ZundokoKiyoshi.DOKO)
                zunCount = 0;
            zunOrDoko = this.genZunDoko();
            zndkLog.push(zunOrDoko);
        }
        return zndkLog;
    }
    genZunDoko() {
        return (Math.random() * 2) < 1;
    }
    convertZundokoString(zndkLog) {
        return zndkLog.map((e, i, a) => { return (e == ZundokoKiyoshi.ZUN ? "ズン" : "ドコ"); }).join("") + ZundokoKiyoshi.SUFFIX;
    }
    createZundokoLine() {
        return this.convertZundokoString(this.getZundokoPeriod());
    }
    countZundoko(zndkLine) {
        return (zndkLine.length - ZundokoKiyoshi.SUFFIX.length) / 2;
    }
    kiyoshi() {
        console.log(this.createZundokoLine());
    }
}
ZundokoKiyoshi.DOKO = true;
ZundokoKiyoshi.ZUN = !ZundokoKiyoshi.DOKO;
ZundokoKiyoshi.SUFFIX = "キ・ヨ・シ！";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZundokoKiyoshi;

},{}],5:[function(require,module,exports){
"use strict";
const ZundokoKiyoshi_1 = require('./ZundokoKiyoshi');
class ZundokoRecord {
    constructor(no, line, count) {
        this.no = no;
        this.line = line;
        this.count = count;
    }
    execKiyoshi() {
        let engine = new ZundokoKiyoshi_1.default();
        this.line = engine.createZundokoLine();
        this.count = engine.countZundoko(this.line);
    }
    static create(no, execKiyoshi) {
        let rec = new ZundokoRecord(no, "", 0);
        if (execKiyoshi)
            rec.execKiyoshi();
        return rec;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZundokoRecord;

},{"./ZundokoKiyoshi":4}],6:[function(require,module,exports){
"use strict";
class ZundokoStore {
    constructor() {
        this.localSave = true;
    }
    load() {
        let loaded = [];
        let json = localStorage.getItem(ZundokoStore.KEY);
        if (this.localSave && json !== null) {
            loaded = JSON.parse(json);
        }
        return loaded;
    }
    save(nowRecord, history) {
        if (this.localSave) {
            let forSave = [];
            if (nowRecord.line.length > 0) {
                forSave = history.slice(0);
                forSave.unshift(nowRecord);
            }
            let json = JSON.stringify(forSave);
            localStorage.setItem(ZundokoStore.KEY, json);
        }
    }
}
ZundokoStore.KEY = 'zundokoButton';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZundokoStore;

},{}]},{},[4,3]);
