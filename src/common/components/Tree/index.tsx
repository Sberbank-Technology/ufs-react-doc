import * as React from 'react';
import { ComponentType } from '../types';

import createTree from './createTree';
import Leaf from './Leaf';

interface Props {
    list: ComponentType[];
    version: string;
    pkgName: string;
    index: number;
}

export default function Tree(props: Props) {
    const { list, version, pkgName, index } = props;
    const step = -1;

    if (!list || list.length === 0) {
        return null;
    }

    const tree = createTree(list);

    return (
        <Leaf {...{ pkgName, version, index, tree, step }} />
    );
}
