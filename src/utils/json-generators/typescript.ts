import * as path from 'path';
import * as fs from 'fs';

interface NodeParams {
    srcPath: string;
    className: string;
    description: string;
    type: string;
    children: Object;
    examples: string[];
}

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

function getNodeParams(srcPath, node): NodeParams {
    let description = getComments(node);
    return {
        srcPath,
        className: node.name,
        description: getComments(node),
        type: node.kindString,
        children: node.children,
        examples: getExamples(srcPath, node)
    }
}

function getClassPropsType(classNode): any {
    let children = classNode.children;
    let constructorMethod = children ? children.find(item => item.name === 'constructor') : null;
    if (constructorMethod) {
        return constructorMethod.signatures[0].parameters[0];
    }

    return {};
}

export function generateComponentsJson(inJsonPath: string, outJsonPath: string) {
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
            if (propsType.type && interfaceMap[propsType.type.name]) {
                if (propsType.type.type == 'instrinct') {
                    newClass.props = { type: propsType.type.name };
                } else if (propsType.type.type == 'reference') {
                    newClass.props = interfaceMap[propsType.type.name].children.map(prop => {
                        return {
                            name: prop.name,
                            type: prop.type.name,
                            description: getComments(prop)
                        };
                    });
                }

            }
            delete newClass.children;

            return newClass;
        });

        docOutJson.reactComponents = classDataArray;

    });

    fs.writeFileSync(outJsonPath, JSON.stringify(docOutJson, null, 4));
}
