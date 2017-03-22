import * as React from 'react';
import * as path from 'path';
import Index from '../../client/views/index';


const ReactDOMServer = require('react-dom/server');
const cachePath = path.join(__dirname, '../../.cache');

function homePage(req, res, next) {
    const componentsPath = path.join(cachePath, './components.json');
    const list = require(componentsPath).reactComponents;

    if (list && list.length > 0) {
        res.redirect('/component/0');
    }

    const html = '<!doctype html>' + ReactDOMServer.renderToString(<Index />);

    res.send(html);
};

export default homePage;