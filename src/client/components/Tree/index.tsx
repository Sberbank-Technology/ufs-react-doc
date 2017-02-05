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
}

export default function Tree(props: Props) {
    const { list, version } = props;

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Panel>
            <p>
                <a href={`/`}>{`<< versions`}</a>
            </p>
            <p>
                <a href={`/version/${version}`}>{`< version`}</a>
            </p>
            <Leaf
                version={version}
                step={0}
                tree={createTree(list)}
            />
        </Panel>
    );
}