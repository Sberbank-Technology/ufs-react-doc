import * as React from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';

import { InterfacesType } from '../../types';
import InterfacesTable from '../InterfacesTable';

interface Props {
    list: InterfacesType[];
}

export default class Component extends React.Component<Props, {}> {

    render() {
        const { list } = this.props;
        if (!list || list.length === 0) {
            return null;
        }

        return (
            <div>
                <PanelGroup defaultActiveKey="1" accordion>
                    <Panel header={'Interfaces'} eventKey="1">
                        <InterfacesTable interfaces={list} />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }
}
