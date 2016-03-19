/// <reference path="../typings/main.d.ts" />

import ZundokoRecord from './ZundokoRecord';
import ZundokoStore from './ZundokoStore';
import AppVersion from './AppVersion';

class ZundokoButtonViewModel {

    // プロパティっぽいもの
    public zundokoHistory: KnockoutObservableArray<ZundokoRecord>;
    public latestZundoko: KnockoutObservable<ZundokoRecord>;
    public appVersion: KnockoutObservable<string>;
    public getTwitterHref: KnockoutComputed<string>;

    // ローカル保存してくれるヤーツ。
    private store = new ZundokoStore();

    // プロパティ(ReadOnly)
    public get latestLine():string {
        return this.latestZundoko().line;
    }

    public get latestCount():number {
        return this.latestZundoko().count;
    }

    // コンストラクタ
    public constructor() {
        // ストレージから読めるようなら、一件目をちぎって表示、そうでなければ空表示。
        let loaded = this.store.load();
        let latest:ZundokoRecord = (loaded.length > 0) ? loaded.shift() : ZundokoRecord.create(0,false);

        this.latestZundoko = ko.observable(latest);
        this.zundokoHistory = ko.observableArray(loaded);
        this.appVersion = ko.observable(AppVersion.version);
        
        this.getTwitterHref = ko.computed(():string => {
            return this.makeTwitterLinkUrl();
        },this);

    }

    //　ズンドコ実行！
    public execKiyoshi() {
        // 現在表示中のズンドコ内容を配列の前に足す。
        if (this.latestZundoko().line.length > 0) {
            this.zundokoHistory.unshift(this.latestZundoko());
        }
        // 新たにズンドコする。
        let nowNo = this.zundokoHistory().length + 1;
        this.latestZundoko(ZundokoRecord.create(nowNo,true));
        // 結果をローカル保存する。
        this.saveLocal();
    }

    // ズンドコ履歴のクリア。
    public clearZundokoHistory() {
        this.latestZundoko(ZundokoRecord.create(1,false));
        this.zundokoHistory.splice(0, this.zundokoHistory().length);
        this.saveLocal();
    }

    // localStrageに保存する。
    private saveLocal() {
        this.store.save(this.latestZundoko() , this.zundokoHistory());
    }
    
    // Twitterコメントを飛ばす…ための窓のURLを作成する。
    private makeTwitterLinkUrl():string {
        const MAX = 107;
        const NAME = "ズンドコボタン";
        let word = "";
        let latest:ZundokoRecord = this.latestZundoko();
        if (latest.line.length > 0) {
            word = "kiyoshi()関数で " + latest.count.toString(10) + " ズンドコが出ました。[" + latest.line + "]";
            if (word.length > MAX) {
                word = word.substring(0,MAX - 2) + "…]";
            }
        } else {
            word = NAME + "は、kiyoshi()関数をいつでも何度でも好きなだけ叩けます！";
        }
        // URLの組み立て。
        let url:string = "http://twitter.com/share?text="
            + encodeURIComponent(word)
            + "&url=http://bit.ly/259xEoF&hashtags="
            + encodeURIComponent(NAME);
        return url;
    }
    
}

ko.applyBindings(new ZundokoButtonViewModel());
