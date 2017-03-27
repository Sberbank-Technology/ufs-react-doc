import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import { Tree } from '../createTree';
import Name from './Name';

interface Props {
    tree: Tree;
    step: number;
    version: string;
    pkgName: string;
    keyName?: string;
    index: number;
}

export default function Leaf(props: Props) {
    const { tree, step, version, pkgName, keyName, index } = props;
    const keys = Object.keys(tree.subItems);

    return (
        <div>
            <Name {...{ tree, step, keyName, index }} />
            {
                keys.map(key => (
                    <Leaf
                        pkgName={pkgName}
                        key={key}
                        version={version}
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