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
    const title = 'Packages';
    const list = require(path.join(cachePath, './components.json')).reactComponents;

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <div>
            {srcPath && <Version {...{ list }} />}
            {remoteDocs && <Index {...{ title, versions: remoteDocs }}/>}
        </div>
    );
    res.send(html);
});

export default router
