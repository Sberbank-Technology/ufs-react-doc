import * as express from 'express';
import * as React from 'react';
import * as path from 'path';

import config from '../config';
import { handleRender } from './renders';


export default app => {
    app.get('/', (req, res) => {
        res.redirect('/components/0');
    });
    app.get('/components', (req, res) => {
        res.redirect('/components/0');
    });
    app.get('/components/:index', handleRender);
    // app.use(handleRender);
}
