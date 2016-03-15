/// <reference path="../typings/main.d.ts" />

import * as assert from 'power-assert';
import ZundokoKiyoshi from '../main/ZundokoKiyoshi';

describe("ZundokoKiyoshi", () => {

    var sut = new ZundokoKiyoshi();

    it("ズンドコの概念を定数として提供するか", () => {
        assert.equal(ZundokoKiyoshi.ZUN, false);
        assert.equal(ZundokoKiyoshi.DOKO, true);
    });

    it("ズンドコの配列を取得できるか" , () => {
        let actual:boolean[] = sut.getZundokoPeriod();
        // console.log("カウントは " + actual.length);
        // console.log(actual.join(","));
        let zndk:string = "";
        assert.equal(actual.length > 4, true);
    });

    it("ズンドコのランダマイズはある程度出来ているか", () => {
        var zc:number = 0;
        for (var i = 0;i < 10000;i++) if (sut.genZunDoko()) zc++;
        assert.equal(zc > 4750, true);
        assert.equal(zc < 5200, true);
    });

    it("ズンドコの文字列表現への変換は可能か", () => {
        // 気に入らないが…ローカルで短く書くには再定義しかない。        
        const ZUN:boolean = ZundokoKiyoshi.ZUN;
        const DOKO:boolean = ZundokoKiyoshi.DOKO;
        
        let actual:string = sut.convertZundokoString([ZUN,DOKO,ZUN,ZUN,ZUN,ZUN,DOKO]);

        assert.equal(actual, "ズンドコズンズンズンズンドコ");
    });
    
    it("実際にコンソールに出力するズンドコチェックは実行出来るか", () => {
        sut.execZundoko();
    });
    
});

