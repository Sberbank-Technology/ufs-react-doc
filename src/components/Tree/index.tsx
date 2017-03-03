import * as React from 'react';
import { ComponentType } from '../types';
import {
    Nav
} from 'react-bootstrap';

import createTree from './createTree';
import Leaf from './Leaf';

interface Props {
    list: ComponentType[];
    version: string;
    pkgName: string;
}

export default function Tree(props: Props) {
    const { list, version, pkgName } = props;

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Nav bsStyle="pills" stacked>
            <Leaf
                pkgName={pkgName}
                version={version}
                step={0}
                tree={createTree(list)}
            />
        </Nav>
    );
}