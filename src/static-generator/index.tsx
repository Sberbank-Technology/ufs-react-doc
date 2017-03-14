import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { ComponentType } from '../components/types';
const ReactDOMServer = require('react-dom/server');

import Index from '../views/index';
import Component from '../views/component';

export function generateStaticDoc(jsonPath: string, dest: string) {

    const list = require(jsonPath + '/components.json')
        .reactComponents as ComponentType[];

    checkDest(dest);
    copyStaticFiles(dest);
    createIndex(list, dest);
    createComponentsPages(list, dest);
}

function checkDest(dest: string): void {
    const destExists = fs.existsSync(dest);
    if (destExists &&
        fs.readdirSync(dest).length > 0) {
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
        path.join(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'),
    ].forEach(function(filename) {
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
        .replace('/public/UFS_logo.png', 'UFS_logo.png')
        .replace(/\/component\/(\d+)/g, 'component_$1.html');
}

function createIndex(components: ComponentType[], dest: string): void {
    let html: string;
    if (components.length === 0) {
        html = '<!doctype html>' +
            replaceAssetsLinks(ReactDOMServer.renderToString(
                <Index />
            ));
    } else {
        html = '<meta http-equiv="refresh" content="0; url=component_0.html">'
    }

    fs.writeFileSync(path.join(dest, 'index.html'), html);
}

function createComponentsPages(components: ComponentType[], dest: string): void {
    components.forEach(function(component, i) {
        const filename = `component_${i}.html`;
        const html = '<!doctype html>' +
            replaceAssetsLinks(ReactDOMServer.renderToString(
                <Component
                    index={i}
                    component={component}
                    list={components}
                    pkgName={null}
                    version={null}
                />
            ));
        fs.writeFileSync(path.join(dest, filename), html);
    });
}


