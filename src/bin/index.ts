#!/usr/bin/env node

import init from '../scripts/init';
import startServer from '../scripts/start-server';
import createStaticSite from '../scripts/create-static-site';


if (process.argv.indexOf('--init') > 0) {
    init();
} else if (process.argv.indexOf('--to-static') > 0) {
    createStaticSite(process.argv[3]);
} else {
    startServer();
}
