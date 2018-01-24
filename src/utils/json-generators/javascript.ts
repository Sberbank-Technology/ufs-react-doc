import * as fs from 'fs';
import * as path from 'path';
import * as Babylon from 'babylon';
import traverse from 'babel-traverse';

import { getType } from './flow-type';
import { isFileExist } from './typescript';

export const getSource = (fullPath: string) => {
    const pathList = [
        ...['.jsx', '.js', '/index.js', '/index.jsx'].map(item => fullPath + item),
        fullPath
    ];

    for (let item of pathList) {
        if (isFileExist(item)) {
            return item;
        }
    }

    return null;
}

export interface Type {
    name?: string;
    type?: string;
    description?: string;
    inheritedFrom?: string;
}

export interface Component {
    srcPath?: string;
    className?: string;
    description?: string;
    type?: 'Class' | 'Function' | 'Interface';
    props?: Type[];
    examples?: string[];
    children?: any[];
    isPrivate?: boolean;
    category?: string;
    extendedTypes?: Object[];
}

export interface FunctionProps {
    name?: string;
    description?: string;
    examples?: string[];
    isPrivate?: boolean;
    category?: string;
}

interface ParentProps {
    [key: string]: { fetched: boolean; parents: string[] };
}

let currFilename: string;
let parsedFilename;

let reactAliases: string[];
let reactComponentAliases: string[];

let namedTypes: { [name: string]: Type[] };
let fileImports: string[];

let components: Component[];
let parsedFiles: string[];
let parentProps: ParentProps;

const parseFile = (filename: string) => {

    currFilename = filename;
    parsedFilename = path.parse(filename);

    fileImports = [];
    reactAliases = [];
    reactComponentAliases = [];
    namedTypes = {};

    traverse(getAST(), nodeVisitor);
    fileImports
        .filter(filename => filename.match(/\.jsx?$/))
        .forEach(parseFile);
}

const getAST = () => {
    try {
        const code = fs.readFileSync(currFilename);
        return Babylon.parse(code.toString(), {
            sourceType: 'module',
            plugins: ['jsx', 'objectRestSpread', 'classProperties', 'flow']
        });
    } catch (e) {
        console.error(`Bad javascript file: ${currFilename}`);
        console.error(e);
        process.exit(1);
    }
}

const functionVisitor = {
    ReturnStatement(path) {
        if (path.node.argument.type === 'JSXElement') {
            addFunction(this);
        }
    }
}

const functionTypesVisitor = {
    TypeAnnotation(path) {
        const id = findComponentIdByName(this.name);
        if (components[id]) {
            const propsType = path.node.typeAnnotation;
            if (propsType && propsType.type === 'ObjectTypeAnnotation') {
                components[id].props = parseObjectTypeAnnotation(propsType);
            } else if (propsType && namedTypes[propsType.id.name]) {
                components[id].props = namedTypes[propsType.id.name];
            }
        }
    }
}

const convertToAbsolutePath = (p: string): string => {
    return path.resolve(path.join(parsedFilename.dir, p));
}

const addFunction = (props: FunctionProps): void => {
    components.push({
        type: 'Function',
        srcPath: currFilename,
        className: props.name,
        description: props.description,
        isPrivate: props.isPrivate,
        props: [],
        category: props.category,
        examples: props.examples.map(convertToAbsolutePath)
    });
}

const parseObjectTypeAnnotation = (node) => {
    let result: Type[] = [];
    for (let p of node.properties) {
        const description = getLeadingCommentBlock(p);

        if (description.indexOf('@private') > -1) {
            continue;
        }

        result.push({
            name: p.key.name,
            description: getLeadingCommentBlock(p),
            type: getType(p.value)
        });
    }
    return result;
}

