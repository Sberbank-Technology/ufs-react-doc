import * as fs from 'fs';
import * as path from 'path';

import { ComponentType } from '../common/types';
import { getComponentList } from '../server/router/components';

import fetchRemoteLibs from './fetch-remote-libs';
import buildBundles from './build-bundles';
import generateComponentsJSON from '../utils/generate-components-json';
import { CACHE_DIR_PATH } from '../utils/config';

export default function(outPath: string) {
    outPath = path.resolve(process.cwd(), outPath);
    Promise.all<any>(fetchRemoteLibs())
        .then(() => generateComponentsJSON(true))
        .then(() => buildBundles(false))
        .then(() => generateStaticDoc(CACHE_DIR_PATH, outPath))
        .catch(e => console.error(e))
    ;
}

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
        path.join(__dirname, '../../public/favicon.ico'),
        path.join(__dirname, '../../public/UFS_logo.png'),
        path.join(__dirname, '../../public/styles.css'),
        path.join(__dirname, '../../public/bundle.js'),
        path.join(__dirname, '../../node_modules/highlight.js/styles/monokai.css'),
        path.join(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'),
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
            <link rel="stylesheet" type="text/css" href="monokai.css" />
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
