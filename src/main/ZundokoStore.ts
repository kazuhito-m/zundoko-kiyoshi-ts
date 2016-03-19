/// <reference path="../typings/main.d.ts" />

import ZundokoRecord from './ZundokoRecord';

// 履歴情報を永続化するクラス。
export default class ZundokoStore {
    // localStrageに保存するキー文字列。
    private static KEY: string = 'zundokoButton';

    // 内部保存するかフラグ
    public localSave: boolean = true;

    public load(): ZundokoRecord[] {
        let loaded: ZundokoRecord[] = [];
        let json: string = localStorage.getItem(ZundokoStore.KEY);
        if (this.localSave && json !== null) {
            loaded = JSON.parse(json);
        }
        return loaded;
    }

    public save(nowRecord: ZundokoRecord, history: ZundokoRecord[]) {
        if (this.localSave) {
            let forSave: ZundokoRecord[] = [];
            // 一度でもボタンが押されてたら、
            // 現在表示中のものまでを含んだ配列にし、JSONでローカル保存。
            if (nowRecord.line.length > 0) {
                forSave = history.slice(0); // 手っ取り早い配列のコピー。
                forSave.unshift(nowRecord);
            }
            // JSON文字列にしてlocalStrage保存。
            let json: string = JSON.stringify(forSave);
            localStorage.setItem(ZundokoStore.KEY, json);
        }
    }

}
