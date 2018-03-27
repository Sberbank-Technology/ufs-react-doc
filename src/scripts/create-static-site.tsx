import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

import { ComponentType } from '../common/types';
import { getComponentList } from '../server/router/components';
import { getErrorList } from '../server/router/errors';

import fetchRemoteLibs from './fetch-remote-libs';
import buildBundles from './build-bundles';
import generateComponentsJSON from '../utils/generate-components-json';
import { CACHE_DIR_PATH } from '../utils/config';
import getPackagePath from '../utils/get-package-path';

export default function(outPath: string) {
    outPath = path.resolve(process.cwd(), outPath);
    Promise.all<any>(fetchRemoteLibs())
        .then(() => generateComponentsJSON(true))
        .then(() => buildBundles(false))
        .then(() => copyErrorJson(process.cwd(), CACHE_DIR_PATH))
        .then(() => generateStaticDoc(CACHE_DIR_PATH, outPath))
        .catch(e => console.error(e))
    ;
}

export function copyErrorJson(sourceDir: string, destinationDir: string) {
    const sourceFile = sourceDir + "/ios/ufserror/ufserror-list.json";
    const targetFile = destinationDir + "/errors.json";
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
}

export function generateStaticDoc(jsonPath: string, dest: string) {
    const list = require(jsonPath + '/components.json')
        .reactComponents as ComponentType[];

    checkDest(dest);
    copyStaticFiles(dest);
    createIndex(dest);
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
    const files = glob.sync(path.join(__dirname, '../../public/**/*'));
    files.concat([
        getPackagePath('highlight.js/styles/monokai.css'),
        getPackagePath('bootstrap/dist/css/bootstrap.min.css')
    ]).forEach(filename => {
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

function createIndex(dest: string): void {
    const preloadedState = {
        currentId: 0,
        components: getComponentList(),
        errors: getErrorList()
    };
    const html = `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8" />
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
