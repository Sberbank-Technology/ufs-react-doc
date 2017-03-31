import * as React from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Tree } from '../createTree';

interface Props {
    tree: Tree;
    step: number;
    keyName: string;
    index: number;
}

export default function Name({ tree, step, keyName, index }: Props) {
    if (!tree.name && !keyName) {
        return null;
    } else if (tree.index === undefined) {
        return (
            <p style={{ marginLeft: step * 10, paddingLeft: 10 }}>
                {tree.name || keyName}
            </p>
        );
    } else {
        const bsStyle = tree.index === index ? 'primary' : 'link';

        return (
            <Link to={`/components/${tree.index}`}>
                <Button bsStyle={bsStyle} block>
                    {tree.name}
                </Button>
            </Link>
        );
    }
}
