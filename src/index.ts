import * as typedoc from 'typedoc';
import * as path from 'path';
import * as generator from './generator';
import * as server from './proxy_server';
import config, { Config } from './config';

server.start().then(function() {
    const cachePath = path.join(__dirname, '../.cache');

    const app = new typedoc.Application({
        module: 'commonjs',
        target: 'es3',
        jsx: 'react',
        includeDeclarations: false,
        experimentalDecorators: true,
        mode: 'modules',
        name: 'my-project',
        ignoreCompilerErrors: true,
        version: true,
        exclude: path.join(__dirname, '../node_modules')
    });

    if (config.srcPath) {
        app.generateJson(
            [
                path.join(process.cwd(), config.srcPath)
            ],
            path.join(cachePath, 'temp.json')
        );

        generator.generateComponentsJson(
            path.join(cachePath, 'temp.json'),
            path.join(cachePath, 'components.json')
        )
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            app.generateJson(
                [
                    path.join(cachePath, packageName, version, 'package/src/index.tsx'),
                ],
                path.join(cachePath, packageName, version, 'temp.json')
            );

            generator.generateComponentsJson(
                path.join(cachePath, packageName, version, 'temp.json'),
                path.join(cachePath, packageName, version, 'components.json')
            );
        });
    }

}).catch((err) => {
    console.error(err);
});

