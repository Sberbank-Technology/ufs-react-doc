import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import * as WebpackHotMiddleware from 'webpack-hot-middleware';
import WebpackConfig from '../../utils/create-webpack-config';

export default app => {
    const bootstrapDir = path.join(__dirname, '../../../node_modules/bootstrap/dist/');
    const highlightJsDir = path.join(__dirname, '../../../node_modules/highlight.js/styles/');

    // uncomment after placing your favicon in /public
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    const webpackCompiler = webpack(WebpackConfig(true));
    app.use(WebpackDevMiddleware(webpackCompiler, {
        publicPath: WebpackConfig(true).output.publicPath,
        stats: { color: true }
    }));

    app.use(WebpackHotMiddleware(webpackCompiler, {
        log: console.log
    }));

    app.use('/bootstrap', express.static(bootstrapDir));
    app.use('/highlight.js', express.static(highlightJsDir));
    app.use('/public', express.static(path.join(__dirname, '../../../public')));
}
