import * as React from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';

import { MethodsType } from '../../types';
import MethodsTable from '../MethodsTable';

interface Props {
    list: MethodsType[];
}

export default class Component extends React.Component<Props, {}> {

    render() {
        const { list } = this.props;
        const headerTitle = "Methods";

        if (!list || list.length === 0) {
            return null;
        }

        return (
            <div>
                <PanelGroup defaultActiveKey="1" accordion>
                    <Panel header={headerTitle} eventKey="1">
                        <MethodsTable methods={list} />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }
}
