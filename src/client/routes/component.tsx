import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Component from '../views/component';

const router = express.Router();

const config = require('../../../.reacttsdoc.config.json');
const title = "Component Info";

/* GET home page. */
router.get('/:version/:index', function(req, res, next) {
    const version = req.params.version;
    const list = require('../../../.cache/ufs-ui/' + version + '/components.json');
    const component = list[req.params.index];

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ title, list, version, component }} />
    );
    res.send(html);
});

export default router
