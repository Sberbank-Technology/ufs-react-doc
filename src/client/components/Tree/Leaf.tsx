import * as React from 'react';

import { Tree } from './createTree';

interface Props {
    tree: Tree;
    step: number;
    version: string;
}

export default function Leaf(props: Props) {
    const { tree, step, version } = props;

    const keys = tree.subItems ? Object.keys(tree.subItems) : [];

    return (
        <p style={{ paddingLeft: step * 10 }}>
            {
                tree.index === undefined
                ? tree.name
                : (
                    <a href={`/version/component/${version}/${tree.index}`}>
                        {tree.name}
                    </a>
                )
            }
            {
                keys.map(key => (
                    <Leaf
                        key={key}
                        version={version}
                        step={step + 1}
                        tree={tree.subItems[key]}
                    />
                ))
            }
        </p>
    );
}