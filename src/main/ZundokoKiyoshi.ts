/// <reference path="../typings/main.d.ts" />

export default class ZundokoKiyoshi {
    
    // "ズン"と"ドコ"の定数
    public static ZUN:boolean  = false;
    public static DOKO:boolean = true;
    
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
    
    // ズンドコ配列を文字列に変換する。
    public convertZundokoString(zndkLog:boolean[]) {
        return zndkLog.map((e,i,a) => { return (e == ZundokoKiyoshi.ZUN ? "ズン" : "ドコ") }).join("") + "キ・ヨ・シ！";
    }
    
    // ズンドコ文字列を生成する
    public createZundokoLine():string {
        return this.convertZundokoString(this.getZundokoPeriod());
    }
    
    // 文字列をコンソールに書く。
    public kiyoshi() {
        console.log(this.createZundokoLine());
    }
    
}
