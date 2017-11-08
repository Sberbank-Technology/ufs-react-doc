import * as path from 'path';
import * as fs from 'fs';
import config, { CACHE_DIR_PATH } from '../utils/config';
import { generateComponentsJson as genForJs, Component } from '../utils/json-generators/javascript';
import { generateComponentsJson as genForTs } from '../utils/json-generators/typescript';

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

function generateJson(srcPath: string, destDir: string, setRelativePaths: boolean) {
    const dest = path.join(destDir, `./${FILENAME}`);
    let result: { reactComponents: Component[] };

    if (config.projectType === 'typescript') {
        result = genForTs(srcPath);

    } else if (config.projectType === 'javascript') {
        !fs.existsSync(CACHE_DIR_PATH) && fs.mkdirSync(CACHE_DIR_PATH);
        result = genForJs(srcPath);
    }

    if (setRelativePaths) {
        const relativeTo = path.join(__dirname, '../common/Components/Examples')
        result.reactComponents.forEach((component, i) => {
            const srcPath = result.reactComponents[i].srcPath;
            result.reactComponents[i].srcPath = path.relative(relativeTo, srcPath);
            result.reactComponents[i].examples.forEach((examplePath, j) => {
                result.reactComponents[i].examples[j] = path.relative(relativeTo, examplePath);
            });
        });
    }

    fs.writeFileSync(dest, JSON.stringify(result, undefined, 4));
}

export default function(setRelativePaths: boolean) {
    if (config.srcPath) {
        generateJson(
            path.join(process.cwd(), config.srcPath),
            CACHE_DIR_PATH,
            setRelativePaths
        );
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            const srcInExt = config.projectType === 'javascript' ? 'js' : 'tsx';
            const srcInPath = path.join(CACHE_DIR_PATH, `./${packageName}/${version}/package/src/index.${srcInExt}`);
            generateJson(
                srcInPath,
                path.join(CACHE_DIR_PATH, `./${packageName}/${version}/`),
                setRelativePaths
            );
        });
    }
}
