import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import { Tree } from '../createTree';
import Name from './Name';

interface Props {
    tree: Tree;
    step: number;
    keyName?: string;
    index: number;
}

export default function Leaf(props: Props) {
    const { tree, step, keyName, index } = props;
    const keys = Object.keys(tree.subItems);

    return (
        <div>
            <Name {...{ tree, step, keyName, index }} />
            {
                keys.map(key => (
                    <Leaf
                        key={key}
                        step={step + 1}
                        tree={tree.subItems[key]}
                        keyName={key}
                        index={index}
                    />
                ))
            }
        </div>
    );
}