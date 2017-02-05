import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Version from '../views/version';

const router = express.Router();

/* GET home page. */
router.get('/:pkg_name/:version', function(req, res, next) {
    const pkgName = req.params.pkg_name;
    const version = req.params.version;
    const title = `${pkgName} package info. Version ${version}`;
    const list =
        require(`../../../.cache/${pkgName}/${version}/components.json`)
            .reactComponents;

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Version {...{ title, list, version, pkgName }} />
    );
    res.send(html);
});

export default router
