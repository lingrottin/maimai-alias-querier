/*
 * Maimai-Alias-Querier -> app.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */

import express from 'express';
require('express-async-errors');
import ejs from 'ejs';
import { initConfig, getConfig } from './config';
import { getAliases, getAliasesByAlias, initAliasData } from './aliasData';
import { getSubmits, initSubmitData, submitData, validateSubmitPost } from './submit';
import { validateReviewPost,reviewSubmit } from './review';
import { ApiError } from './types';
import { processGetApi, processPostApi } from './api';

const app = express();

function startExpress() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

   
    app.get('/', (req, res) => {
        ejs.renderFile('./layouts/index.ejs').then(value => {
            res.send(value);
        })
    });

    app.post('/query', (req, res) => {
        ejs.renderFile('./layouts/query.ejs', {
            queryAlias: req.body.queryAlias,
            aliases: getAliasesByAlias(req.body.queryAlias)
        }).then(value => {
            res.send(value);
        })
    })

    app.get('/submit', (req, res) => {
        ejs.renderFile('./layouts/submit.ejs', {
            data: getSubmits(),
            aliases: getAliases(),
            post: false
        }).then(value => {
            res.send(value);
        })
    })

    app.post('/submit', (req, res) => {
        var success = validateSubmitPost(req.body);
        if (success) {
            submitData(
                req.body.title||req.body.title_e,
                req.body.alias,
                (req.body.exist!='on'),
                req.body.index
            );
        }
        ejs.renderFile('./layouts/submit.ejs', {
            data: getSubmits(),
            aliases: getAliases(),
            post: true,
            success: success
        }).then(value => {
            res.send(value);
        })
    })

    app.get('/review', (req, res) => {
        ejs.renderFile('./layouts/review.ejs', {
            data: getSubmits(),
            post: false
        }).then(value => {
            res.send(value);
        })
    })
    app.post('/review', (req, res) => {
        var success = (req.body.token == getConfig().Data.reviewToken) && validateReviewPost(req.body);
        if (success) {
            try {
                reviewSubmit(req.body.accept, req.body.index);
            } catch (e) {
                console.log(e);
                success = false;
            }
        }
        ejs.renderFile('./layouts/review.ejs', {
            data: getSubmits(),
            success: success,
            post: true
        }).then(value => {
            res
                .status(404)
                .send(value);
        })
    })

    app.get('/api/*', (req, res) => {
        processGetApi(req.path).then(value => {
            res
                .status(value.status)
                .send(value.resp);
        }, value => {
            res
                .status(value.status)
                .send(value.resp);
        })
    })
    app.post('/api/*', (req, res) => {
        processPostApi(req.path, req.body).then(value => {
            res
                .status(value.status)
                .send(value.resp);
        }, value => {
            res
                .status(value.status)
                .send(value.resp);
        })
    })
    app.get('*', (req, res) => {
        ejs.renderFile('./layouts/error.ejs', {
            error: `404 Not Found`
        }).then(value => {
            res.send(value);
        });
    })

    app.use((err: Error,req: { path: string; },res: { status: (arg0: number) => void; json: (arg0: { error: any; }) => void; send: (arg0: string) => void; },next: (arg0: any) => void) => {
        if (req.path.match(/^\/api/)) {
            res.status(500);
            var responseErr: ApiError = { error: err.toString() }
            res.json(responseErr);
        }
        else {
            res.status(500);
            ejs.renderFile('./layouts/error.ejs', {
                error: err.toString()
            }).then(value => {
                res.send(value);
            });
        }
        next(err);
    });

    app.listen(getConfig().Service.port, getConfig().Service.listen, () => {
    });


}

initConfig().then(function(){
    initAliasData(getConfig().Data.path);
    initSubmitData(getConfig().Data.submitPath);
    startExpress();
}, reject => {
    console.error(reject);
    return;
});