import * as express from 'express';
import * as React from 'react';
import config from '../config';
const ReactDOMServer = require('react-dom/server');

import Component from '../views/component';

const router = express.Router();

/* GET home page. */
router.get('/:index', function(req, res, next) {
    const pkgName = req.params.pkg_name;
    const version = req.params.version;
    const list =
        require(`../../.cache/components.json`)
            .reactComponents;
    const component = list[req.params.index];
    const index = parseInt(req.params.index);

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ list, version, component, pkgName, index }} />
    );
    res.send(html);
});

export default router
