import * as path from 'path';
import * as typedoc from 'typedoc';
import * as fs from 'fs';

import config, { CACHE_DIR_PATH } from '../utils/config';

import { generateComponentsJson as genForJs } from '../utils/json-generators/javascript';
import { generateComponentsJson as genForTs } from '../utils/json-generators/typescript';

export const TMP_FILENAME = 'tmp.json';
export const FILENAME = 'components.json';

const TsConfig = {
    module: "commonjs",
    target: "es5",
    jsx: "react",
    includeDeclarations: false,
    experimentalDecorators: true,
    mode: "modules",
    name: "ufs-react-doc",
    ignoreCompilerErrors: true,
    version: true,
    exclude: path.join(__dirname, '../../node_modules')
}

function generateJson(srcPath: string, destDir: string) {
    const dest = path.join(destDir, `./${FILENAME}`);

    if (config.projectType === 'typescript') {
        const app = new typedoc.Application(TsConfig);
        const tmpPath = path.join(destDir, `./${TMP_FILENAME}`);

        app.generateJson([ srcPath ], tmpPath);
        genForTs(tmpPath, dest);

    } else if (config.projectType === 'javascript') {
        genForJs(srcPath, dest);
    }
}

export default function() {
    if (config.srcPath) {
        generateJson(
            path.join(process.cwd(), config.srcPath),
            CACHE_DIR_PATH
        );
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            const srcInExt = config.projectType === 'javascript' ? 'js' : 'tsx';
            const srcInPath = path.join(CACHE_DIR_PATH, `./${packageName}/${version}/package/src/index.${srcInExt}`);
            generateJson(
                srcInPath,
                path.join(CACHE_DIR_PATH, `./${packageName}/${version}/`)
            );
        });
    }
}
