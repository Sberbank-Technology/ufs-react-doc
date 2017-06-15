import * as React from 'react';
import { PanelGroup, Panel } from 'react-bootstrap';

import { PropsType } from '../../types';
import PropsTable from '../PropsTable';

interface Props {
    list: PropsType[];
}

export default class Component extends React.Component<Props, {}> {

    render() {
        const { list } = this.props;
        if (!list || list.length === 0) {
            return null;
        }
        const ownProps = list.filter(prop => !prop.inheritedFrom);
        const inheritedProps = list.filter(prop => prop.inheritedFrom);

        return (
            <div>
                <PanelGroup defaultActiveKey="1" accordion>
                    <Panel
                        header={'Own props'}
                        eventKey="1"
                    >
                        <PropsTable props={ownProps} />
                    </Panel>
                    {inheritedProps.length > 0 ?
                        <Panel
                            header={'Inherited props'}
                            eventKey="2"
                        >
                            <PropsTable
                                showInheritedFrom
                                props={inheritedProps} />
                        </Panel> :
                        null}
                </PanelGroup>
            </div>
        );
    }
}
