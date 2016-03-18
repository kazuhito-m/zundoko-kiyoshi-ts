(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const ZundokoKiyoshi_1 = require('./ZundokoKiyoshi');
class ZundokoButton {
    constructor() {
        this.engine = new ZundokoKiyoshi_1.default();
        this.store = new ZundokoStore();
        let loaded = this.store.load();
        let latest = (loaded.length > 0) ? loaded.shift() : new ZundokoRecord(0, "", 0);
        this.latestZundoko = ko.observable(latest.line);
        this.zundokoCount = ko.observable(latest.no);
        this.zundokoHistory = ko.observableArray(loaded);
    }
    execKiyoshi() {
        if (this.latestZundoko().length > 0) {
            this.zundokoHistory.unshift(this.getNowZundokoRecord());
        }
        let line = this.engine.createZundokoLine();
        let count = this.engine.countZundoko(line);
        this.latestZundoko(line);
        this.zundokoCount(count);
        this.store.save(this);
    }
    getNowZundokoRecord() {
        let no = this.zundokoHistory().length + 1;
        return new ZundokoRecord(no, this.latestZundoko(), this.zundokoCount());
    }
    clearZundokoHistory() {
        this.latestZundoko("");
        this.zundokoCount(0);
        this.zundokoHistory.splice(0, this.zundokoHistory().length);
        this.store.save(this);
    }
}
class ZundokoRecord {
    constructor(no, line, count) {
        this.no = no;
        this.line = line;
        this.count = count;
    }
}
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
    save(target) {
        if (this.localSave) {
            let forSave = [];
            let nowZundoko = target.getNowZundokoRecord();
            if (nowZundoko.line.length > 0) {
                forSave = target.zundokoHistory().slice(0);
                forSave.unshift(nowZundoko);
            }
            let json = JSON.stringify(forSave);
            localStorage.setItem(ZundokoStore.KEY, json);
        }
    }
}
ZundokoStore.KEY = 'zundokoButton';
ko.applyBindings(new ZundokoButton());

},{"./ZundokoKiyoshi":2}],2:[function(require,module,exports){
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

},{}]},{},[2,1]);
