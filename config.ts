/*
 * Maimai-Alias-Querier -> config.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */
import fs from 'node:fs';
import toml from 'toml';

type Config = {
    Service: {
        listen: string,
        port: number,
        path: string
    },
    Data: {
        path: string,
        submitPath: string,
        reviewToken: string
    }
}

var config: Config = {
    Service: { listen: '127.0.0.1', port: 3000, path: '/' },
    Data: { path: './data.json', submitPath: './submits.json', reviewToken: 'A Little Token' }
} ;
var success: boolean = false;

export function initConfig(): Promise<null> {
    return new Promise((resolve, reject) => {
        var _config: string;
        var configObj;
        try {
            fs.accessSync(__dirname + "/config.toml", fs.constants.R_OK);
        }
        catch (e) {
            reject("Config file is not readable");
        }
        _config = fs.readFileSync(__dirname + '/config.toml', { encoding: 'utf8' });
        try {
            configObj = toml.parse(_config);
            config.Service.listen = configObj.Service.listen;
            config.Service.port = configObj.Service.port;
            config.Service.path = configObj.Service.path
            config.Data.path = configObj.Data.path;
            config.Data.submitPath = configObj.Data.submit_path;
            config.Data.reviewToken = configObj.Data.review_token;
        } catch (e) {
            console.error(e);
            reject(e);
        }
        success = true;
        resolve(null);
    });
}

export function getConfig(): Config {
    if (success) {
        return config;
    }
    else {
        throw new Error("Config file is not loaded");
    }
}