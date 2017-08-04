import * as React from 'react';
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
        const pStyle: React.CSSProperties = {
            paddingLeft: step * 15
        }

        return (
            <p style={pStyle}>
                {tree.name || keyName}
            </p>
        );
    } else {
        const pStyle: React.CSSProperties = {
            paddingLeft: step * 15,
        }
        if (tree.index === index) {
            pStyle.backgroundColor = '#dddddd';
        }

        return (
            <Link to={`/components/${tree.index}`}>
                <p className="sidebar_link" style={pStyle}>
                    {tree.name}
                </p>
            </Link>
        );
    }
}
