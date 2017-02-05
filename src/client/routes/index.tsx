import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');
import config from '../../server/config';

import Index from '../views/index';

const router = express.Router();

const versions = config.remoteDocs;

/* GET home page. */
router.get('/', function(req, res, next) {
    const title = 'Packages';
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Index {...{ title, versions }}/>
    );
    res.send(html);
});

export default router
