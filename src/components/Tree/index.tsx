import * as React from 'react';
import { ComponentType } from '../types';
import {
    Panel
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
        <Panel>
            <p>
                <a href={`/`}>{`<< versions`}</a>
            </p>
            <p>
                <a href={`/version/${pkgName}/${version}`}>{`< version`}</a>
            </p>
            <Leaf
                pkgName={pkgName}
                version={version}
                step={0}
                tree={createTree(list)}
            />
        </Panel>
    );
}