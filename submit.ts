/*
 * Maimai-Alias-Querier -> submit.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */
import fs from 'node:fs';
import { getAliasByIndex } from './aliasData'

export type SubmitStatus = 'open' | 'rejected' | 'accepted'

export type Submit = {
    status: SubmitStatus,
    title: string,
    alias: string,
    exist: boolean,
    aliasIndex: number,
    time: string
}

var submits: Submit[] = [];
var success: boolean = false;
function updateSubmit() {

}
export function initSubmitData(path: string) {
    try {
        fs.accessSync(path, fs.constants.F_OK );
    } catch (e) {
        try {
            fs.writeFileSync(path, '[]');
        } catch (ee) {
            console.log(ee);
        }
    }
    try {
        var _data: string = fs.readFileSync(path, { encoding: 'utf8' });
        var data = JSON.parse(_data);
        data.forEach((value: {status:string, title:string, alias:string, exist:boolean, aliasIndex:number, time:string}) => {
            var subm: Submit = {
                status: (function():SubmitStatus{
                    if (value.status == 'open') return 'open';
                    if (value.status == 'rejected') return 'rejected';
                    else return 'accepted';
                })(),
                title: value.title,
                alias: value.title.toString(),
                exist: value.exist,
                aliasIndex: value.aliasIndex,
                time: value.time.toString()
            }
            submits.push(subm);
        });
    } catch (e) {
        console.log(e);
    }
    success = true;
    return;
}
export function submitData(title: string, alias: string, exist: boolean, aliasIndex?: number) {
    var subm: Submit = {
        status: 'open',
        title: exist? getAliasByIndex(aliasIndex || -1).title : title,
        alias: alias,
        exist: exist,
        aliasIndex: aliasIndex || -1,
        time: (new Date()).toLocaleString()
    }
    submits.push(subm);
}
export function getSubmits(): Submit[] {
    return submits;
}
export function validateSubmitPost(resource: {title:string, notexist:string, title_e:string, alias:string}):boolean {
    var v1,v2
    try {
        v1 = ((resource.notexist != 'on') && (resource.title_e.trim() != '')) || (resource.title.trim() != '');
        v2 = resource.alias.trim() != '';
    } catch (e) {
        console.log(e);
        return false;
    }
    if (v1 && v2) {
        return true;
    } else {
        return false;
    }
}