const nodeVisitor = {

    "DeclareTypeAlias|TypeAlias": path => {
        const name = path.node.id.name;
        if (path.node.right.type === 'ObjectTypeAnnotation') {
            namedTypes[name] = parseObjectTypeAnnotation(path.node.right);
        }
    },

    ImportDeclaration: path => {
        if (isReactImportNode(path.node)) {
            fetchReactAliases(path.node);
        }
    },

    ExpressionStatement: path => {
        if (isPropTypesAssignment(path.node)) {
            fetchPropTypes(path.node);
        }
    },

    ClassDeclaration: path => {
        if (isReactClass(path.node)) {
            const name = path.node.id.name;
            const { comment, tags } = getClassComment(path);
            const isPrivate = tags &&
                tags.filter(tag => tag.tag === 'private').length > 0;

            components.push({
                type: 'Class',
                srcPath: currFilename,
                className: name,
                description: comment,
                props: [],
                isPrivate,
                category: getCategory(tags),
                examples: tags
                    .filter(t => t.tag === 'example')
                    .map(t => t.text)
                    .map(convertToAbsolutePath)
            });

            const classId = findComponentIdByName(name);
            if (path.node.superTypeParameters) {
                const propsType = path.node.superTypeParameters.params[1];
                if (propsType && propsType.type === 'ObjectTypeAnnotation') {
                    components[classId].props = parseObjectTypeAnnotation(propsType);
                } else if (propsType && namedTypes[propsType.id.name]) {
                    components[classId].props = namedTypes[propsType.id.name];
                }
            }
        }
    },

    FunctionDeclaration: path => {
        let name: string;
        let description: string;
        let examples: string[];
        let isPrivate: boolean;
        let category: string;

        if (path.node.id) {
            name = path.node.id.name;
            const { comment, tags } = getClassComment(path);
            description = comment;
            examples = tags.filter(t => t.tag === 'example').map(t => t.text);
            isPrivate = tags.filter(t => t.tag === 'private').length > 0;
            category = getCategory(tags);
        } else {
            name = parsedFilename.name;
            const { comment, tags } = getClassComment(path);
            description = comment;
            examples = tags.filter(t => t.tag === 'example').map(t => t.text);
            isPrivate = tags.filter(t => t.tag === 'private').length > 0;
            category = getCategory(tags);
        }

        path.traverse(functionVisitor, { name, description, examples, isPrivate, category });
        path.traverse(functionTypesVisitor, { name });
    },

    ArrowFunctionExpression: path => {
        if (path.parent.type === 'VariableDeclarator') {
            const name = (path.parent as any).id.name;

            // Fetching comment of a variable declaration
            const { comment, tags } = getClassComment(path.parentPath.parentPath);
            const description = comment;
            const examples = tags.filter(t => t.tag === 'example').map(t => t.text);
            const isPrivate = tags.filter(t => t.tag === 'private').length > 0;
            const category = getCategory(tags);

            if (path.node.expression && path.node.body.type === 'JSXElement') {
                addFunction({
                    name,
                    description,
                    examples,
                    isPrivate,
                    category
                });
            } else {
                path.traverse(functionVisitor, { name, description, examples, isPrivate, category });
            }

            path.traverse(functionTypesVisitor, { name });
        }
    },

    enter: path => {
        if (isImportNode(path.node)) {
            queueFileForParsing(path.node)
        }
    }
}

const isReactImportNode = node => node.source.value === 'react';

const fetchReactAliases = node => {
    node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier' &&
            spec.imported &&
            spec.imported.name === 'Component') {
            reactComponentAliases.push(spec.local.name);
        } else if (spec.type === 'ImportDefaultSpecifier') {
            reactAliases.push(spec.local.name);
        } else if (spec.type === 'ImportNamespaceSpecifier') {
            reactAliases.push(spec.local.name);
        }
    });
}

const isImportNode = node =>
    [
        'ExportAllDeclaration',
        'ImportDeclaration',
        'ExportNamedDeclaration',
        'ExportDefaultDeclaration'
    ].indexOf(node.type) > -1 &&
    node.source &&
    node.source.value;

