import * as express from 'express';
import * as React from 'react';
import * as path from 'path';

import config from '../config';
import { handleRender } from './renders';

export default app => {

    if (process.env.NODE_ENV === 'dev') {
        app.get('/', (req, res) => {
            res.redirect('/components/0');
        });
        app.get('/components', (req, res) => {
            res.redirect('/components/0');
        });
        app.get('/components/:index', handleRender);
    } else {
        app.get('/', handleRender);
    }

}
