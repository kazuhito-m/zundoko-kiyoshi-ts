/// <reference path="../typings/main.d.ts" />

import * as assert from 'power-assert';
import ZundokoKiyoshi from '../main/ZundokoKiyoshi';

describe("ZundokoKiyoshi", () => {
	it("ズンドコの概念を定数として提供するか", () => {
        let zndk = new ZundokoKiyoshi();
		assert.equal(zndk.ZUN, false);
		assert.equal(zndk.DOKO, true);
	});
    
    it("ズンドコの配列を取得できるか" , () => {
        let zndk = new ZundokoKiyoshi();
        
        let actual:boolean[] = zndk.getZundokoPeriod();
        assert.equal(actual.length , 0);
        
    });
});

