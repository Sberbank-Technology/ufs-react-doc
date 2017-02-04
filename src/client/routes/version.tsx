import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Version from '../views/version';

const router = express.Router();

import { versions, components } from '../test';
const title = "Version Info";
const list = components;

/* GET home page. */
router.get('/:name', function(req, res, next) {
    const version = req.params.name;

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Version {...{ title, list, version }} />
    );
    res.send(html);
});

export default router
