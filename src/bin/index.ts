#!/usr/bin/env node

import init from '../scripts/init';
import startServer from '../scripts/start-server';
import createStaticSite from '../scripts/create-static-site';

if (process.argv.length === 3 && process.argv[2] === '--init') {
    init();
} else if (process.argv.length === 4 && process.argv[2] === '--to-static') {
    createStaticSite(process.argv[3]);
} else {
    startServer();
}
