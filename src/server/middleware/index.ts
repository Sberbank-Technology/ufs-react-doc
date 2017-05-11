import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';


export default app => {
    const bootstrapDir = path.join(__dirname, '../../../node_modules/bootstrap/dist/');

    // uncomment after placing your favicon in /public
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/bootstrap', express.static(bootstrapDir));
    app.use('/public', express.static(path.join(__dirname, '../../../public')));
}
