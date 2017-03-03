import * as express from 'express';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as request from 'request';
import * as fs from 'fs';
import { pathExists } from './utils';
import config from './config';
import * as generator from './generator';
import tgz = require('tarball-extract');
import startServer from './server';

const app = express();
const CACHE_DIR_PATH = path.join(__dirname, '../../.cache');

// Create cache directory if not exists
mkdirp.sync(CACHE_DIR_PATH);


function extractTarballDownload(downloadUrl, downloadFile, destination) {
    return new Promise(function(resolve, reject) {
        tgz.extractTarballDownload(downloadUrl, downloadFile, destination, {}, (error, result) => {
            if (error) {
                console.error(`Error during downloading ${downloadUrl}`, error);
                reject(error);
            } else {
                console.info(`${downloadUrl} downloaded successfully`);
                resolve(result);
            }
        });
    });
}

const loadsList = config.remoteDocs.map(remoteDoc => {
    const docDirectory = `${remoteDoc.packageName}/${remoteDoc.version}/`;

    if (!pathExists(docDirectory)) {
        mkdirp.sync(docDirectory);

        const fileName = `${remoteDoc.packageName}-${remoteDoc.version}.tgz`;
        const downloadUrl = `${config.npmRegistry}${remoteDoc.packageName}/-/${fileName}`;
        const downloadFile = path.join(CACHE_DIR_PATH, fileName);
        const destination = path.join(CACHE_DIR_PATH, docDirectory);

        return extractTarballDownload(downloadUrl, downloadFile, destination);
    }

    return Promise.resolve();
});


export function start() {
    return Promise.all<any>(loadsList).then(startServer);
}


