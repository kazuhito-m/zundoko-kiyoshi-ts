/// <reference path="../typings/main.d.ts" />

import ZundokoRecord from './ZundokoRecord';

// Twitterコメントを飛ばす…ための窓のURLを作成するクラス。
export default class TwitterLinkMaker {

    private static MAX: number = 107;
    
    // リンク(aタグ)用のURLを作成する。
    public makeUrl(record: ZundokoRecord): string {
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
        } else {
            word = NAME + "は、kiyoshi()関数をいつでも何度でも好きなだけ叩けます！";
        }
        // URLの組み立て。
        let url: string = "http://twitter.com/share?text="
            + encodeURIComponent(word)
            + "&url=http://bit.ly/259xEoF&hashtags="
            + encodeURIComponent(NAME);
        return url;
    }

}
