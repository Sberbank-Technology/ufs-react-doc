import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';
import * as ts from 'typescript';
import babelTraverse from 'babel-traverse';
import { parse, withDefaultConfig, withCustomConfig } from 'react-docgen-typescript';

const COMPONENT = "COMPONENT";
const FUNCTION = "FUNCTION";

enum SymbolType {
    Function = 16,
    Interface = 64,
    Method = 8192,
    TypeAlias = 524288
}

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
    const pathList = [
        ...['.tsx', '.ts', '/index.ts', '/index.tsx'].map(item => fullPath + item),
        fullPath
    ];

    for (let item of pathList) {
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
    if (functions !== undefined) {
        for (let key of Object.keys(functions)) {
            const func = functions[key];
            func.description = func.description !== undefined ? func.description : "";
            if (isDescriptionOfPrivateElement(func.description)) {
                continue;
            }
            func.description = getTextWithRemovedAnnotations(func.description);
            filteredFunctions.push(func);
        }
    }
    return filteredFunctions;
}

export const getFilteredMethods = (methods) => {
    const filteredMethods = [];
    if (methods !== undefined) {
        for (let key of Object.keys(methods)) {
            const method = methods[key];
            method.description = method.description !== undefined ? method.description : "";
            if (isDescriptionOfPrivateElement(method.description)) {
                continue;
            }
            method.isStatic = isDescriptionOfStaticElement(method.description);
            method.description = getTextWithRemovedAnnotations(method.description);
            filteredMethods.push(method);
        }
    }
    return filteredMethods;
}

export const getFilteredInterfaces = (interfaces) => {
    const filteredInterfaces = [];
    if (interfaces !== undefined) {
        for (let key of Object.keys(interfaces)) {
            const iface = interfaces[key];
            iface.description = iface.description !== undefined ? iface.description : "";
            if (isDescriptionOfPrivateElement(iface.description)) {
                continue;
            }
            iface.description = getTextWithRemovedAnnotations(iface.description);
            filteredInterfaces.push(iface);
        }
    }
    return filteredInterfaces;
}

export const getFilteredTypeAliases = (typeAliases) => {
    const filteredTypeAliases = [];
    if (typeAliases !== undefined) {
        for (let key of Object.keys(typeAliases)) {
            const typeAlias = typeAliases[key];
            typeAlias.description = typeAlias.description !== undefined ? typeAlias.description : "";
            if (isDescriptionOfPrivateElement(typeAlias.description)) {
                continue;
            }
            typeAlias.description = getTextWithRemovedAnnotations(typeAlias.description);
            filteredTypeAliases.push(typeAlias);
        }
    }
    return filteredTypeAliases;
}

