import * as typedoc from 'typedoc';
import * as path from 'path';
// import startServer from './client';
import * as generator from './server/generator';
import * as server from './server';

// startServer();
server.start().then(function() {
    const cachePath = path.join(__dirname, '../.cache');
    const jsonPath = path.join(cachePath, './ufs-ui/4.11.3/typedoc.json');

    const app = new typedoc.Application({
        module: "commonjs",
        target: "es3",
        jsx: "react",
        includeDeclarations: false,
        experimentalDecorators: true,

        json: jsonPath,
        mode: "modules",

        name: "my-project",
        ignoreCompilerErrors: true,
        version: true,
        exclude: path.join(__dirname, '../node_modules')
    });

    app.generateJson(
        [
            // path.join(cachePath, './ufs-ui/4.11.3/package/typings/index.d.ts'),
            path.join(cachePath, './ufs-ui/4.11.3/package/src/index.tsx'),
        ],
        path.join(cachePath, './ufs-ui/4.11.3/', './temp.json')
    );

    generator.generateComponentsJson(
        path.join(cachePath, './ufs-ui/4.11.3/', './temp.json'),
        path.join(cachePath, './ufs-ui/4.11.3/', './components.json')
    );
});

