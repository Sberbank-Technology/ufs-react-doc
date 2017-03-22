import * as express from 'express';
import * as React from 'react';
import config from '../config';
import Component from '../../client/views/component';

const ReactDOMServer = require('react-dom/server');

function componentPage(req, res, next) {
    const { name, version, index } = req.params;
    const list = require(`../../../.cache/components.json`).reactComponents;
    const component = list[index];
    const html = '<!doctype html>' + ReactDOMServer.renderToString(
        <Component {...{ list, version, component, pkgName: name, index: parseInt(index) }} />
    );

    res.send(html);
};

export default componentPage;
