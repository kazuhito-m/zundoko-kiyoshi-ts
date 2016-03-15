/// <reference path="../typings/main.d.ts" />

export default class ZundokoKiyoshi {
    
    // "ズン"と"ドコ"の定数
    public static ZUN:boolean  = false;
    public static DOKO:boolean = true;
    
    public constructor() {
    }
    
    // ズンドコ列を真偽値の配列で返す。
    public getZundokoPeriod():boolean[] {
        
        let zndkLog:boolean[] = []; // ズンドコの履歴
        let zunCount:number = 0;    // ズンカウンタ
        let zunOrDoko:boolean = ZundokoKiyoshi.DOKO;   // カレントの値

        // ズン４つに最後がドコになるまで。
        while (!(zunCount >= 4 && zunOrDoko == ZundokoKiyoshi.DOKO)) {
            // カレントが"ズン"ならカウントアップ、"ドコ"なら初期化         
            zunCount++;
            if (zunOrDoko == ZundokoKiyoshi.DOKO) zunCount = 0;
            // ズンドコ取得
            zunOrDoko = this.genZunDoko();
            // リストには絶えず足す。
            zndkLog.push(zunOrDoko);
        }
        
        return zndkLog;
    }
    
    // ズンorドコをランダムに返す。
    public genZunDoko():boolean {
        return (Math.random() * 2) < 1;
    }
    
    // 文字列をコンソールに書く。
    public execZundoko() {
        
    }
    
    public convertZundokoString(zndkLog:boolean[]) {
        let printer =  new ZundokoPrinter();
        return printer.makeZundokoString(zndkLog);
    }
    
}

// ズンドコ文字列の生成だけを責務にしたクラス。
class ZundokoPrinter {
    // ズンドコ配列を文字列に変換する。
    public makeZundokoString(zndkLog:boolean[]) {
        return "";  //　仮実装   
    }
}
