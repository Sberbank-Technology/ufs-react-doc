import * as express from 'express';
import * as React from 'react';
const ReactDOMServer = require('react-dom/server');

import Component from '../views/component';

const router = express.Router();

import { versions, components } from '../test';
const title = "Component Info";
const list = components;

/* GET home page. */
router.get('/:name/:id', function(req, res, next) {
    const version = req.params.name;
    const component = list[req.params.id];

    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ title, list, version, component }} />
    );
    res.send(html);
});

export default router
