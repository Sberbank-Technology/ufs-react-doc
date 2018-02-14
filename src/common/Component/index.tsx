import * as React from 'react';
import { markdownToHtml } from '../../common/utils';
import { ComponentType } from '../types';
import Props from './Props';
import Functions from './Functions';
import Methods from './Methods'
import Interfaces from './Interfaces';
import { Panel, Table } from 'react-bootstrap';
import Examples from './Examples';

export default function Component(props: ComponentType) {
    const { className, description, isFunction } = props;

    function shortPanel() {
        return (
            <div>
                <h3>{className}</h3>
                <Functions {...{ list: props.functions }} />
            </div>
        );
    }

    function regularPanel() {
        return (
            <div>
                <h3>{className}</h3>
                <Panel>
                    <div dangerouslySetInnerHTML={{
                        __html: markdownToHtml(description)
                    }} />
                </Panel>
                <Props {...{ list: props.props }} />
                <Interfaces {...{ list: props.interfaces }} />
                <Methods {...{ list: props.methods }} />
                <Functions {...{ list: props.functions }} />
                <Examples
                    className={props.className}
                    srcPath={props.srcPath} />
            </div>
        );
    }

    if (isFunction) {
        return shortPanel();
    } else {
        return regularPanel();
    }
}
