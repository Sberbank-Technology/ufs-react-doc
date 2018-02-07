import * as React from 'react';
import { markdownToHtml } from '../../common/utils';
import { ComponentType } from '../types';
import Props from './Props';
import Functions from './Functions';
import Interfaces from './Interfaces';
import { Panel, Table } from 'react-bootstrap';
import Examples from './Examples';

export default function Component(props: ComponentType) {
    const { className, description, isStandaloneFunction } = props;

    function shortPanel() {
        return (
            <div>
                <h3>{className}</h3>
                <Functions {...{
                    list: props.functions,
                    isStandaloneFunction
                }} />
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
                <Functions {...{
                    list: props.functions,
                    isStandaloneFunction
                }} />
                <Examples
                    className={props.className}
                    srcPath={props.srcPath} />
            </div>
        );
    }

    if (isStandaloneFunction) {
        return shortPanel();
    } else {
        return regularPanel();
    }
}
