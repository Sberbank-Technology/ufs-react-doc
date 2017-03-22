let config;
import * as path from 'path';

try {
    config = require(path.join(process.cwd(), '.reacttsdoc.config.json')) as Config;
} catch (e) {
    config = {};
}

import { getEnvVariable } from './utils';

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
}

const DEFAULT_CONFIG: Config = {
    npmRegistry: getEnvVariable('NPM_REGISTRY') || 'https://registry.npmjs.org/',
    remoteDocs: [],
    srcPath: getEnvVariable('SRC_PATH') || null,
    port: parseInt(getEnvVariable('PORT'), 10) || 3000,
    host: getEnvVariable('HOST') || 'localhost',
    cacheDir: getEnvVariable('CACHE_DIR') || path.join(__dirname, '.cache'),
    projectType: 'javascript'
}

export default Object.assign<Config, Config>(DEFAULT_CONFIG, config);
