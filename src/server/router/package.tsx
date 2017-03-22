import * as express from 'express';
import * as React from 'react';
import Version from '../../client//views/version';


const ReactDOMServer = require('react-dom/server');
const router = express.Router();

function packagePage(req, res, next) {
    const { name, version } = req.params;
    const title = `${name} package info. Version ${version}`;
    const list = require(`../../.cache/components.json`).reactComponents;
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Version {...{ title, list, version, pkgName: name }} />
    );

    res.send(html);
};

export default packagePage;
