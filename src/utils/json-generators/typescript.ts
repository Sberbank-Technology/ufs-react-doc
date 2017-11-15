import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import { parse, withDefaultConfig, withCustomConfig } from 'react-docgen-typescript';

const PARSER_CONFIG = {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
} as babylon.BabylonOptions;
const tagsRegexp = /\@([^\s]+)(.*)$/gim;

const getAST = (code: any) => babylon.parse(code, PARSER_CONFIG);

const isImportNode = (node) => {
    return [
        'ExportAllDeclaration', 'ImportDeclaration',
        'ExportNamedDeclaration', 'ExportDefaultDeclaration'
    ].indexOf(node.type) > -1 && node.source && node.source.value;
}

class Generator {
    fileList: string[] = [];
    components: any[] = [];
    ast: any;
    parsedFilePath: any;

    constructor(entryPath) {
        this.parsedFilePath = path.parse(entryPath);
        this.ast = getAST(fs.readFileSync(entryPath, 'utf8'));

        this.setFileList(this.ast);
    }

    setFileList = (ast) => {
        traverse(ast, {
            enter: (path) => {
                if (isImportNode(path.node)) {
                    this.addToParsingList(path.node);
                }
            }
        });
    }

    addToParsingList = (node) => {
        const fullPath = path.resolve(path.join(this.parsedFilePath.dir, node.source.value));

        this.addFileIfNeeded(fullPath);
        this.addFileIfNeeded(fullPath + '.ts');
        this.addFileIfNeeded(fullPath + '.tsx');
        this.addFileIfNeeded(fullPath + '/index.ts');
        this.addFileIfNeeded(fullPath + '/index.tsx');
    }

    addFileIfNeeded = (fPath: string) => {
        if (fs.existsSync(fPath) && this.fileList.indexOf(fPath) === -1 && fs.lstatSync(fPath).isFile()) {
            this.fileList.push(fPath);
        }
    }

    handleFile = (comp, src) => {
        let { description } = comp;
        const examples = [];
        const newProps = [];
        let category = '';
        let match;
        let className = comp.displayName;

        if (className === 'index') {
            className = src.replace(/\/?index\.tsx?/, '').split('/').pop();
        }

        description = description.trim().replace(/^[\s\*]+/gm, '');
        
        while ((match = tagsRegexp.exec(description)) !== null) {
            if (match[1] === 'example') {
                const { dir } = path.parse(src);
                examples.push(path.resolve(dir, match[2].trim()));
            }

            if (match[1] === 'category') {
                category = match[2].trim();
            }
        }

        for (let prop of Object.keys(comp.props)) {
            const oldProp = comp.props[prop];
            const newProp = {
                name: prop,
                description: oldProp.description,
                type: oldProp.type.name,
                required: oldProp.required
            };

            if (oldProp.description.indexOf('@private') > -1) {
                continue;
            }

            newProps.push(newProp);
        }

        return {
            srcPath: src,
            className,
            description: description.replace(tagsRegexp, '').trim(),
            examples,
            category,
            props: [...newProps]
        };
    }

    parse = () => {
        this.fileList.forEach(src => {
            const components = withCustomConfig('./tsconfig.json').parse(src)
                .map(comp => this.handleFile(comp, src));
            this.components.push(...components);
        });

        return this.components;
    }
}

export function generateComponentsJson(inJsonPath: string) {
    const gen = new Generator(inJsonPath);
    const reactComponents = gen.parse();

    return { reactComponents };
}
