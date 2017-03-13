import * as typedoc from 'typedoc';
import * as path from 'path';
import * as generator from './generator';
import * as server from './proxy_server';
import config, { Config } from './config';
import * as es6Generator from './es6-generator/index';


server.start().then(function() {
    const cachePath = path.join(__dirname, '../.cache');

    const app = new typedoc.Application({
        module: "commonjs",
        target: "es3",
        jsx: "react",
        includeDeclarations: false,
        experimentalDecorators: true,
        mode: "modules",
        name: "my-project",
        ignoreCompilerErrors: true,
        version: true,
        exclude: path.join(__dirname, '../node_modules')
    });

    const generateJson = (srcInPath: string, srcOutDir: string) => {
        const srcOutPath = path.join(srcOutDir, './components.json');
        if (config.es6) {
            es6Generator.generateComponentsJson(srcInPath, srcOutPath);
        } else {
            const tmpPath = path.join(srcOutDir, './temp.json');
            app.generateJson([ srcInPath ], tmpPath);
            generator.generateComponentsJson(tmpPath, srcOutPath);
        }
    }

    if (config.srcPath) {
        generateJson(
            path.join(process.cwd(), config.srcPath),
            cachePath
        );
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            const srcInExt = config.es6 ? 'js' : 'tsx';
            const srcInPath = path.join(cachePath, `./${packageName}/${version}/package/src/index.${srcInExt}`);
            generateJson(
                srcInPath,
                path.join(cachePath, `./${packageName}/${version}/`)
            );
        });
    }

}).catch((err) => {
    console.error(err);
});

