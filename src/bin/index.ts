#!/usr/bin/env node

import init from '../scripts/init';
import startServer from '../scripts/start-server';
import createStaticSite from '../scripts/create-static-site';
import exportToJson from '../scripts/export-to-json';

const { argv } = process;

if (argv.indexOf('--init') > 0) {
    init();
} else if (argv.indexOf('--to-static') > 0) {
    createStaticSite(argv[argv.indexOf('--to-static') + 1]);
} else if (argv.indexOf('--to-json') > 0) {
    exportToJson(argv[argv.indexOf('--to-json') + 1]);
} else {
    startServer();
}
