import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { ComponentType } from '../../common/types';
import Index from '../../common/views/index';
import Component from '../../common/views/component';

import createStore from '../../redux/configureStore';
import Layout from '../../common/Layout';
import { getComponentList } from '../router/components';


const ReactDOMServer = require('react-dom/server');

export function generateStaticDoc(jsonPath: string, dest: string) {
    const list = require(jsonPath + '/components.json')
        .reactComponents as ComponentType[];

    checkDest(dest);
    copyStaticFiles(dest);
    createIndex(list, dest);
}

function checkDest(dest: string): void {
    const destExists = fs.existsSync(dest);

    if (destExists && fs.readdirSync(dest).length > 0) {
        console.error('Provided directory is not empty');
        process.exit(1);
    }

    if (!destExists) {
        fs.mkdirSync(dest);
    }

    try {
        fs.accessSync(dest, fs['W_OK']);
    } catch (e) {
        console.error('Not enough permissions to write into specified dir');
        process.exit(1);
    }
}

function copyStaticFiles(dest: string): void {
    !fs.existsSync(dest + '/public') && fs.mkdirSync(dest + '/public');
    [
        path.join(__dirname, '../../../public/favicon.ico'),
        path.join(__dirname, '../../../public/UFS_logo.png'),
        path.join(__dirname, '../../../public/styles.css'),
        path.join(__dirname, '../../../public/bundle.js'),
        path.join(__dirname, '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'),
    ].forEach(filename => {
        let newDest = dest;

        if (filename.includes('UFS_logo.png')) {
            newDest = dest + '/public';
        }

        const parsed: path.ParsedPath = path.parse(filename);
        fs.writeFileSync(
            path.join(newDest, parsed.base),
            fs.readFileSync(filename)
        );
    });
}

function replaceAssetsLinks(html: string): string {
    return html
        .replace('/bootstrap/css/bootstrap.min.css', 'bootstrap.min.css')
        .replace('/public/UFS_logo.png', 'UFS_logo.png')
        .replace(/\/components\/(\d+)/g, 'component_$1.html');
}

function createIndex(components: ComponentType[], dest: string): void {
    const preloadedState = {
        currentId: 0,
        components: getComponentList()
    };
    const html = `
        <!doctype html>
        <html>
        <head>
            <title>UFS React Doc</title>
            <link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
            <link rel="stylesheet" type="text/css" href="styles.css" />
        </head>
        <body>
            <div id="root"></div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="bundle.js"></script>
        </body>
        </html>
    `;

    fs.writeFileSync(path.join(dest, 'index.html'), html);
}
