const config = require('../../.reacttsdoc.config.json') as Config;
import * as path from 'path';
import { getEnvVariable } from './utils';

interface RemoteDoc {
    packageName: string;
    version: string;
    docPath: string;
}

interface Config {
    npmRegistry: string;
    port: number;
    host: string;
    remoteDocs?: RemoteDoc[];
    cacheDir: string;
}

const DEFAULT_CONFIG: Config = {
    npmRegistry: getEnvVariable('NPM_REGISTRY') || 'https://registry.npmjs.org/',
    // remoteDocs: [],
    port: parseInt(getEnvVariable('PORT'), 10) || 3000,
    host: getEnvVariable('HOST') || 'localhost',
    cacheDir: getEnvVariable('CACHE_DIR') || path.join(__dirname, '.cache')
}

export default Object.assign<Config, Config>(DEFAULT_CONFIG, config);