const queueFileForParsing = node => {
    const p = getSource(path.resolve(path.join(parsedFilename.dir, node.source.value)));

    addFileIfNeeded(p);
    addFileIfNeeded(p + '.js');
    addFileIfNeeded(p + '.jsx');
}

const addFileIfNeeded = f => {
    if (fs.existsSync(f) && parsedFiles.indexOf(f) === -1) {
        fileImports.push(f);
        parsedFiles.push(f);
    };
}

const isPropTypesAssignment = node =>
    node.expression.type === 'AssignmentExpression' &&
    node.expression.operator === '=' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.left.property.name === 'propTypes'

const getLeadingCommentBlock = node =>
    (node.leadingComments && node.leadingComments.length > 0) ?
        node.leadingComments[0].value.trim().replace(/^[\s\*]+/gm, '') :
        '';

const findComponentIdByName = (name: string) =>
    components.findIndex(el => el.className === name)

const fetchPropTypes = node => {
    const className = node.expression.left.object.name;
    const classId = findComponentIdByName(className);
    if (parentProps[className] === undefined) {
        parentProps[className] = {
            parents: [],
            fetched: false
        }
    }

    if (node.expression.right.type === 'MemberExpression') {
        const e = node.expression.right;
        if (e.property.name === 'propTypes') {
            parentProps[className].parents.push(e.object.name);
        }
        return;

    } else if (node.expression.right.type !== 'ObjectExpression') {
        return;
    }

    node.expression.right.properties.forEach(prop => {
        if (prop.type === 'ObjectProperty') {
            const description = getLeadingCommentBlock(prop);
            if (description.indexOf('@private') === -1) {
                components[classId].props.push({
                    name: prop.key.name,
                    type: prop.value.property.name,
                    description
                });
            }
        } else if (prop.type === 'SpreadProperty' && prop.argument.property.name === 'propTypes') {
            parentProps[className].parents.push(prop.argument.object.name);
        }
    });
}

const fetchParentProps = (className): Type[] => {
    if (parentProps[className].fetched) {
        return;
    }

    const id = findComponentIdByName(className);
    parentProps[className].parents.forEach(parentClassName => {
        if (parentProps[parentClassName] && !parentProps[parentClassName].fetched) {
            fetchParentProps(parentClassName);
        }
        const parentId = components.findIndex(el => el.className === parentClassName);
        components[id].props = components[id].props.concat(Object.assign(components[parentId].props, {
            inheritedFrom: parentClassName
        }));
    });
    parentProps[className].fetched = true;
}

const isReactClass = node => {
    if (node.superClass) {
        const s = node.superClass;

        if (s.type === 'Identifier') {
            return reactComponentAliases.indexOf(s.name) > -1;
        } else if (s.type === 'MemberExpression') {
            return reactAliases.indexOf(s.object.name) > -1 &&
                s.property.name === 'Component'
        }
    }
}

const stripTags = (comment: string) => {
    const tagsRegexp = /\@([^\s]+)(.*)$/gim;
    const tags = [];
    let match;

    while ((match = tagsRegexp.exec(comment)) !== null) {
        tags.push({
            tag: match[1],
            text: match[2].trim()
        });
    }

    return {
        stripped: comment.replace(tagsRegexp, '').trim(),
        tags
    }
}

const getClassComment = path => {
    let comment;

    if (['ExportDefaultDeclaration', 'ExportNamedDeclaration'].indexOf(path.parent.type) > -1) {
        comment = getLeadingCommentBlock(path.parent);
    } else {
        comment = getLeadingCommentBlock(path.node);
    }
    const { tags, stripped } = stripTags(comment);

    return { tags, comment: stripped };
}

const getCategory = tags => {
    const firstTag = tags.filter(t => t.tag === 'category')[0];

    return firstTag ? firstTag.text : '';
}

export function generateComponentsJson(srcPath: string): { reactComponents: Component[] } {
    parsedFiles = [];
    components = [];
    parentProps = {};

    parseFile(srcPath);
    Object.keys(parentProps).forEach(fetchParentProps);

    const result = { reactComponents: components }

    return result;
}
