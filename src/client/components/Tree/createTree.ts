import { ComponentType } from '../types';

export interface TreeItems {
    [name: string]: Tree
}

export interface Tree {
    name?: string;
    index?: number;
    subItems: TreeItems;
}

interface TempTreeItem {
    name: string;
    path: string[];
    index: number;
}

const createTree = (components: ComponentType[]): Tree => {
    let paths: string[][] = [];

    const createTempItems = createPaths(paths);
    const cleanTempItems = cleanPath(paths);

    return buildTree(components
        .map(createTempItems)
        .map(cleanTempItems)
    );
}

const createPaths = (paths: string[][]) =>
    (component: ComponentType, index: number): TempTreeItem => {
        let pathArray = component.srcPath.split('/');

        pathArray.pop();

        paths.push(pathArray);

        return {
            name: component.className,
            path: pathArray,
            index
        };
    }

const cleanPath = (paths: string[][]) => {
    let length: number;

    return (component: TempTreeItem, index: number): TempTreeItem => {
        if (index === 0) {
            length = getCommonPathLength(paths);
        }

        return {
            name: component.name,
            path: component.path.slice(length, component.path.length),
            index
        };
    }
}

const getCommonPathLength = (paths: string[][]): number => {
    let commonPath = paths[0];
    let commonPathLength = commonPath.length;

    for(let i = 1; i < paths.length; i++) {
        commonPathLength = findCommonBetweenTwoPath(commonPath, paths[i]);
        commonPath = paths[i].slice(0, commonPathLength);
    }

    return commonPathLength;
}

const findCommonBetweenTwoPath = (path1: string[], path2: string[]): number => {
    const length = Math.min(path1.length, path2.length);
    let i = 0;

    while(path1[i] === path2[i]) {
        i++;
    }

    return i;
}

const buildTree = (components: TempTreeItem[]): Tree => {
    let tree: Tree = {
        subItems: {}
    };

    components.forEach(component => {
        let subTree = tree.subItems;
        let item = tree;

        component.path.forEach(part => {
            if (!subTree[part]) {
                subTree[part] = {
                    subItems: {}
                };
            }

            item = subTree[part];
            subTree = subTree[part].subItems;
        });

        item.index = component.index;
        item.name = component.name;
    });

    return tree;
}

export default createTree