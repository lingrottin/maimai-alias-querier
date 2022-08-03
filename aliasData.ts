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

var aliases: Alias[] = [];
var success: boolean = false;

export function initAliasData(path:string) {
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
            title: "·þÎñÆ÷´íÎó",
            aliases: []
        }];
    }
    var _aliases: Alias[] = [];
    aliases.forEach(value => {
        value.aliases.forEach(_value => {
            if (_value == alias) {
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
