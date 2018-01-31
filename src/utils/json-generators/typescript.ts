import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';
import * as ts from 'typescript';
import babelTraverse from 'babel-traverse';
import { parse, withDefaultConfig, withCustomConfig } from 'react-docgen-typescript';

export const PARSER_CONFIG = {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'classProperties', 'objectRestSpread']
} as babylon.BabylonOptions;

export const tagsRegexp = /\@([^\s]+)(.*)$/gim;

export const getAST = (entryPath) => {
    return babylon.parse(fs.readFileSync(entryPath, 'utf8'), PARSER_CONFIG);
};

export const isImportNode = (node) => {
    const list = ['ImportDeclaration'];

    if (list.indexOf(node.type) > -1 && node.source && node.source.value) {
        return true;
    } else {
        return false;
    }
}

export const isExportNode = (node) => {
    const list = ['ExportAllDeclaration', 'ExportNamedDeclaration', 'ExportDefaultDeclaration'];

    return list.indexOf(node.type) > -1 ? true : false;
}

export const isReExportNode = (node) => {
    const isExport = ['Program'].indexOf(node.type) > -1;

    if (
        isExport && node.sourceType === 'module' &&
        node.body && node.body[0].source !== null && node.body[0].type === 'ExportNamedDeclaration'
    ) {
        return true;
    }

    return false;
}

export interface ImportNameProps {
    local: string;
    imported?: string;
    source: string;
}

export interface ExportNameProps {
    local: string;
    default?: boolean;
    type: string;
}

export const getImportNames = (node) => {
    let names: { [id: string]: ImportNameProps } = {};

    if (node.specifiers && node.specifiers.length > 0) {
        node.specifiers.forEach(specifier => {
            names[specifier.local.name] = {
                local: specifier.local.name,
                imported: specifier.imported && specifier.imported.name,
                source: node.source.value
            };
        });
    }

    return names;
}

export const getExportNames = (node) => {
    let names: { [id: string]: ExportNameProps } = {};
    const { declaration } = node;

    if (declaration === null || declaration === undefined) {
        if (node.specifiers && node.specifiers.length > 0) {
            node.specifiers.forEach(specifier => {
                names[specifier.exported.name as string] = {
                    local: specifier.local.name as string,
                    type: node.type
                };
            });
        }
    } else if (declaration.id && declaration.id.name) {
        names[declaration.id.name as string] = {
            local: declaration.id.name,
            type: node.type
        };
    } else if (declaration.name) {
        names[declaration.name as string] = {
            local: declaration.name,
            type: node.type
        };
    }

    return names;
}

export const isFileExist = (fPath: string) => {
    return (fs.existsSync(fPath) && fs.lstatSync(fPath).isFile()) ? true : false;
}

export const getSource = (fullPath: string) => {
    const pathAdders = [
        ...['.tsx', '.ts', '/index.ts', '/index.tsx'].map(adder => fullPath + adder),
        fullPath
    ];

    for (let item of pathAdders) {
        if (isFileExist(item)) {
            return item;
        }
    }

    return null;
}

// walks through AST and return information about exported and imported components
export const traverse = (filePath) => {
    let forExport = {};
    let forImport = {};
    const ast = getAST(filePath);

    babelTraverse(ast, {
        enter: (path) => {
            const { node } = path;

            if (isReExportNode(node) && node['body'].length > 0) {
                node['body'].forEach((reExportNode) => {
                    forExport = {
                        ...forExport, ...getExportNames(reExportNode)
                    };

                    forImport = {
                        ...forImport, ...getImportNames(reExportNode)
                    };
                });
            }

            if (isExportNode(node)) {
                forExport = { ...forExport, ...getExportNames(node) };
            } else if (isImportNode(node)) {
                forImport = { ...forImport, ...getImportNames(node) };
            }
        }
    });
    return { forExport, forImport };
}

