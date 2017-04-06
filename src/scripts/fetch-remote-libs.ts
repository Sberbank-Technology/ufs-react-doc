import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import tgz = require('tarball-extract');

import config, { CACHE_DIR_PATH } from '../utils/config';

function extractTarballDownload(url: string, file: string, dest: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        tgz.extractTarballDownload(url, file, dest, {}, (error, result) => {
            if (error) {
                console.error(`Error during downloading ${url}`, error);
                reject(error);
            } else {
                console.info(`${url} downloaded successfully`);
                resolve(result);
            }
        });
    });
}

export default function(): Promise<any>[] {
    return config.remoteDocs.map(remoteDoc => {
        const dir = `${remoteDoc.packageName}/${remoteDoc.version}/`;
        const destination = path.join(CACHE_DIR_PATH, dir);

        if (!fs.existsSync(destination)) {
            mkdirp.sync(destination);

            const fileName = `${remoteDoc.packageName}-${remoteDoc.version}.tgz`;
            const downloadUrl = `${config.npmRegistry}${remoteDoc.packageName}/-/${fileName}`;
            const downloadFile = path.join(CACHE_DIR_PATH, fileName);

            return extractTarballDownload(downloadUrl, downloadFile, destination);
        }

        return Promise.resolve();
    });
}
