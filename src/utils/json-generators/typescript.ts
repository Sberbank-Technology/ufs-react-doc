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

export const isDescriptionOfPrivateElement = (description: string) => {
    return description !== undefined && description.indexOf('@private') > -1;
}

export const isDescriptionOfStaticElement = (description: string) => {
    return description !== undefined && description.indexOf('@static') > -1;
}

export const getTextWithRemovedAnnotations = (text: string) => {
    return text.replace(tagsRegexp, '').trim();
}

export const getFilteredProps = (props) => {
    const filteredProps = [];
    if (props !== undefined) {
        for (let prop of Object.keys(props)) {
            const oldProp = props[prop];
            const newProp = {
                name: prop,
                description: oldProp.description,
                type: oldProp.type.name,
                required: oldProp.required
            };

            if (isDescriptionOfPrivateElement(oldProp.description)) {
                continue;
            }

            filteredProps.push(newProp);
        }
    }
    return filteredProps;
}

export const getFilteredFunctions = (functions) => {
    const filteredFunctions = [];
    for (let func of Object.keys(functions)) {
        const newFunc = functions[func];
        newFunc.description = newFunc.description !== undefined ? newFunc.description : "";
        if (isDescriptionOfPrivateElement(newFunc.description)) {
            continue;
        }
        newFunc.isStatic = isDescriptionOfStaticElement(newFunc.description);
        newFunc.description = getTextWithRemovedAnnotations(newFunc.description);
        filteredFunctions.push(newFunc);
    }
    return filteredFunctions;
}

export const getFilteredInterfaces = (interfaces) => {
    const filteredInterfaces = [];
    for (let iface of Object.keys(interfaces)) {
        const newInterface = interfaces[iface];
        newInterface.description = newInterface.description !== undefined ? newInterface.description : "";
        if (isDescriptionOfPrivateElement(newInterface.description)) {
            continue;
        }
        newInterface.description = getTextWithRemovedAnnotations(newInterface.description);
        filteredInterfaces.push(newInterface);
    }
    return filteredInterfaces;
}

// return filtered information about component
export const getComponentInfo = (exportComp, comp, interfaces) => {
    let { description } = comp;
    const examples = [];
    let newProps = [];
    let newFunctions = [];
    let newInterfaces = [];
    let category = '';
    let match;

    const spaceRegExp = /^[\s\*]+/gm;
    const descriptionWithoutSpaces = description.trim().replace(spaceRegExp, '');
    const descriptionWithoutAnnotations = getTextWithRemovedAnnotations(description);
    while ((match = tagsRegexp.exec(descriptionWithoutSpaces)) !== null) {
        if (match[1] === 'example') {
            const { dir } = path.parse(exportComp.source);
            examples.push(path.join(dir, match[2].trim()));
        }

        if (match[1] === 'category') {
            category = match[2].trim();
        }
    }

    newProps = getFilteredProps(comp.props);
    newFunctions = getFilteredFunctions(comp.functions);
    newInterfaces = getFilteredInterfaces(interfaces);

    return {
        srcPath: exportComp.source,
        description: descriptionWithoutAnnotations,
        examples,
        category,
        props: [...newProps],
        functions: [...newFunctions],
        interfaces: [...newInterfaces],
        isStandaloneFunction: comp.isStandaloneFunction !== undefined ? comp.isStandaloneFunction : false 
    };
}

export class Generator {
    forExport = {};
    fileList: string[] = [];
    rootPath: any;
    components: any[] = [];

    defaultOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
    };

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

    addToComponentList = (name, exportComp, comp, interfaces = []) => {
        this.components.push({
            className: name,
            ...getComponentInfo(exportComp, comp, interfaces)
        });
    }

    getJsDoc = (symbol) => {
        if (symbol === undefined || symbol.getDocumentationComment === undefined) {
            return "";
        }
        let mainComment = ts.displayPartsToString(symbol.getDocumentationComment());
        let tags = symbol.getJsDocTags() || [];
        let tagComments = tags.map(function (t) {
            let result = '@' + t.name;
            if (t.text) {
                result += ' ' + t.text;
            }
            return result;
        });
        return (mainComment + '\n' + tagComments.join('\n')).trim();
    };

    getFunctionListFromSymbolObjects = (symbolObjects, checker) => {
        let functions = [];
        if (symbolObjects === undefined) {
            return functions;
        }
        symbolObjects.forEach(mem => {
            if (mem !== undefined) {
                let type = checker.getTypeOfSymbolAtLocation(mem, mem.valueDeclaration);
                if (type !== undefined) {
                    let stringSignature = "";
                    type.getCallSignatures().forEach(sig => {
                        stringSignature = checker.signatureToString(sig);
                    });
                    functions.push({
                        name: mem.name,
                        displaySignature: mem.name + stringSignature,
                        description: this.getJsDoc(mem)
                    });
                }
            }
        })
        return functions.filter(func => {
            return func.displaySignature !== 'prototype' && func.description && func.description.length > 0;
        });
    };

    getFunctionList = (type) => {
        let functions = [];
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

    isComponentStandaloneFunction = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == 16;
        }
    }

    isComponentInterface = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == 64;
        }
    }

    getComponentFunctionInfo = (exp, checker, source) => {
        let type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration);
        let componentName = this.extractComponentName(exp, source);
        let functions = this.getFunctionList(type);
        let isComponentStandaloneFunction = this.isComponentStandaloneFunction(exp);
        let standaloneFunctions = this.getFunctionListFromSymbolObjects([type.getSymbol()], type.checker);
        return {
            displayName: componentName,
            description: this.getJsDoc(isComponentStandaloneFunction ? exp : type.getSymbol()),
            isStandaloneFunction: isComponentStandaloneFunction,
            functions: isComponentStandaloneFunction ? standaloneFunctions : functions
        }
    }

    getInterfaceInfo = (exp, checker, source) => {
        if (exp === undefined || !this.isComponentInterface(exp)) {
            return;
        }
        let interfaceName = this.extractComponentName(exp, source);
        let declaration = exp.getDeclarations();
        let declarationText = declaration !== undefined && declaration.length > 0 ? declaration[0].getText() : ""
        return {
            name: interfaceName,
            description: this.getJsDoc(exp),
            declaration: declarationText
        }
    }

    parseWithCompilerOptions = (compilerOptions, filePath) => {
        let program = ts.createProgram([filePath], compilerOptions);
        let checker = program.getTypeChecker();
        let sourceFile = program.getSourceFile(filePath);
        let moduleSymbol = checker.getSymbolAtLocation(sourceFile);
        let exports = checker.getExportsOfModule(moduleSymbol);
        return {
            exports,
            checker,
            sourceFile
        };
    }

    parseInterfaces = (path: string) => {
        let result = this.parseWithCompilerOptions(this.defaultOptions, path);
        let interfaces = result.exports.map(exp => {
            return this.getInterfaceInfo(exp, result.checker, result.sourceFile);
        }).filter(iface => {
            return iface !== undefined && iface.description.length > 0;
        });
        return interfaces;
    }

    parseFunctions = (path: string, isStandalone: boolean) => {
        let result = this.parseWithCompilerOptions(this.defaultOptions, path);
        let components = result.exports.map(exp => {
            return this.getComponentFunctionInfo(exp, result.checker, result.sourceFile);
        }).filter(comp => {
            return comp.isStandaloneFunction == isStandalone;
        });
        return components;
    }

    extractComponentName = (exp, source) => {
        let exportName = exp.getName();
        let name = "";
        if (exportName === 'default') {
            name = path.basename(source.fileName, path.extname(source.fileName));
        } else {
            name = exportName;
        }
        if (this.isComponentStandaloneFunction(exp)) {
            name = name + '()';
        }
        return name;
    };

    getComponentsWithFunctions = (components, functions) => {
        let functionsToMerge = [...functions];
        let componentsWithFunctions = [];
        for (let compIdx in components) {
            let matched = false;
            let func = {} as any;
            let comp = components[compIdx];
            for (let i = 0; i < functionsToMerge.length; i++) {
                func = functionsToMerge[i];
                if (func.displayName === comp.displayName) {
                    matched = true;
                    functionsToMerge.splice(i, 1);
                    break;
                }
            }
            if (matched) {
                comp.functions = func.functions !== undefined ? func.functions : [];
            }
            componentsWithFunctions.push(comp);
        }
        //These are standalone functions which are exported outside a class
        functionsToMerge.forEach(func => {
            let object = {} as any;
            object.displayName = func.displayName;
            object.description = func.description;
            object.props = {};
            object.functions = func.functions !== undefined ? func.functions : [];
            componentsWithFunctions.push(object);
        });
        return componentsWithFunctions;
    }

    parse = (configPath?: string) => {
        Object.keys(this.forExport).forEach(name => {
            const exportComp = this.forExport[name];
            const config = configPath ? withCustomConfig(configPath) : withDefaultConfig();
            const components = config.parse(exportComp.source);
            const functions = this.parseFunctions(exportComp.source, false);
            const componentsWithFunctions = this.getComponentsWithFunctions(components, functions);
            const standaloneFunctions = this.parseFunctions(exportComp.source, true);
            const interfaces = this.parseInterfaces(exportComp.source);
            if (exportComp.type === 'ExportNamedDeclaration') {
                for (const comp of componentsWithFunctions) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp, interfaces);
                        break;
                    }
                }
            } else if (exportComp.type === 'ExportDefaultDeclaration') {
                let got = false;
                for (const comp of componentsWithFunctions) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp, interfaces);
                        got = true;
                        break;
                    }
                }

                if (got === false) {
                    const fileName = path.parse(exportComp.source).name;
                    for (const comp of componentsWithFunctions) {
                        if (fileName === comp.displayName || fileName === comp.displayName) {
                            this.addToComponentList(name, exportComp, comp, interfaces);
                            break;
                        }
                    }
                }
            }
            if (standaloneFunctions !== undefined && standaloneFunctions.length > 0) {
                for (const comp of standaloneFunctions) {
                    if (comp.description !== undefined && comp.description.length > 0) {
                        this.addToComponentList(comp.displayName, exportComp, comp);
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
