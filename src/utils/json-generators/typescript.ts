import * as path from 'path';
import * as fs from 'fs';

import { Component } from './javascript';

function getComments(node): string {
    let comment: string = '';

    if (node.comment) {
        if (node.comment.shortText) {
            comment = node.comment.shortText;
        }
    }

    return comment;
}

function getExamples(srcPath: string, node): string[] {
    if (node.comment && node.comment.tags) {
        const parsedPath = path.parse(srcPath);
        return node.comment.tags
            .filter(tag => tag.tag === 'example')
            .map(tag => path.resolve(path.join(parsedPath.dir, tag.text)))
    }
    return [];
}

function getCategory(srcPath: string, node): string {
    if (node.comment && node.comment.tags) {
        const firstTag = node.comment.tags
            .filter(tag => tag.tag === 'category')[0]
        return firstTag ? firstTag.text : '';
    }
    return '';
}

function getNodeParams(srcPath, node): Component {
    let description = getComments(node);
    return {
        srcPath,
        className: node.name,
        description: getComments(node),
        type: node.kindString,
        children: node.children,
        examples: getExamples(srcPath, node),
        category: getCategory(srcPath, node),
        isPrivate: node && node.flags && node.flags.isPrivate,
        extendedTypes: node.extendedTypes
    }
}

function getClassPropsType(classNode): any {
    let children = classNode.children;
    let constructorMethod = children ? children.find(item => item.name === 'constructor') : null;

    if (constructorMethod) {
        const c = constructorMethod.signatures[0].parameters[0];
        if (c.type) {
            return c.type;
        }
    }

    if (classNode.extendedTypes) {
        const c = classNode.extendedTypes.find(item => item.name === 'PureComponent');
        if (c && c.typeArguments && c.typeArguments[0].name === "Props") {
            return c.typeArguments[0];
        }
    }

    return {};
}


export interface Prop {
    type: string;
    name?: string;
    types?: Prop[];
}

function getPropType(prop: Prop) {
    if (prop.type === 'union') {
        return prop.types.map(getPropType).join(' | ');
    }
    return prop.name;
}

export function generateComponentsJson(inJsonPath: string): { reactComponents: Component[] } {
    const docInJson = JSON.parse(fs.readFileSync(inJsonPath, 'utf-8'));
    const docOutJson = {
        reactComponents: []
    };
    const interfaceMap = {};
    const classMap = {};

    docInJson.children.forEach(file => {
        const srcPath = file.originalName;

        if (srcPath.split('.').pop() !== 'tsx') {
            return;
        }

        if (file.children) {
            file.children.forEach(node => {
                const nodeParams = getNodeParams(srcPath, node);

                if (nodeParams.type === 'Interface') {
                    interfaceMap[nodeParams.className] = nodeParams;
                } else if (nodeParams.type === 'Class') {
                    classMap[nodeParams.className] = nodeParams;
                }
            });
        }

        const classDataArray = Object.keys(classMap).map(name => {
            const classData = classMap[name];
            const propsType = getClassPropsType(classData);
            const newClass = classData;
            delete classData.extendedTypes;
            if (interfaceMap[propsType.name]) {

                if (propsType.type == 'instrinct') {
                    newClass.props = { type: propsType.name };
                } else if (propsType.type == 'reference' &&
                    interfaceMap[propsType.name].children) {

                    newClass.props = interfaceMap[propsType.name].children
                        .filter(prop => !(prop.flags && prop.flags.isPrivate))
                        .map(prop => {
                            const inheritedFrom = prop.inheritedFrom ?
                                prop.inheritedFrom.name.split('.')[0] :
                                undefined;
                            return {
                                name: prop.name,
                                type: getPropType(prop.type),
                                description: getComments(prop),
                                inheritedFrom: inheritedFrom
                            };
                        })
                }
            }
            delete newClass.children;

            return newClass;
        });

        docOutJson.reactComponents = classDataArray;

    });

    return docOutJson;
}
