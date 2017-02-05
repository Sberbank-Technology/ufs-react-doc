import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Version from '../views/version';

const router = express.Router();

const config = require('../../../.reacttsdoc.config.json');
const title = "Version Info";

/* GET home page. */
router.get('/:version', function(req, res, next) {
    const version = req.params.version;
    const list = require('../../../.cache/ufs-ui/' + version + '/components.json').reactComponents;

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Version {...{ title, list, version }} />
    );
    res.send(html);
});

export default router
