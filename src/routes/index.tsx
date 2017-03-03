import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');
import config from '../config';
import * as path from 'path';

import Index from '../views/index';
import Version from "../views/version";
const cachePath = path.join(__dirname, '../../.cache');

const router = express.Router();

const { remoteDocs, srcPath } = config;

/* GET home page. */
router.get('/', function(req, res, next) {
    const list = require(path.join(cachePath, './components.json')).reactComponents;

    if (list && list.length > 0) {
        res.redirect('/component/0');
    } else {

    }

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
            <Index />
    );
    res.send(html);
});

export default router
