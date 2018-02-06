import * as React from 'react';
import { Table } from 'react-bootstrap';

import { markdownToHtml } from '../../../common/utils';
import { InterfacesType } from '../../types';

export interface Props {
    interfaces: InterfacesType[];
}

export default class ClassName extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                {this.props.interfaces.map((iface, key) => (
                    <div>
                        <h4><code style={{ color: '#204f65', backgroundColor: 'transparent' }}>{iface.name}</code></h4>
                        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(iface.description) }} />
                        <br />
                        <pre style={{ color: '#204f65', backgroundColor: '#edf7fd' }}>{iface.declaration}</pre>
                        <br />
                        <hr />
                    </div>
                ))}
            </div>
        )
    }
}