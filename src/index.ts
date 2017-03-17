import * as typedoc from 'typedoc';
import * as path from 'path';
import * as generator from './generator';
import * as server from './proxy_server';
import config, { Config } from './config';
import * as JsGenerator from './js-generator/index';
import * as StaticGenerator from './static-generator/index';

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
    if (config.projectType === 'javascript') {
        JsGenerator.generateComponentsJson(srcInPath, srcOutPath);
    } else if (config.projectType === 'typescript') {
        const tmpPath = path.join(srcOutDir, './temp.json');
        app.generateJson([ srcInPath ], tmpPath);
        generator.generateComponentsJson(tmpPath, srcOutPath);
    }
}

if (process.argv.length === 4 &&
    process.argv[2] === '--to-static' &&
    config.srcPath) {

    const inPath = path.join(process.cwd(), config.srcPath);
    const outPath = path.join(process.cwd(), process.argv[3]);
    generateJson(inPath, cachePath);
    StaticGenerator.generateStaticDoc(cachePath, outPath);
    process.exit(0);
}

server.start().then(function() {

    if (config.srcPath) {
        generateJson(
            path.join(process.cwd(), config.srcPath),
            cachePath
        );
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            const srcInExt = config.projectType === 'javascript' ? 'js' : 'tsx';
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

