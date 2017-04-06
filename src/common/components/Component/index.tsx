import * as React from 'react';
import { markdownToHtml } from '../../../common/utils';
import { ComponentType } from '../types';
import Props from './Props';
import Examples from './Examples';
import { Panel, Table } from 'react-bootstrap';

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
            <Examples
                className={props.className}
                srcPath={props.srcPath} />
        </div>
    );
}
