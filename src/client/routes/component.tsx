import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Component from '../views/component';

const router = express.Router();

const title = "Component Info";

/* GET home page. */
router.get('/:pkg_name/:version/:index', function(req, res, next) {
    const pkgName = req.params.pkg_name;
    const version = req.params.version;
    const list =
        require(`../../../.cache/${pkgName}/${version}/components.json`)
            .reactComponents;
    const component = list[req.params.index];

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ title, list, version, component, pkgName }} />
    );
    res.send(html);
});

export default router
