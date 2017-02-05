import * as typedoc from 'typedoc';
import * as path from 'path';
import startServer from './client';
import * as generator from './server/generator';
import * as server from './server';

const reactTsDocConfig = require('../.reacttsdoc.config.json');

startServer();
// server.start().then(function() {
//     const cachePath = path.join(__dirname, '../.cache');

//     const app = new typedoc.Application({
//         module: "commonjs",
//         target: "es3",
//         jsx: "react",
//         includeDeclarations: false,
//         experimentalDecorators: true,
//         mode: "modules",
//         name: "my-project",
//         ignoreCompilerErrors: true,
//         version: true,
//         exclude: path.join(__dirname, '../node_modules')
//     });


//     reactTsDocConfig.remoteDocs.forEach(({ packageName, version }) => {
//         app.generateJson(
//             [
//                 path.join(cachePath, `./${packageName}/${version}/package/src/index.tsx`),
//             ],
//             path.join(cachePath, `./${packageName}/${version}/`, `./temp.json`)
//         );

//         generator.generateComponentsJson(
//             path.join(cachePath, `./${packageName}/${version}/`, `./temp.json`),
//             path.join(cachePath, `./${packageName}/${version}/`, `./components.json`)
//         );
//     });

// });

