import * as express from 'express';
import * as React from 'react';
import * as path from 'path';

import config from '../config';

import homePage from './home';
import componentPage from './component';
import packagePage from './package';


export default app => {
    app.get('/', homePage);
    app.get('/component/:index', componentPage);
    app.get('/package/:name/version/:version', packagePage);
}
