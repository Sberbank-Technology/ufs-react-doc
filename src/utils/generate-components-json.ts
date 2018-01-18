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

function generateJson(srcPath: string, setRelativePaths: boolean) {
    let result: { reactComponents: Component[] };

    if (config.projectType === 'typescript') {
        result = genForTs(srcPath);
    } else if (config.projectType === 'javascript') {
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

    return result;
}

export function exportTo(dir: string, json: Object) {
    !fs.existsSync(dir) && fs.mkdirSync(dir);

    const dest = path.join(dir, `./${FILENAME}`);

    fs.writeFileSync(dest, JSON.stringify(json, undefined, 4));

    console.log('JSON was exported to ', dest);
}

export default function(setRelativePaths: boolean, exportPath?: string) {
    const { srcPath } = config;
    const exportDir = exportPath || CACHE_DIR_PATH;

    if (srcPath) {
        const src = path.join(process.cwd(), srcPath);
        const json = generateJson(src, setRelativePaths);
        exportTo(exportDir, json);
    }

    if (config.remoteDocs) {
        config.remoteDocs.forEach(({ packageName, version }) => {
            const srcInExt = config.projectType === 'javascript' ? 'js' : 'tsx';
            const srcInPath = path.join(exportDir, `./${packageName}/${version}/package/src/index.${srcInExt}`);
            const json = generateJson(srcInPath, setRelativePaths);
            exportTo(path.join(exportDir, `./${packageName}/${version}/`), json);
        });
    }
}
