/// <reference path="../typings/main.d.ts" />

export default class ZundokoKiyoshi {
    
    public ZUN:boolean  = false;
    public DOKO:boolean = true;
    
    public constructor() {
    }
    
    public getZundokoPeriod():boolean[] {
        // 気に入らないが…ローカルで短く書くには再定義しかない。        
        const ZUN:boolean = this.ZUN;
        const DOKO:boolean = this.DOKO;
        
        let t:boolean[] = [ZUN,ZUN,ZUN,ZUN,DOKO];
        return t;
    } 
}
