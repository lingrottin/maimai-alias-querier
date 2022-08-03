/*
 * Maimai-Alias-Querier -> app.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */

import express from 'express';
import bodyParser from 'body-parser';
import { initConfig, getConfig } from './config';
import { getAliases, getAliasesByAlias, initAliasData } from './aliasData';
import ejs from 'ejs';
import { getSubmits, initSubmitData, submitData, validateSubmitPost } from './submit';

const app = express();
app.use(express.json());
app.use(bodyParser());


function startExpress() {
    app.get('/', (req, res) => {
        ejs.renderFile('./layouts/index.ejs').then(value => {
            res.send(value);
        })
    });

    app.post('/query', (req, res) => {
        console.log(req.body);
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
                req.body.exist,
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