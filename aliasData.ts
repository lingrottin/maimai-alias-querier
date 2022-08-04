/*
 * Maimai-Alias-Querier -> aliasData.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */
import fs from 'node:fs';

export type Alias = {
    title: string,
    aliases: string[]
}

var aliasPath: string;
var aliases: Alias[] = [];
var success: boolean = false;

function updateAlias() {
    if (!success) {
        throw new Error('data.json cannot be read/write');
    }
    var submitsStr: string = JSON.stringify(aliases);
    fs.writeFileSync(aliasPath, submitsStr);
    return;
}
export function initAliasData(path: string) {
    aliasPath = path;
    try {
        var _data:string = fs.readFileSync(path, { encoding: 'utf8' });
        var data = JSON.parse(_data);
        data.forEach(function (value: { title: any; aliases: any; }) {
            aliases.push({ title: value.title, aliases: value.aliases });
        });
    } catch (e) {
        console.error(e);
    }
    success = true;
    return;
}

export function getAliasesByAlias(alias: string): Alias[] {
    if (!success) {
        return [{
            title: "Internal Server Error",
            aliases: []
        }];
    }
    var _aliases: Alias[] = [];
    aliases.forEach(value => {
        value.aliases.forEach(_value => {
            if (_value.toLowerCase() == alias.toLowerCase()) {
                _aliases.push(value);
            }
        });
    });
    return _aliases;
}

export function getAliasByIndex(index: number): Alias {
    if (!index.toString().match(/^[0-9]*$/)) {
        throw new TypeError("Only accepts positive integers");
    }
    if (index >= aliases.length) {
        throw new TypeError("There aren't so many aliases.");
    }
    return aliases[index];
}
export function getAliases(): Alias[] {
    return aliases;
}
export function pushAliasByIndex(index: number, alias: string) {
    if (!index.toString().match(/^[0-9]*$/)) {
        throw new TypeError("Only accepts positive integers");
    }
    if (index >= aliases.length) {
        throw new TypeError("There aren't so many aliases.");
    }
    aliases[index].aliases.push(alias);
    updateAlias();
}
export function pushNewAlias(title: string, alias: string) {
    if (!title.trim() || !alias.trim()) {
        // 如果为空
        throw new TypeError("Cannot be empty");
    }
    var newAlias: Alias = {
        title: title,
        aliases: [alias]
    }
    aliases.push(newAlias);
    updateAlias();
}