// return filtered information about component
export const getComponentInfo = (exportComp, comp) => {
    let { description } = comp;
    const examples = [];
    const newProps = [];
    let category = '';
    let match;

    description = description.trim().replace(/^[\s\*]+/gm, '');

    while ((match = tagsRegexp.exec(description)) !== null) {
        if (match[1] === 'example') {
            const { dir } = path.parse(exportComp.source);
            examples.push(path.join(dir, match[2].trim()));
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
        srcPath: exportComp.source,
        description: description.replace(tagsRegexp, '').trim(),
        examples,
        category,
        props: [...newProps]
    };
}


export class Generator {
    forExport = {};
    fileList: string[] = [];
    rootPath: any;
    components: any[] = [];

    constructor(entryPath) {
        this.rootPath = path.parse(entryPath);
        this.forExport = this.getFileList(entryPath);
        this.setRealPaths(this.forExport);
    }

    /** returns initial components with their file paths */
    getFileList = (filePath: string) => {
        const fileMap = {};
        const { forImport, forExport } = traverse(filePath);

        Object.keys(forExport).forEach(exportName => {
            const { source, imported } = forImport[forExport[exportName].local];
            const fullPath = path.resolve(path.join(this.rootPath.dir, source))
            const sourcePath = getSource(fullPath);

            if (sourcePath !== null) {
                fileMap[exportName] = {
                    ...forExport[exportName],
                    imported,
                    source: sourcePath
                };
            }
        });

        return fileMap;
    }

    setRealPaths = (forExport) => {
        Object.keys(forExport).forEach(name => {
            const importName = forExport[name].imported || forExport[name].local;
            this.findRecursively(name, importName, forExport[name].source);
        });
    }

    /** recursively find component by name */
    findRecursively = (exportName, soughtName, src) => {
        const { forExport, forImport } = traverse(src);

        // if imports and exports has finding name, then go to finding import path 
        if (forImport[soughtName] !== undefined && forExport[soughtName] !== undefined) {
            const baseDir = path.parse(src).dir;
            const nextPath = path.resolve(baseDir, forImport[soughtName].source);
            this.findRecursively(exportName, soughtName, getSource(nextPath));
        }

        // if exports has finding name but imports not, then save current path 
        else if (forImport[soughtName] === undefined && forExport[soughtName] !== undefined) {
            this.forExport[exportName].source = src;

            if (forExport[soughtName].type === 'ExportDefaultDeclaration') {
                this.forExport[exportName].type = 'ExportDefaultDeclaration';
            }
        }

        // if exports and imprort hasn't finding name, then save default exporting component
        else if (forImport[soughtName] === undefined && forExport[soughtName] === undefined) {
            this.forExport[exportName].source = src;

            Object.keys(forExport).some(name => {
                if (forExport[name].type === 'ExportDefaultDeclaration') {
                    this.forExport[exportName].local = name;
                    this.forExport[exportName].imported = name;
                    this.forExport[exportName].type = 'ExportDefaultDeclaration';

                    return true;
                }
                return false;
            });
        }
    }

    addToComponentList = (name, exportComp, comp) => {
        this.components.push({
            className: name,
            ...getComponentInfo(exportComp, comp)
        });
    }
    //Added by DSmirnov
    defaultOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
    };

    getJsDoc = (symbol) => {
        var docObjects = [];
        var comment = "";
        if (symbol !== undefined && symbol.getDocumentationComment !== undefined) {
            docObjects = symbol.getDocumentationComment();
        }
        for (let idx in docObjects) {
            let doc = docObjects[idx];
            if (doc.hasOwnProperty('text')) {
                comment = comment + doc['text'];
            }
        }
        return comment;
    };

    getFunctionListFromSymbolObjects = (symbolObjects, checker) => {
        var functions = [];
        if (symbolObjects === undefined) {
            return functions;
        }
        symbolObjects.forEach(mem => {
            var symbol = checker.getTypeOfSymbolAtLocation(mem, mem.valueDeclaration);
            if (symbol !== undefined) {
                var stringSignature = "";
                symbol.getCallSignatures().forEach(sig => {
                    stringSignature = checker.signatureToString(sig);
                });
                functions.push({
                    displayedSignature: mem.name + stringSignature,
                    description: this.getJsDoc(mem)
                });
            }
        })
        return functions.filter(func => { return func.displayedSignature !== 'prototype' });
    };

    getFunctionList = (type) => {
        var functions = [];
        if (type === undefined) {
            return functions;
        }
        let symbol = type.getSymbol();
        if (symbol === undefined) {
            return functions;
        }
        functions = [...functions, ...this.getFunctionListFromSymbolObjects(symbol.members, type.checker)];
        functions = [...functions, ...this.getFunctionListFromSymbolObjects(symbol.exports, type.checker)];
        return functions;
    }

    getComponentFunctionInfo = (exp, checker, source) => {
        var type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration);
        var componentName = this.extractComponentName(exp, source);
        var functions = this.getFunctionList(type);
        return {
            displayedName: componentName,
            description: this.getJsDoc(type.getSymbol()),
            functions
        }
    }

    withCompilerOptions = (compilerOptions) => {
        let self = this;
        return {
            parse: function (filePath) {
                var program = ts.createProgram([filePath], compilerOptions);
                var checker = program.getTypeChecker();
                var sourceFile = program.getSourceFile(filePath);
                var moduleSymbol = checker.getSymbolAtLocation(sourceFile);
                var exports = checker.getExportsOfModule(moduleSymbol);
                var components = exports.map(exp => {
                    return self.getComponentFunctionInfo(exp, checker, sourceFile);
                });
                return components;
            }
        };
    }

    parseFunctions = (path: string) => {
        let parser = this.withCompilerOptions(this.defaultOptions);
        return parser.parse(path);
    }

    extractComponentName = (exp, source) => {
        var exportName = exp.getName();
        if (exportName === 'default') {
            return path.basename(source.fileName, path.extname(source.fileName));
        } else {
            return exportName;
        }
    }
    //
    parse = (configPath?: string) => {
        Object.keys(this.forExport).forEach(name => {
            const exportComp = this.forExport[name];
            const config = configPath ? withCustomConfig(configPath) : withDefaultConfig();
            const components = config.parse(exportComp.source);
            const functions = this.parseFunctions(exportComp.source);
            if (exportComp.type === 'ExportNamedDeclaration') {
                for (const comp of components) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp);
                        break;
                    }
                }
            } else if (exportComp.type === 'ExportDefaultDeclaration') {
                let got = false;
                for (const comp of components) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp);
                        got = true;
                        break;
                    }
                }

                if (got === false) {
                    const fileName = path.parse(exportComp.source).name;
                    for (const comp of components) {
                        if (fileName === comp.displayName || fileName === comp.displayName) {
                            this.addToComponentList(name, exportComp, comp);
                            break;
                        }
                    }
                }
            }

        });

        return this.components;
    }
}

export function generateComponentsJson(inJsonPath: string) {
    const gen = new Generator(inJsonPath);
    const reactComponents = gen.parse();

    return { reactComponents };
}
