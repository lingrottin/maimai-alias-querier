/*
 * Maimai-Alias-Querier -> api.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */

import { getAliasByIndex, getAliases, getAliasesByAlias, getAliasLength } from './aliasData';
import { getConfig } from './config';
import { getSubmitByIndex, getSubmitLength, getSubmits, acceptSubmit, rejectSubmit } from './submit';
import { ApiError, Length, StringResp, Success } from './types';

const _400: ApiError = { error: 'Bad Request' }
const _404: ApiError = { error: 'Not found' }
const _403: ApiError = { error: 'Forbidden' }
function resp_500(msg: string): StringResp {
    var _err: ApiError = {
        error: msg
    }
    return {
        status: 500,
        resp: JSON.stringify(_err)
    }
}

export function processGetApi(path:string):Promise<StringResp> {
    return new Promise((resolve, reject) => {
        switch (path) {
            case '/api/alias': case '/api/alias/':
                var _return: StringResp = {
                    status: 200,
                    resp: JSON.stringify(getAliases())
                }
                resolve(_return);
                break;
            case '/api/alias/length': case '/api/alias/length/':
                var aliasLen: Length = {
                    type: "alias",
                    length: getAliasLength()
                }
                var _return: StringResp = {
                    status: 200,
                    resp: JSON.stringify(aliasLen)
                }
                resolve(_return);
                break;
            case '/api/submit': case '/api/submit/':
                var _return: StringResp = {
                    status: 200,
                    resp: JSON.stringify(JSON.stringify(getSubmits()))
                }
                resolve(_return);
                break;
            case '/api/submit/length': case '/api/submit/length/':
                var submitLen: Length = {
                    type: 'submit',
                    length: getSubmitLength()
                }
                var _return: StringResp = {
                    status: 200,
                    resp: JSON.stringify(submitLen)
                }
                resolve(_return);
                break;
            default:
                var _return: StringResp = {
                    status: 404,
                    resp: JSON.stringify(_404)
                }
                reject(_return);
        }
    });
}
export function processPostApi(path: string, body: {
    alias?: string,
    index?: number,
    title?: string,
    token?: string
}): Promise<StringResp> {
    return new Promise((resolve, reject) => {
        try {
            switch (path) {
                case '/api/query/alias/alias': case '/api/query/alias/alias/':
                    if (body.alias!=undefined) {
                        var _return: StringResp = {
                            status: 200,
                            resp: JSON.stringify(getAliasesByAlias(body.alias || ''))
                        }
                        resolve(_return);
                    } else {
                        reject({ status: 400, resp: JSON.stringify(_400) });
                    }
                    break;
                case '/api/query/alias/index': case '/api/query/alias/index/':
                    if (body.index!=undefined) {
                        try {
                            var _return: StringResp = {
                                status: 200,
                                resp: JSON.stringify(getAliasByIndex(body.index || -1))
                            }
                            resolve(_return);
                        } catch (e: any) {
                            var err: ApiError = {
                                error: e.toString()
                            }
                            reject({ status: 400, resp: JSON.stringify(err) });
                        }
                    } else {
                        reject({ status: 400, resp: JSON.stringify(_400) });
                    }
                    break;
                case '/api/query/submit/index': case '/api/query/submit/index/':
                    if (body.index!=undefined) {
                        try {
                            var _return: StringResp = {
                                status: 200,
                                resp: JSON.stringify(getSubmitByIndex(body.index))
                            }
                            resolve(_return);
                        } catch (e: any) {
                            var err: ApiError = {
                                error: e.toString()
                            }
                            reject({ status: 400, resp: JSON.stringify(err) });
                        }
                    } else {
                        reject({ status: 400, resp: JSON.stringify(_400) });
                    }
                    break;
                case '/api/review/accept': case '/api/review/accept/':
                    if ((body.index!=undefined) && (body.token!=undefined)) {
                        if (body.token == getConfig().Data.reviewToken) {
                            try {
                                acceptSubmit(body.index||0);
                                var _success: Success = {
                                    success: true
                                    // 如果到现在还没被 catch 那么代码肯定没问题
                                }
                                var _return: StringResp = {
                                    status: 200,
                                    resp: JSON.stringify(_success)
                                }
                                resolve(_return);
                            } catch (e: any) {
                                reject(resp_500(e.toString()));
                            }
                        } else {
                            reject({
                                status: 403,
                                resp: JSON.stringify({
                                    success: false
                                })
                            });
                        }
                    } else {
                        reject({
                            status: 400,
                            resp: JSON.stringify(_400)
                        });
                    }
                    break;
                case '/api/review/reject': case '/api/review/reject/':
                    // ctrl-c ctrl-v 真的是太棒辣
                    if ((body.index!=undefined) && (body.token!=undefined)) {
                        if (body.token == getConfig().Data.reviewToken) {
                            try {
                                rejectSubmit(body.index);
                                var _success: Success = {
                                    success: true
                                }
                                var _return: StringResp = {
                                    status: 200,
                                    resp: JSON.stringify(_success)
                                }
                                resolve(_return);
                            } catch (e: any) {
                                reject(resp_500(e.toString()));
                            }
                        } else {
                            reject({
                                status: 403,
                                resp: JSON.stringify({
                                    success: false
                                })
                            });
                        }
                    } else {
                        reject({
                            status: 400,
                            resp: JSON.stringify(_400)
                        });
                    }
                    break;
                default: 
                    reject({ status: 404, resp: JSON.stringify(_404) });
            }
        } catch {
            reject({ status: 400, resp: JSON.stringify(_400) });
        }
    });
}