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

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Leaf
            pkgName={pkgName}
            version={version}
            step={-1}
            tree={createTree(list)}
            index={index}
        />
    );
}