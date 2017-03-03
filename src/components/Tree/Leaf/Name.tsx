import * as React from 'react';
import {
    Nav, NavItem
} from 'react-bootstrap';

import { Tree } from '../createTree';

interface Props {
    tree: Tree;
    step: number;
    keyName: string;
    index: number;
}

export default function Name({ tree, step, keyName, index }: Props) {
    console.log(tree.index, index);

    if (!tree.name && !keyName) {
        return null;
    } else if (tree.index === undefined) {
        return (
            <p style={{ marginLeft: step * 10, paddingLeft: 10 }}>
                {tree.name || keyName}
            </p>
        );
    } else {
        return (
            <Nav
                bsStyle="pills"
                stacked
                activeKey={tree.index === index ? 1 : 0}
            >
                <NavItem
                    eventKey={1}
                    style={{ marginLeft: step * 10 }}
                    href={`/component/${tree.index}`}
                >
                    {tree.name}
                </NavItem>
            </Nav>
        );
    }
}