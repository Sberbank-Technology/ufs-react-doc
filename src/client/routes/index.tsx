import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Index from '../views/index';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Index title="ReactDoc Title" name="man" />
    );
    res.send(html);
});

export default router
