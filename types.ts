/*
 * Maimai-Alias-Querier -> types.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */


export type Alias = {
    title: string,
    aliases: string[]
}

export type Submit = {
    status: 'open' | 'rejected' | 'accepted',
    title: string,
    alias: string,
    exist: boolean,
    aliasIndex: number,
    time: string
}

export type reviewStatus = 'accepted' | 'rejected';

export type Config = {
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

/***********************
 * 以下用来给 API 使用 *
 ***********************/
export type Success = { success: boolean }
export type Length = { type: 'submit' | 'alias', length: number }
export type ApiError = { error: string }
export type StringResp = { status:number, resp: string }