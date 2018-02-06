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
                        <h4>{iface.name}</h4>
                        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(iface.description) }} />
                        <Table striped bordered condensed hover>
                            <tbody>
                                {iface.props.map((prop, key) => (
                                    <tr key={key}>
                                        <td>{prop.name}</td>
                                        <td>{prop.type}</td>
                                        <td dangerouslySetInnerHTML={{
                                            __html: markdownToHtml(prop.description)
                                        }} />
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}
            </div>
        )
    }
}