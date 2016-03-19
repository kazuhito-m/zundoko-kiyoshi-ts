/// <reference path="../typings/main.d.ts" />

import ZundokoKiyoshi from './ZundokoKiyoshi';

// 「ボタン一回押した分」の情報を持つケースクラス…のようなもの。
export default class ZundokoRecord {

    public constructor(public no: number, public line: string, public count: number) {
    }
    
    // kiyoshi()を実行して、自らにズンドコ文字列をセットする。
    public execKiyoshi() {
        // 心臓と言うべき「ズンドコキヨシ」オブジェクト。
        let engine = new ZundokoKiyoshi();
        // 新たにズンドコする。
        this.line = engine.createZundokoLine();
        this.count = engine.countZundoko(this.line);
    }

    // 新たにレコードを生む。その際「kiyoshi()実行が必要」ならそれを。  
    public static create(no: number, execKiyoshi: boolean): ZundokoRecord {
        let rec = new ZundokoRecord(no, "", 0);
        if (execKiyoshi) rec.execKiyoshi();
        return rec;
    }

}