/// <reference path="../typings/main.d.ts" />

import ZundokoKiyoshi from './ZundokoKiyoshi';

class ZundokoButton {

    // プロパティっぽいもの
    public zundokoHistory: KnockoutObservableArray<ZundokoRecord>;
    public latestZundoko: KnockoutObservable<string>;
    public zundokoCount: KnockoutObservable<number>;

    // 心臓と言うべき「ズンドコキヨシ」オブジェクト。
    private engine:ZundokoKiyoshi = new ZundokoKiyoshi();

    // ローカル保存してくれるヤーツ。
    private store:ZundokoStore = new ZundokoStore();

    // コンストラクタ
    public constructor() {
        // ストレージから読めるようなら、一件目をちぎって表示、そうでなければ空表示。
        let loaded = this.store.load();
        let latest:ZundokoRecord = (loaded.length > 0) ? loaded.shift() : new ZundokoRecord(0,"",0);

        this.latestZundoko = ko.observable(latest.line);
        this.zundokoCount = ko.observable(latest.no);
        this.zundokoHistory = ko.observableArray(loaded);
    }

    //　ズンドコ実行！
    public execKiyoshi() {
        // 現在表示中のズンドコ内容を配列の前に足す。
        if (this.latestZundoko().length > 0) {
            this.zundokoHistory.unshift(this.getNowZundokoRecord());
        }
        // 新たにズンドコする。
        let line = this.engine.createZundokoLine();
        let count = this.engine.countZundoko(line);
        this.latestZundoko(line);
        this.zundokoCount(count);
        // 結果をローカル保存する。
        this.store.save(this);
    }

    // 現在表示されてる「ズンドコ」をRecordのカタチを取る。
    public getNowZundokoRecord():ZundokoRecord {
        let no:number = this.zundokoHistory().length + 1;
        return new ZundokoRecord(no, this.latestZundoko(), this.zundokoCount());
    }

    // ズンドコ履歴のクリア。
    public clearZundokoHistory() {
        this.latestZundoko("");
        this.zundokoCount(0);
        this.zundokoHistory.splice(0, this.zundokoHistory().length);
        this.store.save(this);
    }

}

// 「ボタン一回押した分」の情報を持つケースクラス…のようなもの。
class ZundokoRecord {
    public constructor(public no:number, public line:string , public count:number) {
    }
}

// 履歴情報を永続化するクラス。
class ZundokoStore {

    // 内部保存するかフラグ
    public localSave: boolean = true;

    public load():ZundokoRecord[] {
        let loaded:ZundokoRecord[] = [];
        if (this.localSave) {
            loaded = JSON.parse(localStorage.getItem('zundokoButton'));
        }
        return loaded;
    }

    public save(target:ZundokoButton) {
        if (this.localSave) {
            let forSave:ZundokoRecord[] = [];
            let nowZundoko = target.getNowZundokoRecord();
            // 一度でもボタンが押されてたら、
            // 現在表示中のものまでを含んだ配列にし、JSONでローカル保存。
            if (nowZundoko.line.length > 0) {
                forSave = target.zundokoHistory().slice(0); // 手っ取り早い配列のコピー。
                forSave.unshift(nowZundoko);
            }
            // JSON文字列にしてlocalStrage保存。
            let json:string = JSON.stringify(forSave);
            localStorage.setItem('zundokoButton' , json);
        }
    }

}

ko.applyBindings(new ZundokoButton());
