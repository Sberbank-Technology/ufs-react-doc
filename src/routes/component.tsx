import * as express from 'express';
import * as React from 'react';
import config from '../config';
const ReactDOMServer = require('react-dom/server');

import Component from '../views/component';

const router = express.Router();

const title = "Component Info";

/* GET home page. */
router.get('/component/:index', function(req, res, next) {
    const pkgName = req.params.pkg_name;
    const version = req.params.version;
    console.log('Component', req.params);
    const list =
        require(`../../.cache/components.json`)
            .reactComponents;
    const component = list[req.params.index];

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ title, list, version, component, pkgName }} />
    );
    res.send(html);
});

export default router
