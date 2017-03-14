import * as React from 'react';
import { markdownToHtml } from '../../utils';

import { ComponentType } from '../types';
import Props from './Props';
import {
    Panel,
    Table
} from 'react-bootstrap';

export default function Component(props: ComponentType) {
    const { className, description } = props;

    return (
        <div>
            <h3>{className}</h3>
            <Panel>
                <div dangerouslySetInnerHTML={{
                    __html: markdownToHtml(description)
                }} />
            </Panel>
            <Props {...{ list: props.props }} />
        </div>
    );
}
