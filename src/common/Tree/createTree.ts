import { ComponentType } from '../types';

export interface TreeItems {
    [name: string]: Tree
}

export interface Tree {
    name?: string;
    index?: number;
    subItems: TreeItems;
}

export default function(components: ComponentType[]): Tree {
    let tree: Tree = {
        subItems: {}
    };

    components.forEach((component, index) => {
        let subTree = tree.subItems;
        const category = component.category.trim();

        if (category.length > 0) {
            const path = category.split('/').map(s => s.trim());
            path.forEach(part => {
                if (!subTree[part]) {
                    subTree[part] = {
                        subItems: {}
                    };
                }

                subTree = subTree[part].subItems;
            });
        }


        subTree[component.className] = {
            index,
            name: component.className,
            subItems: {}
        };
    });

    return tree;
}
