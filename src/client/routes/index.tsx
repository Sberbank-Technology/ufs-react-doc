import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Index from '../views/index';

const router = express.Router();

const config = require('../../../.reacttsdoc.config.json');
const title = "You Project ReactDoc";
const versions = config.remoteDocs.map(v => v.version);

/* GET home page. */
router.get('/', function(req, res, next) {
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Index {...{ title, versions }}/>
    );
    res.send(html);
});

export default router
