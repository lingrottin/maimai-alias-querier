/*
 * Maimai-Alias-Querier -> submit.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */
import fs from 'node:fs';
import { getAliasByIndex, pushAliasByIndex, pushNewAlias } from './aliasData'

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
var submitPath: string = '';

export function updateSubmit() {
    if (!success) {
        throw new Error('submits.json cannot be read/write');
    }
    var submitsStr: string = JSON.stringify(submits);
    fs.writeFileSync(submitPath, submitsStr);
    return;
}
export function initSubmitData(path: string) {
    submitPath = path;
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
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
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
                alias: value.alias,
                exist: value.exist,
                aliasIndex: value.aliasIndex,
                time: value.time
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
    updateSubmit();
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
    return v1 && v2;
}
export function acceptSubmit(index: number) {
    if (index >= submits.length || index < 0) {
        throw new RangeError("Index is out of range");
    } else if (!index.toString().match(/^[0-9]$/)) {
        throw new TypeError("Index must be an integer");
    }
    submits[index].status = 'accepted';
    var submit = submits[index];
        if (submit.exist) {
        pushAliasByIndex(submit.aliasIndex, submit.alias);
    } else {
        pushNewAlias(submit.title, submit.alias);
    }
    updateSubmit();
}
export function rejectSubmit(index: number) {
    if (index >= submits.length || index < 0) {
        throw new RangeError("Index is out of range");
    } else if (!index.toString().match(/^[0-9]$/)) {
        throw new TypeError("Index must be an integer");
    }
    submits[index].status = 'rejected';
    updateSubmit();
}