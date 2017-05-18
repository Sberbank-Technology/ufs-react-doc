#!/usr/bin/env node

import startServer from '../scripts/start-server';
import createStaticSite from '../scripts/create-static-site';

if (process.argv.length === 4 && process.argv[2] === '--to-static') {
    createStaticSite(process.argv[3]);
} else {
    startServer();
}