// return filtered information about component
export const getComponentInfo = (name, exportComp, comp, interfaces, typeAliases) => {
    let { description } = comp;
    const examples = [];
    let newProps = [];
    let newMethods = [];
    let newFunctions = [];
    let newInterfaces = [];
    let newTypeAliases = [];
    let category = '';
    let preferredName = '';
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

        if (match[1] === 'preferredname') {
            preferredName = match[2].trim();
        }
    }

    newProps = getFilteredProps(comp.props);
    newFunctions = getFilteredFunctions(comp.functions);
    newMethods = getFilteredMethods(comp.methods);
    newInterfaces = getFilteredInterfaces(interfaces);
    newTypeAliases = getFilteredTypeAliases(typeAliases);
    return {
        className: preferredName.length > 0 ? preferredName : name,
        srcPath: exportComp.source,
        description: descriptionWithoutAnnotations,
        examples,
        category,
        props: [...newProps],
        methods: [...newMethods],
        functions: [...newFunctions],
        interfaces: [...newInterfaces],
        isFunction: comp.type === FUNCTION
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

    addToComponentList = (name, exportComp, comp, interfaces = [], typeAliases = []) => {
        if (comp === undefined
            || comp.description === undefined
            || comp.description.length == 0
            || isDescriptionOfPrivateElement(comp.description)) {
            return;
        }
        this.components.push({
            ...getComponentInfo(name, exportComp, comp, interfaces, typeAliases)
        });
    }

    getJsDoc = (symbol) => {
        if (symbol === undefined || symbol.getDocumentationComment === undefined) {
            return "";
        }
        let mainComment = ts.displayPartsToString(symbol.getDocumentationComment());
        let tags = symbol.getJsDocTags() || [];
        let tagComments = tags.map(t => {
            let result = '@' + t.name;
            if (t.text) {
                result += ' ' + t.text;
            }
            return result;
        });
        return (mainComment + '\n' + tagComments.join('\n')).trim();
    };

    getElementsListFromSymbolObjects = (symbolObjects, checker, filterFunction) => {
        let elements = [];
        if (symbolObjects === undefined) {
            return elements;
        }
        symbolObjects.forEach(symbol => {
            if (symbol !== undefined && filterFunction(symbol)) {
                let type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                if (type !== undefined) {
                    let stringSignature = "";
                    type.getCallSignatures().forEach(sig => {
                        stringSignature = checker.signatureToString(sig);
                    });
                    elements.push({
                        name: symbol.name,
                        displaySignature: symbol.name + stringSignature,
                        description: this.getJsDoc(symbol)
                    });
                }
            }
        })
        return elements.filter(element => {
            return element.description && element.description.length > 0;
        });
    };

    getMethodList = (type) => {
        let methods = [];
        if (type === undefined) {
            return methods;
        }
        let symbol = type.getSymbol();
        if (symbol === undefined) {
            return methods;
        }
        methods = [...methods, ...this.getElementsListFromSymbolObjects(symbol.members, type.checker, this.isMethod)];
        methods = [...methods, ...this.getElementsListFromSymbolObjects(symbol.exports, type.checker, this.isMethod)];
        return methods;
    }

    isMethod = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == SymbolType.Method;
        }
    }

    isFunction = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == SymbolType.Function;
        }
    }

    isInterface = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == SymbolType.Interface;
        }
    }

    isTypeAlias = (symbol) => {
        if (symbol === undefined) {
            return false;
        } else {
            return symbol.flags == SymbolType.TypeAlias;
        }
    }

    getComponentMembersInfo = (exp, checker, source) => {
        let type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration);
        let componentName = this.extractComponentName(exp, source);
        let methods = this.getMethodList(type);
        let isFunction = this.isFunction(exp);
        let functions = this.getElementsListFromSymbolObjects([type.getSymbol()], type.checker, this.isFunction);
        return {
            displayName: componentName,
            description: this.getJsDoc(isFunction ? exp : type.getSymbol()),
            type: isFunction ? FUNCTION : COMPONENT,
            functions: functions,
            methods: methods
        }
    }

    getInterfaceInfo = (exp, checker, source) => {
        if (exp === undefined || !this.isInterface(exp)) {
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

    getTypeAliasInfo = (exp, checker, source) => {
        if (exp === undefined || !this.isTypeAlias(exp)) {
            return;
        }
        let typeAliasName = this.extractComponentName(exp, source);
        let declaration = exp.getDeclarations();
        let declarationText = declaration !== undefined && declaration.length > 0 ? declaration[0].getText() : ""
        return {
            name: typeAliasName,
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

    parseTypeAliases = (path: string) => {
        let result = this.parseWithCompilerOptions(this.defaultOptions, path);
        let typeAliases = result.exports.map(exp => {
            return this.getTypeAliasInfo(exp, result.checker, result.sourceFile);
        }).filter(iface => {
            return iface !== undefined && iface.description.length > 0;
        });
        return typeAliases;
    }

    parseFunctions = (path: string) => {
        let result = this.parseWithCompilerOptions(this.defaultOptions, path);
        let components = result.exports.map(exp => {
            return this.getComponentMembersInfo(exp, result.checker, result.sourceFile);
        }).filter(comp => {
            return comp.type == FUNCTION;
        });
        return components;
    }

    parseComponentWithMethods = (path: string) => {
        let result = this.parseWithCompilerOptions(this.defaultOptions, path);
        let components = result.exports.map(exp => {
            return this.getComponentMembersInfo(exp, result.checker, result.sourceFile);
        }).filter(comp => {
            return comp.type == COMPONENT;
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
        if (this.isFunction(exp)) {
            name = name + '()';
        }
        return name;
    };

    getCombinedComponents = (componentsWithProps, componentsWithMethods) => {
        let componentsWithMethodsToMerge = [...componentsWithMethods];
        let combinedComponents = [];
        for (let compIdx in componentsWithProps) {
            let matched = false;
            let compWithMethods = {} as any;
            let compWithProps = componentsWithProps[compIdx];
            for (let i = 0; i < componentsWithMethodsToMerge.length; i++) {
                compWithMethods = componentsWithMethodsToMerge[i];
                if (compWithMethods.displayName === compWithProps.displayName) {
                    matched = true;
                    componentsWithMethodsToMerge.splice(i, 1);
                    break;
                }
            }
            if (matched) {
                compWithProps.methods = compWithMethods.methods !== undefined ? compWithMethods.methods : [];
            }
            combinedComponents.push(compWithProps);
        }
        componentsWithMethodsToMerge.forEach(compWithMethod => {
            let object = {} as any;
            object.displayName = compWithMethod.displayName;
            object.description = compWithMethod.description;
            object.props = {};
            object.methods = compWithMethod.methods !== undefined ? compWithMethod.methods : [];
            combinedComponents.push(object);
        });
        return combinedComponents;
    }

    parse = (configPath?: string) => {
        Object.keys(this.forExport).forEach(name => {
            const exportComp = this.forExport[name];
            const config = configPath ? withCustomConfig(configPath) : withDefaultConfig();
            const componentsWithProps = config.parse(exportComp.source);
            const componentsWithMethods = this.parseComponentWithMethods(exportComp.source);
            const combinedComponents = this.getCombinedComponents(componentsWithProps, componentsWithMethods);
            const functions = this.parseFunctions(exportComp.source);
            const interfaces = this.parseInterfaces(exportComp.source);
            const typeAliases = this.parseTypeAliases(exportComp.source);
            if (exportComp.type === 'ExportNamedDeclaration') {
                for (const comp of combinedComponents) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp, interfaces, typeAliases);
                        break;
                    }
                }
            } else if (exportComp.type === 'ExportDefaultDeclaration') {
                let got = false;
                for (const comp of combinedComponents) {
                    if (comp.displayName === exportComp.imported || comp.displayName === exportComp.local) {
                        this.addToComponentList(name, exportComp, comp, interfaces, typeAliases);
                        got = true;
                        break;
                    }
                }

                if (got === false) {
                    const fileName = path.parse(exportComp.source).name;
                    for (const comp of combinedComponents) {
                        if (fileName === comp.displayName || fileName === comp.displayName) {
                            this.addToComponentList(name, exportComp, comp, interfaces, typeAliases);
                            break;
                        }
                    }
                }
            }
            if (functions !== undefined && functions.length > 0) {
                for (const comp of functions) {
                    if (comp.description !== undefined && comp.description.length > 0) {
                        this.addToComponentList(comp.displayName, exportComp, comp, typeAliases);
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
