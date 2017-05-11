import * as React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import createStore from '../../redux/configureStore';
import Layout from '../../common/Layout';
import { getComponentList } from './components';


export function handleRender(req, res) {
    const index = req.params.index ? parseInt(req.params.index, 10) : 0;
    const preloadedState = {
        currentId: index,
        components: getComponentList()
    };
    const store = createStore(preloadedState);
    const context = {};
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Layout {...preloadedState} />
            </StaticRouter>
        </Provider>
    );
    if (context['url']) {
        res.redirect(302, context['url']);
    } else {
        res.send(renderFullPage(html, preloadedState));
    }
    res.end();
}


export function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
        <head>
            <title>UFS React Doc</title>
            <link rel="icon" href="/public/favicon.ico">
            <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" />
            <link rel="stylesheet" type="text/css" href="../public/styles.css" />
        </head>
        <body>
            <div id="root">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="/public/bundle.js"></script>
        </body>
        </html>
    `;
}
