import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Index from '../views/index';

const router = express.Router();

import { versions } from '../test';
const title = "You Project ReactDoc";

/* GET home page. */
router.get('/', function(req, res, next) {
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Index {...{ title, versions }}/>
    );
    res.send(html);
});

export default router