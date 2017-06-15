import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import getEnvVariable from './get-env-variable';

export const CONFIG_FILENAME = '.reacttsdoc.config.js';

export const CACHE_DIR_PATH = path.join(__dirname, '../../.cache');

// Create cache directory if not exists
mkdirp.sync(CACHE_DIR_PATH);

export interface RemoteDoc {
    packageName: string;
    version: string;
    docPath: string;
}

export interface Config {
    npmRegistry: string;
    port: number;
    host: string;
    srcPath?: string;
    remoteDocs?: RemoteDoc[];
    cacheDir: string;
    projectType?: 'javascript' | 'typescript';

    webpackLoaders?: any[];
    webpackLoadersDir?: string;
    webpackExtensions?: string[]
}

const DEFAULT_CONFIG: Config = {
    npmRegistry: getEnvVariable('NPM_REGISTRY') || 'https://registry.npmjs.org/',
    remoteDocs: [],
    srcPath: getEnvVariable('SRC_PATH') || null,
    port: parseInt(getEnvVariable('PORT'), 10) || 3000,
    host: getEnvVariable('HOST') || 'localhost',
    cacheDir: getEnvVariable('CACHE_DIR') || path.join(__dirname, '.cache'),
    projectType: 'javascript',

    webpackLoaders: [],
    webpackLoadersDir: path.join(process.cwd(), 'node_modules'),
    webpackExtensions: []
}

let config = {} as Config;
try {
    config = require(path.join(process.cwd(), CONFIG_FILENAME)) as Config;
} catch (e) {
}

export default Object.assign(DEFAULT_CONFIG, config) as Config;
