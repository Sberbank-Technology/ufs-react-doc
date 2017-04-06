import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import { ComponentType } from '../common/components/types';
import Index from '../common/views/index';
import Component from '../common/views/component';

import fetchRemoteLibs from './fetch-remote-libs';
import buildBundles from './build-bundles';
import generateComponentsJSON from './generate-components-json';

import { handleRender } from '../server/router/renders';
import { CACHE_DIR_PATH } from '../utils/config';

const ReactDOMServer = require('react-dom/server');

export default function(dest: string) {
    Promise.all<any>(fetchRemoteLibs())
        .then(generateComponentsJSON)
        .then(buildBundles)
        .then(() => generateStaticDoc(dest))
        .then(() => process.exit(0))
}

function generateStaticDoc(dest: string) {
    const list = require(CACHE_DIR_PATH + '/components.json')
        .reactComponents as ComponentType[];

    dest = path.join(process.cwd(), dest);
    checkDest(dest);
    copyStaticFiles(dest);
    createIndex(list, dest);
    createComponentsPages(list, dest);
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
    [
        path.join(__dirname, '../../public/favicon.ico'),
        path.join(__dirname, '../../public/UFS_logo.png'),
        path.join(__dirname, '../../public/bundle.js'),
        path.join(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'),
        path.join(__dirname, '../../node_modules/highlight.js/styles/monokai.css'),
    ].forEach(filename => {
        const parsed: path.ParsedPath = path.parse(filename);
        fs.writeFileSync(
            path.join(dest, parsed.base),
            fs.readFileSync(filename)
        );
    });
}

function replaceAssetsLinks(html: string): string {
    return html
        .replace('/bootstrap/css/bootstrap.min.css', 'bootstrap.min.css')
        .replace('/highlight.js/monokai.css', 'monokai.css')
        .replace('/public/bundle.js', 'bundle.js')
        .replace('/public/UFS_logo.png', 'UFS_logo.png')
        .replace(/\/component\/(\d+)/g, 'component_$1.html');
}

function createIndex(components: ComponentType[], dest: string): void {
    let html: string;

    if (components.length === 0) {
        html = '<!doctype html>' +
            replaceAssetsLinks(ReactDOMServer.renderToString(<Index />));
    } else {
        html = '<meta http-equiv="refresh" content="0; url=component_0.html">';
    }

    fs.writeFileSync(path.join(dest, 'index.html'), html);
}

function createComponentsPages(components: ComponentType[], dest: string): void {
    components.forEach((component, i) => {
        const filename = `component_${i}.html`;
        const req = {
            url: `/components/${i}`,
            params: { index: i }
        }
        let html = handleRender(req);
        html = replaceAssetsLinks(html);

        fs.writeFileSync(path.join(dest, filename), html);
    });
}
